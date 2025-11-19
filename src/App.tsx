import {produce} from 'immer'
import {useEffect, useReducer, useState} from 'react'
import {
	CARD_LIST,
	CardFace,
	CardSlot,
	createState,
	drawCard,
	drawHand,
	setupAttackersDraw,
	setupAttackersPlace,
	setupDefendersBackDraw,
	setupDefendersBackPlace,
	setupDefendersFrontDraw,
	setupDefendersFrontPlace,
	shuffle,
	type IAction,
	type IState,
} from './lib'
import {Todo} from './todo'

import './App.css'

const stringifyState = <T,>(obj: T, space = 4) => {
	const jsonString = JSON.stringify(
		obj,
		(key, value) => {
			// print integer arrays on one line
			if (Array.isArray(value) && value.every(item => typeof item === 'number'))
				return JSON.stringify(value)

			// print small objects on one line
			if (
				!['history', 'players'].includes(key) &&
				typeof value === 'object' &&
				Object.keys(value).length <= 2
			)
				return JSON.stringify(value)

			// default stringification
			return value
		},
		space
	)

	return (
		jsonString
			// Unescape internal quotes
			.replace(/\\"/g, '"')
			// unescape arrays
			.replace(/"\[/g, '[')
			.replace(/]"/g, ']')
			// unescape objects
			.replace(/"\{/g, '{')
			.replace(/}"/g, '}')
	)
}

const reducer = (state: IState, action: IAction) => {
	switch (action.type) {
		case 'setup-shuffle':
			shuffle(state)
			break

		case 'setup-attackers-draw':
			setupAttackersDraw(state)
			break

		case 'setup-attackers-place':
			setupAttackersPlace(state, action)
			break

		case 'setup-defenders-front-draw':
			setupDefendersFrontDraw(state)
			break

		case 'setup-defenders-front-place':
			setupDefendersFrontPlace(state, action)
			break

		case 'setup-defenders-back-draw':
			setupDefendersBackDraw(state)
			break

		case 'setup-defenders-back-place':
			setupDefendersBackPlace(state, action)
			break
		case 'setup-draw-hand':
			drawHand(state)
			break

		case 'turn-draw-card':
			drawCard(state, action)
			break

		default:
			console.log(action)
	}

	state.history.push(action)

	return state
}

type IActionType = IState['history'][number]['type'][]

const getNextActions = (state: IState): IActionType => {
	const lastActionType = state.history.slice(-1)[0]?.type ?? ''
	if (!lastActionType) return ['setup-shuffle']

	if (/^setup-/.test(lastActionType)) {
		const order = [
			'setup-shuffle',
			'setup-attackers-draw',
			'setup-attackers-place',
			'setup-defenders-front-draw',
			'setup-defenders-front-place',
			'setup-defenders-back-draw',
			'setup-defenders-back-place',
			'setup-draw-hand',
			'turn-draw-card',
		] as const

		/** @ts-expect-error If the last action is a different type, this logic path will not be gone down due to the if statement. Thus, 1:1 overlap is not necessary. */
		return [order[order.indexOf(lastActionType) + 1]]
	}

	/** @note implicit if (/^turn-/.test(lastAction)) // since an ^end state would finish the game */

	// <check4victory>
	const p1CapturedAllyCount = state.players[0].captives.length
	const p2CapturedAllyCount = state.players[1].captives.length

	const p1Wins = p2CapturedAllyCount === 6
	const p2Wins = p1CapturedAllyCount === 6

	if (p1Wins && p2Wins) return ['end-draw']
	if (p1Wins || p2Wins) return ['end-victory']
	// </check4victory>

	if (lastActionType === 'turn-end') return ['turn-draw-card']

	// <list-options-left>
	// Who made the last move?
	/** @ts-expect-error All ^turn actions will have a player prop */
	const whoseTurn = state.history.slice(-1)[0].player

	// get all actions taken by the player this turn
	/** @ts-expect-error All ^turn actions will have a player prop */
	const lastOpponentActionI = state.history.findLastIndex(action => action.player !== whoseTurn)
	const actionsTakenThisTurn = state.history.slice(lastOpponentActionI + 1).map(({type}) => type)

	// return actions not yet taken
	return (['turn-play-card', 'turn-activate-ability', 'turn-attack', 'turn-end'] as const).filter(
		actionType => !actionsTakenThisTurn.includes(actionType)
	)
}

const calculateTentativeState = (state: IState, tmpSetupPlacementState: number[]) => {
	const nextActions = getNextActions(state)
	const nextAction = nextActions[0]
	if (!/^setup(.+)place$/.test(nextAction)) return state

	const copyOfState: IState = JSON.parse(JSON.stringify(state))

	if (nextAction === 'setup-attackers-place')
		Object.assign(copyOfState.players[0].attackers, tmpSetupPlacementState)
	else if (nextAction === 'setup-defenders-front-place')
		Object.assign(
			copyOfState.players[0].defenders,
			Object.fromEntries(tmpSetupPlacementState.map((id, i) => [i, [id, 1]]))
		)
	else if (nextAction === 'setup-defenders-back-place')
		Object.assign(
			copyOfState.players[0].defenders,
			Object.fromEntries(tmpSetupPlacementState.map((id, i) => [i + 3, [id, 0]]))
		)

	return copyOfState
}

const immerReducer = produce(reducer)

function App() {
	const deck = Object.keys(CARD_LIST)

	const [state, setState] = useReducer(immerReducer, createState(deck, deck))
	const [tmpSetupPlacementState, setSetupPlacementState] = useState<
		IState['cardList'][number]['id'][]
	>([])
	const tentativeState = calculateTentativeState(state, tmpSetupPlacementState)

	const yourAttackers = state.players[0].attackers
	const foeAttackers = state.players[1].attackers
	const foeDefenders = state.players[1].defenders

	const nextActions = getNextActions(state)
	const nextAction = nextActions[0]

	// place cards (in setup phase)
	useEffect(() => {
		if (!/^setup(.+)place$/.test(nextAction)) return
		if (tmpSetupPlacementState.length !== 3) return

		setSetupPlacementState([])
		setState({
			type: nextAction,
			order: [tmpSetupPlacementState, state.players[1].hand],
		} as IAction)
	}, [nextAction, state.players, tmpSetupPlacementState])

	return (
		<section data-component="table">
			<Todo />
			<div data-slot="foes-hand">
				{state.players[1].hand.map((cardId, i) => (
					<div data-slot={`foes-hand-${i}`} data-facedown="true" key={cardId}></div>
				))}
			</div>
			<div data-component="board">
				<CardSlot
					cardList={state.cardList}
					cards={state.players[1].deck}
					facedown={true}
					label="deck"
					name="foes-deck"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeAttackers[5]}
					label="A"
					name="foes-attacker-5"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeAttackers[4]}
					label="T"
					name="foes-attacker-4"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeAttackers[3]}
					label="K"
					name="foes-attacker-3"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeDefenders[5]?.[0]}
					facedown={!!foeDefenders[5]?.[1]}
					label="D"
					name="foes-defender-5"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeDefenders[4]?.[0]}
					facedown={!!foeDefenders[4]?.[1]}
					label="E"
					name="foes-defender-4"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeDefenders[3]?.[0]}
					facedown={!!foeDefenders[3]?.[1]}
					label="F"
					name="foes-defender-3"
				/>
				<CardSlot cardList={state.cardList} name="foes-empty-slot" />
				{/* new row */}
				<CardSlot
					cardList={state.cardList}
					cards={state.players[1].discard}
					label="Discard"
					name="foes-discard"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeAttackers[2]}
					label="A"
					name="foes-attacker-2"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeAttackers[1]}
					label="T"
					name="foes-attacker-1"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeAttackers[0]}
					label="K"
					name="foes-attacker-0"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeDefenders[2]?.[0]}
					facedown={!!foeDefenders[2]?.[1]}
					label="D"
					name="foes-defender-2"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeDefenders[1]?.[0]}
					facedown={!!foeDefenders[1]?.[1]}
					label="E"
					name="foes-defender-1"
				/>
				<CardSlot
					cardList={state.cardList}
					card={foeDefenders[0]?.[0]}
					facedown={!!foeDefenders[0]?.[1]}
					label="F"
					name="foes-defender-0"
				/>
				<CardSlot
					cardList={state.cardList}
					cards={state.players[1].captives}
					label="Captives"
					name="foes-captives"
				/>
				{/* dividing line */}
				<CardSlot
					cardList={state.cardList}
					cards={state.players[0].captives}
					label="Captives"
					name="your-captives"
				/>
				<CardSlot
					cardList={state.cardList}
					card={tentativeState.players[0].defenders[0]?.[0]}
					facedown={!!tentativeState.players[0].defenders[0]?.[1]}
					label="D"
					name="your-defender-0"
					tentativeMove={
						tentativeState.players[0].defenders[0]?.[0] !==
						state.players[0].defenders[0]?.[0]
					}
				/>
				<CardSlot
					cardList={state.cardList}
					card={tentativeState.players[0].defenders[1]?.[0]}
					facedown={!!tentativeState.players[0].defenders[1]?.[1]}
					label="E"
					name="your-defender-1"
					tentativeMove={
						tentativeState.players[0].defenders[1]?.[0] !==
						state.players[0].defenders[1]?.[0]
					}
				/>
				<CardSlot
					cardList={state.cardList}
					card={tentativeState.players[0].defenders[2]?.[0]}
					facedown={!!tentativeState.players[0].defenders[2]?.[1]}
					label="F"
					name="your-defender-2"
					tentativeMove={
						tentativeState.players[0].defenders[2]?.[0] !==
						state.players[0].defenders[2]?.[0]
					}
				/>
				<CardSlot
					cardList={state.cardList}
					card={tentativeState.players[0].attackers[0]}
					label="A"
					name="your-attacker-0"
					tentativeMove={
						tentativeState.players[0].attackers[0] !== state.players[0].attackers[0]
					}
				/>
				<CardSlot
					cardList={state.cardList}
					card={tentativeState.players[0].attackers[1]}
					label="T"
					name="your-attacker-1"
					tentativeMove={
						tentativeState.players[0].attackers[1] !== state.players[0].attackers[1]
					}
				/>
				<CardSlot
					cardList={state.cardList}
					card={tentativeState.players[0].attackers[2]}
					label="K"
					name="your-attacker-2"
					tentativeMove={
						tentativeState.players[0].attackers[2] !== state.players[0].attackers[2]
					}
				/>
				<CardSlot
					cardList={state.cardList}
					cards={state.players[0].discard}
					label="Discard"
					name="your-discard"
				/>
				{/* new row */}
				<CardSlot cardList={state.cardList} name="your-empty-slot" />

				<CardSlot
					cardList={state.cardList}
					card={tentativeState.players[0].defenders[3]?.[0]}
					facedown={!!tentativeState.players[0].defenders[3]?.[1]}
					label="D"
					name="your-defender-3"
					tentativeMove={
						tentativeState.players[0].defenders[3]?.[0] !==
						state.players[0].defenders[3]?.[0]
					}
				/>
				<CardSlot
					cardList={state.cardList}
					card={tentativeState.players[0].defenders[4]?.[0]}
					facedown={!!tentativeState.players[0].defenders[4]?.[1]}
					label="E"
					name="your-defender-4"
					tentativeMove={
						tentativeState.players[0].defenders[4]?.[0] !==
						state.players[0].defenders[4]?.[0]
					}
				/>
				<CardSlot
					cardList={state.cardList}
					card={tentativeState.players[0].defenders[5]?.[0]}
					facedown={!!tentativeState.players[0].defenders[5]?.[1]}
					label="F"
					name="your-defender-5"
					tentativeMove={
						tentativeState.players[0].defenders[5]?.[0] !==
						state.players[0].defenders[5]?.[0]
					}
				/>
				<CardSlot
					cardList={state.cardList}
					card={yourAttackers[3]}
					label="A"
					name="your-attacker-3"
				/>
				<CardSlot
					cardList={state.cardList}
					card={yourAttackers[4]}
					label="T"
					name="your-attacker-4"
				/>
				<CardSlot
					cardList={state.cardList}
					card={yourAttackers[5]}
					label="K"
					name="your-attacker-5"
				/>
				<CardSlot
					cardList={state.cardList}
					cards={state.players[0].deck}
					facedown={true}
					label="deck"
					name="your-deck"
				/>
			</div>
			<div data-slot="your-hand">
				{state.players[0].hand.map((cardId, i) => {
					const selectedPlacement = tmpSetupPlacementState.includes(cardId)
					const selectable = /^setup(.+)place$/.test(nextAction) && !selectedPlacement

					const action = /^setup(.+)place$/.test(nextAction)
						? () => {
								setSetupPlacementState(tmpState =>
									selectedPlacement
										? tmpState.filter(aCardId => aCardId !== cardId)
										: tmpState.concat([cardId])
								)
						  }
						: undefined

					return (
						<div
							data-selectable={selectable}
							data-selected-placement={selectedPlacement}
							data-slot={`your-hand-${i}`}
							key={cardId}
							onClick={() => action?.()}
						>
							<CardFace number={state.cardList[cardId].cardNumber} />
						</div>
					)
				})}
			</div>
			{nextAction === 'setup-shuffle' ? (
				<button data-next-action="true" onClick={() => setState({type: 'setup-shuffle'})}>
					Shuffle Decks
				</button>
			) : nextAction === 'setup-attackers-draw' ? (
				<button
					data-next-action="true"
					onClick={() => setState({type: 'setup-attackers-draw'})}
				>
					Draw Cards for Attacker Setup
				</button>
			) : nextAction === 'setup-attackers-place' ? (
				'Place Attackers'
			) : nextAction === 'setup-defenders-front-draw' ? (
				<button
					data-next-action="true"
					onClick={() => setState({type: 'setup-defenders-front-draw'})}
				>
					Draw Cards for Frontline Defender Setup
				</button>
			) : nextAction === 'setup-defenders-back-draw' ? (
				<button
					data-next-action="true"
					onClick={() => setState({type: 'setup-defenders-back-draw'})}
				>
					Draw Cards for Back line Defender Setup
				</button>
			) : nextAction === 'setup-draw-hand' ? (
				<button data-next-action="true" onClick={() => setState({type: 'setup-draw-hand'})}>
					Draw Hand
				</button>
			) : nextAction === 'turn-draw-card' ? (
				<button
					data-next-action="true"
					onClick={() => setState({type: 'turn-draw-card', player: 0})}
				>
					Draw Card (P1)
				</button>
			) : (
				'End of Supported Gameplay'
			)}
			<output>
				<header>Debug State:</header>
				<b>Current Phase: {nextActions.join(',')}</b>
				<pre>{stringifyState(state)}</pre>
				<b>Tentative State</b>
				<pre>{stringifyState(tentativeState)}</pre>
			</output>
		</section>
	)
}

export default App
