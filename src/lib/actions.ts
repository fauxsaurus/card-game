type IInt = number

export type IAction =
	// setup
	| {type: 'setup-shuffle'}
	| {type: 'setup-attackers-draw'}
	| {type: 'setup-attackers-place'; order: [[IInt, IInt, IInt], [IInt, IInt, IInt]]}
	| {type: 'setup-defenders-front-draw'}
	| {type: 'setup-defenders-front-place'; order: [[IInt, IInt, IInt], [IInt, IInt, IInt]]}
	| {type: 'setup-defenders-back-draw'}
	| {type: 'setup-defenders-back-place'; order: [[IInt, IInt, IInt], [IInt, IInt, IInt]]}
	| {type: 'setup-draw-hand'}
	// turns
	| {type: 'turn-draw-card'; player: 0 | 1}
	| {
			type: 'turn-play-card'
			player: 0 | 1
			card: IInt
			side: 'attackers' | 'defenders'
			position: 0 | 1 | 2 | 3 | 4 | 5
	  }
	| {type: 'turn-activate-ability'; player: 0 | 1; card: IInt}
	| {type: 'turn-attack'; player: 0 | 1; from: IInt; to: IInt}
	| {type: 'turn-discard-cards'; player: 0 | 1; cards: IInt[]}
	| {type: 'turn-end'; player: 0 | 1}
	// victory
	| {type: 'end-victory'; player: 0 | 1}
	| {type: 'end-draw'}
