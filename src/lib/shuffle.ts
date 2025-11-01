import type {IState} from './state'

export const shuffle = (state: IState) => {
	state.players[0].deck = shuffleArray(state.players[0].deck)
	state.players[1].deck = shuffleArray(state.players[1].deck)

	return state
}

const shuffleArray = <T>(array: T[]): T[] => {
	const newArray = array.slice()

	// @note [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle)
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
	}

	return newArray
}
