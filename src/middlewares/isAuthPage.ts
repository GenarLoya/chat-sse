import type { MiddlewareHandler } from 'hono'
import { getCookie } from 'hono/cookie'
import { Jwt } from 'hono/utils/jwt'
import { JwtTokenInvalid } from 'hono/utils/jwt/types'
import { excludedPaths, tokenCookie } from '../constants/app.config'
import type { TTokenPayload } from '../types/token'

export const isAuthPage: MiddlewareHandler = async (c, next) => {
	try {
		const token = getCookie(c, tokenCookie)

		if (excludedPaths.some((path) => c.req.path.includes(path))) {
			return await next()
		}

		if (!token) {
			return c.redirect('/page/login')
		}

		const payload: Promise<TTokenPayload> = await Jwt.verify(
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
