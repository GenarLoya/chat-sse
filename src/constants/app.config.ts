export const tokenCookie = 'token'

export const excludedPaths = [
	...[...['/login', '/register'].map((path) => '/users' + path)].map(
		(path) => '/api' + path,
	),
	...['/login', '/register'].map((path) => '/page' + path),
]
