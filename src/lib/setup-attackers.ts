import {drawFullHand} from './draw-hand'
import type {IState} from './state'

type IInt = number
type IArg = {order: [[IInt, IInt, IInt], [IInt, IInt, IInt]]}

export const setupAttackersDraw = (state: IState) => drawFullHand(state)

export const setupAttackersPlace = (state: IState, {order}: IArg) => {
	state.players[0].hand = []
	state.players[1].hand = []

	state.players[0].attackers = Object.assign({}, order[0])
	state.players[1].attackers = Object.assign({}, order[1])

	return state
}
