type IInt = number
type IProps = {card?: IInt; cards?: IInt[]; facedown?: boolean; name: string; label?: string}

export const CardSlot = ({facedown, label, ...props}: IProps) => {
	const cards = props.cards ?? (props.card !== undefined ? [props.card] : [])

	const nameSuffix = props.name.split('-').slice(-1)[0]
	const isStack = ['captives', 'deck', 'discard'].includes(nameSuffix)

	return (
		<div
			className={(label?.length ?? 0) > 4 ? 'long-text' : undefined}
			data-empty={!cards.length}
			data-facedown={cards.length && facedown}
			data-slot={props.name}
			data-stack={isStack ? cards.length : undefined}
		>
			{isStack && cards.length ? `x${cards.length}` : label}
		</div>
	)
}
