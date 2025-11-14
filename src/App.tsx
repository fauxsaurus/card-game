import {produce} from 'immer'
import {useReducer, useState} from 'react'
import {
	CARD_LIST,
	CardSlot,
	createState,
	setupAttackersDraw,
	shuffle,
	type IAction,
	type ICard,
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

const Card = ({number}: {number: ICard['cardNumber']}) => {
	const card = CARD_LIST[number]

	return (
		<>
			({card.cardNumber}) {card.pow}
		</>
	)
}

const immerReducer = produce((state: IState, action: IAction) => {
	switch (action.type) {
		case 'shuffle':
			shuffle(state)
			break

		case 'setup-attackers-draw':
			setupAttackersDraw(state)
			break

		default:
			console.log(action)
	}

	state.history.push(action)

	return state
})

function App() {
	const deck = Object.keys(CARD_LIST)

	const [state, setState] = useReducer(immerReducer, createState(deck, deck))
	const [tmpSetupPlacementState, setSetupPlacementState] = useState<
		IState['cardList'][number]['id'][]
	>([])

	const yourAttackers = state.players[0].attackers
	const yourDefenders = state.players[0].defenders

	const foeAttackers = state.players[1].attackers
	const foeDefenders = state.players[1].defenders

	const lastAction = state.history.slice(-1)[0]?.['type'] || 'none'

	const shouldPlaceAttackers = lastAction === 'setup-attackers-draw'

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
					cards={state.players[1].deck}
					facedown={true}
					label="deck"
					name="foes-deck"
				/>
				<CardSlot card={foeAttackers[5]} label="A" name="foes-attacker-5" />
				<CardSlot card={foeAttackers[4]} label="T" name="foes-attacker-4" />
				<CardSlot card={foeAttackers[3]} label="K" name="foes-attacker-3" />
				<CardSlot
					card={foeDefenders[5]?.[0]}
					data-facedown={foeDefenders[5]?.[1]}
					label="D"
					name="foes-defender-5"
				/>
				<CardSlot
					card={foeDefenders[4]?.[0]}
					data-facedown={foeDefenders[4]?.[1]}
					label="E"
					name="foes-defender-4"
				/>
				<CardSlot
					card={foeDefenders[3]?.[0]}
					data-facedown={foeDefenders[3]?.[1]}
					label="F"
					name="foes-defender-3"
				/>
				<CardSlot name="foes-empty-slot" />
				{/* new row */}
				<CardSlot cards={state.players[1].discard} label="Discard" name="foes-discard" />
				<CardSlot card={foeAttackers[2]} label="A" name="foes-attacker-2" />
				<CardSlot card={foeAttackers[1]} label="T" name="foes-attacker-1" />
				<CardSlot card={foeAttackers[0]} label="K" name="foes-attacker-0" />
				<CardSlot
					card={foeDefenders[2]?.[0]}
					data-facedown={foeDefenders[2]?.[1]}
					label="D"
					name="foes-defender-2"
				/>
				<CardSlot
					card={foeDefenders[1]?.[0]}
					data-facedown={foeDefenders[1]?.[1]}
					label="E"
					name="foes-defender-1"
				/>
				<CardSlot
					card={foeDefenders[0]?.[0]}
					data-facedown={foeDefenders[0]?.[1]}
					label="F"
					name="foes-defender-0"
				/>
				<CardSlot cards={state.players[1].captives} label="Captives" name="foes-captives" />
				{/* dividing line */}
				<CardSlot cards={state.players[0].captives} label="Captives" name="your-captives" />
				<CardSlot
					card={yourDefenders[0]?.[0]}
					data-facedown={yourDefenders[0]?.[1]}
					label="D"
					name="your-defender-0"
				/>
				<CardSlot
					card={yourDefenders[1]?.[0]}
					data-facedown={yourDefenders[1]?.[1]}
					label="E"
					name="your-defender-1"
				/>
				<CardSlot
					card={yourDefenders[2]?.[0]}
					data-facedown={yourDefenders[2]?.[1]}
					label="F"
					name="your-defender-2"
				/>
				<CardSlot
					card={yourAttackers[0] || tmpSetupPlacementState[0]}
					label="A"
					name="your-attacker-0"
				/>
				<CardSlot
					card={yourAttackers[1] || tmpSetupPlacementState[1]}
					label="T"
					name="your-attacker-1"
				/>
				<CardSlot
					card={yourAttackers[2] || tmpSetupPlacementState[2]}
					label="K"
					name="your-attacker-2"
				/>
				<CardSlot cards={state.players[0].discard} label="Discard" name="your-discard" />
				{/* new row */}
				<CardSlot name="your-empty-slot" />

				<CardSlot
					card={yourDefenders[3]?.[0]}
					data-facedown={yourDefenders[3]?.[1]}
					label="D"
					name="your-defender-3"
				/>
				<CardSlot
					card={yourDefenders[4]?.[0]}
					data-facedown={yourDefenders[4]?.[1]}
					label="E"
					name="your-defender-5"
				/>
				<CardSlot
					card={yourDefenders[5]?.[0]}
					data-facedown={yourDefenders[5]?.[1]}
					label="F"
					name="your-defender-5"
				/>
				<CardSlot card={yourAttackers[3]} label="A" name="your-attacker-3" />
				<CardSlot card={yourAttackers[4]} label="T" name="your-attacker-4" />
				<CardSlot card={yourAttackers[5]} label="K" name="your-attacker-5" />
				<CardSlot
					cards={state.players[0].deck}
					facedown={true}
					label="deck"
					name="your-deck"
				/>
			</div>
			<div data-slot="your-hand">
				{state.players[0].hand.map((cardId, i) => {
					const selectedPlacement = tmpSetupPlacementState.includes(cardId)
					const selectable = shouldPlaceAttackers && !selectedPlacement

					const action = shouldPlaceAttackers
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
			{lastAction === 'none' && (
				<button data-next-action="true" onClick={() => setState({type: 'shuffle'})}>
					Shuffle Decks
				</button>
			)}
			{lastAction === 'shuffle' && (
				<button
					data-next-action="true"
					onClick={() => setState({type: 'setup-attackers-draw'})}
				>
					Draw Cards for Attacker Setup
				</button>
			)}
			{shouldPlaceAttackers && 'Place Attackers'}
			<output>
				<header>Debug State:</header>
				<pre>{stringifyState(state)}</pre>
			</output>
		</section>
	)
}

export default App
