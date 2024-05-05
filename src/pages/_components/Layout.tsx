import type { FC } from 'hono/jsx'

export const Layout: FC = ({ children }) => {
	return (
		<html>
			<head>
				<title>APP</title>
				<link
					rel='stylesheet'
					href='/static/css/tailwind.css'
				/>
			</head>
			<body class='bg-slate-100'>{children}</body>
		</html>
	)
}
