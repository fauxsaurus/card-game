import {drawFullHand} from './hand'
import type {IState} from './state'

type IInt = number
type IArg = {order: [[IInt, IInt, IInt], [IInt, IInt, IInt]]}

export const setupDefendersFrontDraw = (state: IState) => drawFullHand(state)
export const setupDefendersBackDraw = (state: IState) => drawFullHand(state)

export const setupDefendersFrontPlace = (state: IState, {order}: IArg) => {
	state.players[0].hand = []
	state.players[1].hand = []

	order[0].forEach((cardId, i) => {
		state.players[0].defenders[i as keyof IState['players'][number]['defenders']] = [cardId, 1]
	})

	order[1].forEach((cardId, i) => {
		state.players[1].defenders[i as keyof IState['players'][number]['defenders']] = [cardId, 1]
	})

	return state
}
export const setupDefendersBackPlace = (state: IState, {order}: IArg) => {
	state.players[0].hand = []
	state.players[1].hand = []

	order[0].forEach((cardId, i) => {
		state.players[0].defenders[(i + 3) as keyof IState['players'][number]['defenders']] = [
			cardId,
			0,
		]
	})

	order[1].forEach((cardId, i) => {
		state.players[1].defenders[(i + 3) as keyof IState['players'][number]['defenders']] = [
			cardId,
			0,
		]
	})

	return state
}
