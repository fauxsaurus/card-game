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

export const drawHand = drawFullHand

export const drawCard = (state: IState, action: {player: 0 | 1}) => {
	const player = state.players[action.player]
	const [hand, deck] = splitArrayAt(1, player.deck)

	player.deck = deck
	player.hand = player.hand.concat(hand)

	return state
}

export const discardCards = (state: IState, action: {player: 0 | 1; cards: number[]}) => {
	const player = state.players[action.player]
	const cards2discard = action.cards

	player.hand = player.hand.filter(cardId => !cards2discard.includes(cardId))
	player.discard = cards2discard.concat(player.discard) // stack, not a queue FIFO

	return state
}

const splitArrayAt = <T>(i: number, arr: T[]) => [arr.slice(0, i), arr.slice(i)]
