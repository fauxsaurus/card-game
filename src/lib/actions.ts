type IInt = number

export type IAction =
	| {type: 'shuffle'}
	| {type: 'setup-attackers-draw'}
	| {type: 'setup-attackers-place'; order: [[IInt, IInt, IInt], [IInt, IInt, IInt]]}
