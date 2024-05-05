import type { TTokenPayload } from '../../types/token'

type TToolbarProps = {
	tokenPayload: TTokenPayload
}

export const Toolbar = ({ tokenPayload }: TToolbarProps) => {
	const isLogged = Boolean(tokenPayload?._id)

	return (
		<div>
			<h1>Toolbar {String(isLogged)}</h1>
		</div>
	)
}
