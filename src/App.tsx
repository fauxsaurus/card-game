import {useState} from 'react'
import './App.css'
import {Todo} from './todo'
import {CARD_LIST, createState} from './lib'

function App() {
	const deck = Object.keys(CARD_LIST)

	const [state, setState] = useState(createState(deck, deck))

	const yourDeckSize = state.players[0].deck.length
	const foeDeckSize = state.players[1].deck.length

	return (
		<>
			<Todo />
			<div data-component="board">
				<div data-slot="foes-deck" data-stack={foeDeckSize}>
					{foeDeckSize}
				</div>

				<div data-slot="foes-attacker-5"></div>
				<div data-slot="foes-attacker-4"></div>
				<div data-slot="foes-attacker-3"></div>

				<div data-slot="foes-defender-5"></div>
				<div data-slot="foes-defender-4"></div>
				<div data-slot="foes-defender-3"></div>

				<div data-slot="empty"></div>
				{/* new row */}
				<div data-slot="foes-discard"></div>

				<div data-slot="foes-attacker-2"></div>
				<div data-slot="foes-attacker-1"></div>
				<div data-slot="foes-attacker-0"></div>

				<div data-slot="foes-defender-2"></div>
				<div data-slot="foes-defender-1"></div>
				<div data-slot="foes-defender-0"></div>

				<div data-slot="foes-captives"></div>

				{/* dividing line */}

				<div data-slot="your-captives"></div>
				<div data-slot="your-defender-0"></div>
				<div data-slot="your-defender-1"></div>
				<div data-slot="your-defender-2"></div>

				<div data-slot="your-attacker-0"></div>
				<div data-slot="your-attacker-1"></div>
				<div data-slot="your-attacker-2"></div>

				<div data-slot="your-discard"></div>

				{/* new row */}
				<div data-slot="empty"></div>

				<div data-slot="your-defender-3"></div>
				<div data-slot="your-defender-4"></div>
				<div data-slot="your-defender-5"></div>

				<div data-slot="your-attacker-3"></div>
				<div data-slot="your-attacker-4"></div>
				<div data-slot="your-attacker-5"></div>

				<div data-slot="your-deck" data-stack={yourDeckSize}>
					{yourDeckSize}
				</div>
			</div>
			<div data-slot="your-hand"></div>
		</>
	)
}

export default App
