import zodSchema from '@zodyac/zod-mongoose'
import { Jwt } from 'hono/utils/jwt'
import m from 'mongoose'
import type { TUser } from '../validators/users.validator'
import { zUser } from '../validators/users.validator'

const userSchema = zodSchema(zUser)

export const UserModel = m.model('Users', userSchema)

export interface IUser {
	user: TUser
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	register: () => Promise<any>
	login: () => Promise<string>
}

export class User implements IUser {
	user: TUser
	constructor(user: TUser) {
		this.user = user
	}

	async register() {
		const isAlreadyRegistered = await UserModel.findOne({
			name: this.user.name,
		})

		if (isAlreadyRegistered) {
			throw new ErrUserAlreadyRegistered()
		}

		const newUser = new UserModel(this.user)
		return newUser.save()
	}

	async login() {
		const user = await UserModel.findOne({
			name: this.user.name,
			pass: this.user.pass,
		})

		if (!user) {
			throw new ErrUserIncorrectLogin()
		}

		const token = await Jwt.sign(
			{ _id: user._id },
			process.env.JWT_SECRET ?? '',
		)

		console.log('token', token)

		return token
	}
}

/** Errors */

export class ErrUserAlreadyRegistered extends Error {
	constructor() {
		super('User already registered')
	}
}

export class ErrUserIncorrectLogin extends Error {
	constructor() {
		super('User not found or password is incorrect')
	}
}
