import type {IState} from './state'

type IInt = number
type IArg = {order: [[IInt, IInt, IInt], [IInt, IInt, IInt]]}

export const setupAttackersDraw = (state: IState) => {
	const [p1Hand, p1Deck] = splitArrayAt(3, state.players[0].deck)
	const [p2Hand, p2Deck] = splitArrayAt(3, state.players[1].deck)

	state.players[0].deck = p1Deck
	state.players[1].deck = p2Deck

	state.players[0].hand = p1Hand
	state.players[1].hand = p2Hand

	return state
}

export const setupAttackersPlace = (state: IState, {order}: IArg) => {
	state.players[0].hand = []
	state.players[1].hand = []

	state.players[0].attackers = order[0]
	state.players[1].attackers = order[1]

	return state
}

const splitArrayAt = <T>(i: number, arr: T[]) => [arr.slice(0, i), arr.slice(i)]
