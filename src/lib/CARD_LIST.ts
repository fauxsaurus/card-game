type IUrl = string

/** @note three digits zero-padded (potentially following letters indicating revisions and/or a lang tag) */
export type ICardNumber = string

export type ICard = {
	cardNumber: ICardNumber
	pow: number
	cost: number
	langs: Record<string, {name: string; faction: string; ability: string; art: IUrl}>
}

export const CARD_LIST: Record<ICardNumber, ICard> = {}
