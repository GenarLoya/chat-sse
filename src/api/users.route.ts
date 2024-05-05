import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { deleteCookie, setCookie } from 'hono/cookie'
import { tokenCookie } from '../constants/app.config'
import {
	ErrUserAlreadyRegistered,
	ErrUserIncorrectLogin,
	User,
} from '../models/users.model'
import type { TUser, TUserRegister } from '../validators/users.validator'
import { zUser, zUserRegister } from '../validators/users.validator'

/** User Body Validator */

export const usersRouter = new Hono()

usersRouter.post(
	'/register',
	zValidator('json', zUserRegister),
	async ({ req, json }) => {
		const { name, pass }: TUserRegister = await req.json()

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
	const { name, pass }: TUser = await c.req.json()

	console.log('name', name)
	console.log('pass', pass)

	try {
		const user = new User({ name, pass })
		console.log('pass', pass)

		const token = await user.login()

		console.log('token', token)

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

		console.log('err', err)

		return c.json(
			{
				msg: 'Internal server error',
			},
			500,
		)
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
