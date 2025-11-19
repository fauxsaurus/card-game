type IInt = number

export type IAction =
	| {type: 'setup-shuffle'}
	| {type: 'setup-attackers-draw'}
	| {type: 'setup-attackers-place'; order: [[IInt, IInt, IInt], [IInt, IInt, IInt]]}
	| {type: 'setup-defenders-front-draw'}
	| {type: 'setup-defenders-front-place'; order: [[IInt, IInt, IInt], [IInt, IInt, IInt]]}
	| {type: 'setup-defenders-back-draw'}
	| {type: 'setup-defenders-back-place'; order: [[IInt, IInt, IInt], [IInt, IInt, IInt]]}
	| {type: 'setup-draw-hand'}
	| {type: 'turn-draw-card'; player: 0 | 1}
