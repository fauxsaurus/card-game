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
DX
	remove state.cardList and card ids (if card numbers would work just as well)
		use field positions to specify card attacks instead of card Ids
		using card numbers directly could allow <CardSlot>s to id cards easier
		(currently card ids are non-zero to prevent a bug with <CardSlot> i.e., a card with an id of 0 does not show up when placed faceup--scrapping card list would automatically resolve this issue/work around)
AI
	allow the AI to strategically place cards in the setup phase
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
