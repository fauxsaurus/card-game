import {useState} from 'react'

const todo = `
STATE
	add turn
	add actions available
UI
	add deck selection
	<CardSlot />
		show the stack counter in the corner
UX
	move the buttons onto the proper UI elements on the board after logic is properly implemented
DX
	remove state.cardList and card ids (if card numbers would work just as well)
		use field positions to specify card attacks instead of card Ids
		using card numbers directly could allow <CardSlot>s to id cards easier
		(currently card ids are non-zero to prevent a bug with <CardSlot> i.e., a card with an id of 0 does not show up when placed faceup--scrapping card list would automatically resolve this issue/work around)
		HOW WOULD PLACING TWO CARDS WITH THE SAME CARD NUMBER WORK IN THE SETUP PHASE WITHOUT CARD LIST?
			What if the card list was removed and cards merely maintained their id property? Would that solve everything?
	replace foe's hand with <CardSlot>s
	remove logic from <EndTurnButton> to replace it with a more generic button component (Actually, no, figure out where the end turn clickable would be--might not be a button long-term.)
	create a utility action type IAction<'sub-type'> to return a particular type or all of the potential | action | union | types.
Logic
	allow dependency injection in the reducer to AI play test different rulesets and examine win rates
		somehow need to manage the same on card event handlers and effects
	create a display state (based on intermediate tmp setup state) and have the tentative move attribute be filled by checking for differences with display state and intermediate state to greatly simplify attribute passing to card slots.
	Could/should the player property be dropped from action (i.e., if the player whose turn it is can be calculated programmatically, then such data is unnecessary)
	Have an effect automatically set phaseInProgress when matching /^setup(.+)place$/? (To centralize all in progress states? How should this behave when the buttons are removed from the board and many cards are selectable at any given moment?)
performance
	improve tentativeState calculation with immer and/or jotai atoms
AI
	allow the AI to strategically 
		place cards in the setup phase
		discard cards
Licensing
	determine proper license (potentially dual licensing code and art)
Gameplay
	Ensure that hovering over an opponent's facedown card never reveals their ability--or any info about them.
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
