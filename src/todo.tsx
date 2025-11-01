import {useState} from 'react'

const todo = `
STATE
	add turn
	add actions available, taken
	add history of moves (super important for analyzing AI matches)
UI
	add deck selection
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
