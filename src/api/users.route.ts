import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { tokenCookie } from '../constants/app.config'
import {
	ErrUserAlreadyRegistered,
	ErrUserIncorrectLogin,
	User,
} from '../models/users.model'
import type { TypeUser, TypeUserRegister } from '../validators/users.validator'
import { zUser, zUserRegister } from '../validators/users.validator'

/** User Body Validator */

export const usersRouter = new Hono()

usersRouter.post(
	'/register',
	zValidator('json', zUserRegister),
	async ({ req, json }) => {
		const { name, pass }: TypeUserRegister = await req.json()

		try {
			const newUser = new User({ name, pass })
			await newUser.register()
			return json(
				{
					msg: 'User registered!',
				},
				200,
			)
		} catch (err) {
			if (err instanceof ErrUserAlreadyRegistered) {
				return json(
					{
						msg: err.message,
					},
					400,
				)
			}

			return json(
				{
					msg: 'Internal server error',
				},
				500,
			)
		}
	},
)

const loginRoute = '/login'

usersRouter.post(loginRoute, zValidator('json', zUser), async (c) => {
	const { name, pass }: TypeUser = await c.req.json()

	try {
		const user = new User({ name, pass })
		const token = await user.login()

		setCookie(c, tokenCookie, token, {
			path: '/',
			httpOnly: true,
		})

		return c.json(
			{
				msg: 'User logged in!',
				token,
			},
			200,
		)
	} catch (err) {
		if (err instanceof ErrUserIncorrectLogin) {
			return c.json(
				{
					msg: err.message,
				},
				400,
			)
		}
	}
})

usersRouter.delete(loginRoute, async (c) => {
	deleteCookie(c, tokenCookie)

	return c.json(
		{
			msg: 'User logged out!',
		},
		200,
	)
})
