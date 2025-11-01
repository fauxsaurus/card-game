import {produce} from 'immer'
import {useReducer} from 'react'
import {CARD_LIST, createState, setupAttackersDraw, shuffle, type IAction, type IState} from './lib'
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

	const yourDeckSize = state.players[0].deck.length
	const foeDeckSize = state.players[1].deck.length

	const yourAttackers = state.players[0].attackers
	const yourDefenders = state.players[0].defenders

	const foeAttackers = state.players[1].attackers
	const foeDefenders = state.players[1].defenders

	return (
		<>
			<Todo />
			<div data-component="board">
				<div data-slot="foes-deck" data-stack={foeDeckSize}>
					{foeDeckSize}
				</div>

				<div data-slot="foes-attacker-5" data-empty={!foeAttackers[5]}>
					A
				</div>
				<div data-slot="foes-attacker-4" data-empty={!foeAttackers[4]}>
					T
				</div>
				<div data-slot="foes-attacker-3" data-empty={!foeAttackers[3]}>
					K
				</div>

				<div data-slot="foes-defender-5" data-empty={!foeDefenders[5]}>
					D
				</div>
				<div data-slot="foes-defender-4" data-empty={!foeDefenders[4]}>
					E
				</div>
				<div data-slot="foes-defender-3" data-empty={!foeDefenders[3]}>
					F
				</div>

				<div data-slot="empty"></div>
				{/* new row */}
				<div
					className="long-text"
					data-slot="foes-discard"
					data-stack={state.players[1].discard.length}
				>
					Discard
				</div>

				<div data-slot="foes-attacker-2" data-empty={!foeAttackers[2]}>
					A
				</div>
				<div data-slot="foes-attacker-1" data-empty={!foeAttackers[1]}>
					T
				</div>
				<div data-slot="foes-attacker-0" data-empty={!foeAttackers[0]}>
					K
				</div>

				<div data-slot="foes-defender-2" data-empty={!foeDefenders[2]}>
					D
				</div>
				<div data-slot="foes-defender-1" data-empty={!foeDefenders[1]}>
					E
				</div>
				<div data-slot="foes-defender-0" data-empty={!foeDefenders[0]}>
					F
				</div>

				<div
					className="long-text"
					data-slot="foes-captives"
					data-stack={state.players[1].captives.length}
				>
					Captives
				</div>

				{/* dividing line */}

				<div
					className="long-text"
					data-slot="your-captives"
					data-stack={state.players[0].captives.length}
				>
					Captives
				</div>
				<div data-slot="your-defender-0" data-empty={!yourDefenders[0]}>
					D
				</div>
				<div data-slot="your-defender-1" data-empty={!yourDefenders[1]}>
					E
				</div>
				<div data-slot="your-defender-2" data-empty={!yourDefenders[2]}>
					F
				</div>

				<div data-slot="your-attacker-0" data-empty={!yourAttackers[0]}>
					A
				</div>
				<div data-slot="your-attacker-1" data-empty={!yourAttackers[1]}>
					T
				</div>
				<div data-slot="your-attacker-2" data-empty={!yourAttackers[2]}>
					K
				</div>

				<div
					className="long-text"
					data-slot="your-discard"
					data-stack={state.players[0].discard.length}
				>
					Discard
				</div>

				{/* new row */}
				<div data-slot="empty"></div>

				<div data-slot="your-defender-3" data-empty={!yourDefenders[3]}>
					D
				</div>
				<div data-slot="your-defender-4" data-empty={!yourDefenders[4]}>
					E
				</div>
				<div data-slot="your-defender-5" data-empty={!yourDefenders[5]}>
					F
				</div>

				<div data-slot="your-attacker-3" data-empty={!yourAttackers[3]}>
					A
				</div>
				<div data-slot="your-attacker-4" data-empty={!yourAttackers[4]}>
					T
				</div>
				<div data-slot="your-attacker-5" data-empty={!yourAttackers[5]}>
					K
				</div>

				<div data-slot="your-deck" data-stack={yourDeckSize}>
					{yourDeckSize}
				</div>
			</div>
			<div data-slot="your-hand"></div>
			{!state.history.length && (
				<button onClick={() => setState({type: 'shuffle'})}>Shuffle Decks</button>
			)}
			{state.history.length === 1 && (
				<button onClick={() => setState({type: 'setup-attackers-draw'})}>
					Draw Cards for Attacker Setup
				</button>
			)}
			<output>
				<header>State:</header>
				<pre>{stringifyState(state)}</pre>
			</output>
		</>
	)
}

export default App
