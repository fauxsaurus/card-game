import type {IAction} from './actions'
import type {ICardNumber} from './CARD_LIST'

type IInt = number
type IIsFaceDown = 0 | 1
type IField<T> = Partial<Record<0 | 1 | 2 | 3 | 4 | 5, T>>

type IPlayerState = {
	// field
	attackers: IField<IInt>
	defenders: IField<[IInt, IIsFaceDown]>
	// stacks
	/** @note This represents the number of allies captured (i.e., if it hits 6, that player loses). */
	captives: IInt[]
	discard: IInt[]
	deck: IInt[]
	hand: IInt[]
}

export type IState = {
	cardList: Record<IInt, {id: IInt; cardNumber: ICardNumber}>
	players: [IPlayerState, IPlayerState]
	history: IAction[]
}

export const createState = (cardsInDeckP1: ICardNumber[], cardsInDeckP2: ICardNumber[]): IState => {
	const cards: IState['cardList'] = cardsInDeckP1
		.concat(cardsInDeckP2)
		.map((cardNumber, id) => ({cardNumber, id: id + 1}))
		.reduce((obj, value) => Object.assign(obj, {[value.id]: value}), {})

	const p1Deck = Array(cardsInDeckP1.length)
		.fill(1)
		.map((minId, id) => minId + id)

	const p2Deck = Array(cardsInDeckP2.length)
		.fill(p1Deck.length)
		.map((minId, id) => minId + id)

	const basePlayerState = {attackers: {}, defenders: {}, captives: [], discard: [], hand: []}

	return {
		cardList: cards,
		players: [
			Object.assign({}, basePlayerState, {deck: p1Deck}),
			Object.assign({}, basePlayerState, {deck: p2Deck}),
		],
		history: [],
	}
}
