type IUrl = string

/** @note three digits zero-padded (potentially following letters indicating revisions and/or a lang tag) */
export type ICardNumber = string

export type ICard = {
	cardNumber: ICardNumber
	pow: number
	cost: number
	langs: Record<
		string,
		{name: string; faction: keyof typeof FACTIONS; ability: string; art: IUrl}
	>
}

export const FACTIONS = ['PENGUIN', 'BEAR', 'SNOWMEN']

/** @todo replace tmp card gen code */
export const CARD_LIST: Record<ICardNumber, ICard> = Object.fromEntries(
	Array(18)
		.fill(1)
		.map((startId, i) => {
			const cardNumber = (startId + i).toString().padStart(3, '0')
			return [
				cardNumber,
				{
					cardNumber,
					pow: 7,
					cost: 7,
					langs: {en: {name: 'Emperor Penguin', faction: 0, ability: '', art: ''}},
				},
			]
		})
)
