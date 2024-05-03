import type { MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { Jwt } from 'hono/utils/jwt'
import { JwtTokenInvalid } from 'hono/utils/jwt/types'
import { tokenCookie } from '../constants/app.config'
import type { TokenPayload } from '../types/token'

const excludedPaths = [
	...['/login', '/register'].map((path) => '/users' + path),
].map((path) => '/api' + path)

export const isAuthApi: MiddlewareHandler = async (c, next) => {
	try {
		const token = getCookie(c, tokenCookie)

		if (excludedPaths.some((path) => c.req.path.includes(path))) {
			return await next()
		}

		if (!token) {
			return c.json({ msg: 'No token provided' }, 401)
		}

		const payload: Promise<TokenPayload> = await Jwt.verify(
			token,
			process.env.JWT_SECRET ?? '',
		)

		c.set('tokenPayload', payload)

		return await next()
	} catch (err) {
		if (err instanceof JwtTokenInvalid) {
			return c.json({ msg: 'Token verify error' }, 401)
		}
	}
}
