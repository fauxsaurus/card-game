import {useState} from 'react'

const todo = `
STATE
	add turn
	add actions available, taken
	add history of moves (super important for analyzing AI matches)
UI
	add deck selection
	add layout
`
export const Todo = () => {
	const [show, setShow] = useState(true)

	return (
		show && (
			<>
				<header>
					To Do: <button onClick={() => setShow(false)}>Hide</button>
				</header>
				<pre style={{tabSize: 4}}>{todo}</pre>
			</>
		)
	)
}
