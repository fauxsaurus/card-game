import {CARD_LIST, type ICard} from '../../CARD_LIST'

export const CardFace = ({number}: {number: ICard['cardNumber']}) => {
	const card = CARD_LIST[number]

	const text = card.langs.en

	return (
		<div className="card-face" title={text.ability}>
			<header style={{fontSize: '70%'}}>{text.name}</header> {card.pow}
		</div>
	)
}
