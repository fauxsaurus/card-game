import {useState} from 'react'

const todo = `
STATE
	add turn
	add actions available, taken
	add history of moves (super important for analyzing AI matches)
UI
	add deck selection
	<CardSlot />
		show face up cards
		show the stack counter in the corner
	make player hand slots always take up card height (i.e., don't move UI around when their hands are empty)
UX
	move the buttons onto the proper UI elements on the board after logic is properly implemented
DX
	remove state.cardList and card ids (if card numbers would work just as well)
		use field positions to specify card attacks instead of card Ids
		using card numbers directly could allow <CardSlot>s to id cards easier
		(currently card ids are non-zero to prevent a bug with <CardSlot> i.e., a card with an id of 0 does not show up when placed faceup--scrapping card list would automatically resolve this issue/work around)
		HOW WOULD PLACING TWO CARDS WITH THE SAME CARD NUMBER WORK IN THE SETUP PHASE WITHOUT CARD LIST?
	replace foe's hand with <CardSlot>s
Logic
	allow dependency injection in the reducer to AI play test different rulesets and examine win rates
		somehow need to manage the same on card event handlers and effects
	consolidate lastAction inferences into nextAction (for clarity in the logic about what UI is shown in order to allow players to make the proper inputs for their choices)
	create a display state (based on intermediate tmp setup state) and have the tentative move attribute be filled by checking for differences with display state and intermediate state to greatly simplify attribute passing to card slots.
AI
	allow the AI to strategically place cards in the setup phase
Licensing
	determine proper license (potentially dual licensing code and art)
`
export const Todo = () => {
	const [show, setShow] = useState(true)

	return (
		show && (
			<section style={{outline: '1px solid #000'}}>
				<header>
					To Do: <button onClick={() => setShow(false)}>Hide</button>
				</header>
				<pre style={{tabSize: 4}}>{todo}</pre>
			</section>
		)
	)
}
