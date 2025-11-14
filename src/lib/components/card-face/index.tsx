import {CARD_LIST, type ICard} from '../../CARD_LIST'

export const CardFace = ({number}: {number: ICard['cardNumber']}) => {
	const card = CARD_LIST[number]

	return (
		<div className="card-face">
			({card.cardNumber}) {card.pow}
		</div>
	)
}
