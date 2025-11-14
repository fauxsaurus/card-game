import type {IState} from './state'

export const drawFullHand = (state: IState) => {
	const [p1Hand, p1Deck] = splitArrayAt(3, state.players[0].deck)
	const [p2Hand, p2Deck] = splitArrayAt(3, state.players[1].deck)

	state.players[0].deck = p1Deck
	state.players[1].deck = p2Deck

	state.players[0].hand = p1Hand
	state.players[1].hand = p2Hand

	return state
}

const splitArrayAt = <T>(i: number, arr: T[]) => [arr.slice(0, i), arr.slice(i)]
