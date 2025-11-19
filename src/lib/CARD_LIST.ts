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

const penguins =
	`Caesar	7	7	Inspiring	"+1 pow to cards on this side of the field"	Emperor Penguin with a golden olive leaf crown and toga (yellow to orange gradient).
Octavian	5	5	Avenger	"+2 atk if Caesar is captured"
	5	5	Usurper	"+1 pow if Caesar is captured"	King Penguin Mark Anthony
Brutus	5	5	Backstabber	"+1 pow when attacking a facedown card"	Brutus whistling with a blade tucked behind his back
Cass	5	5	Egg on	"+1 pow to the card ahead of this one"	Cassius holding up and egg and cheering someone on with a hand to his beak encouraging them
Aquilifer	4	4	Reclaim Honor	"+1 ATK to all cards when this card is captured."	Macaroni Penguin with a pretentious golden Caesar penguin atop with its wings partially outstretched
Draconarius	4	4		"+1 Pow to all chards on this side of the field."	
Calvary	3	3	Sledder	This card can move two spaces each turn.	A penguin sliding on its belly.
Vanguard	4	4		"+1 pow in the front row"	
Rearguard	4	4		"+1 pow in the back row"	
Wingman	4	4	Shield Wall	"+1 pow to each card beside this one"	Chinstrap Penguin with a helm.
Decoy	1	1			An egg with the features of a penguin sharpied on it.
Eggapult	6	6		Can attack even if there is a card in front of this one.	
Gladiator	4	4		"+1 pow when attacking"	
Guardian	4	4		"+1 pow when defending"	A penguin peaking out of an egg
Hatchling Rookie	3	3	Encouraged	"+2 atk if a card is behind this card"	
Praetorian	4	4	Bodyguard	"+2 def if a card is behind this card"	
Immunes	2	2	Engineer	Cards adjacent to this one can move to a space adjacent this one on their turn.	A penguin standing in front of an aqueduct water slide`
		.split('\n')
		.map((line, i) => {
			const [name, pow, cost, abilityName, abilityText, artAltText = 'N/A'] = line.split('\t')

			const startId = 1
			const faction = 0
			const cardNumber = (startId + i).toString().padStart(3, '0')
			const ability = `${abilityName}\t${abilityText}`

			return {
				cardNumber,
				pow: parseInt(pow),
				cost: parseInt(cost),
				langs: {en: {name, faction, ability, art: '', artAltText}},
			}
		})

export const CARD_LIST: Record<ICardNumber, ICard> = Object.fromEntries(
	penguins.map(card => [card.cardNumber, card] as const)
)
