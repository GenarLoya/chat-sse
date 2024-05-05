import { z } from 'zod'

export const zUser = z.object({
	name: z.string(),
	pass: z.string(),
})

export type TUser = z.infer<typeof zUser>

export const zUserRegister = zUser
	.extend({
		confirmPass: z.string(),
	})
	.refine((data) => data.pass === data.confirmPass, {
		message: 'Passwords do not match',
	})

export type TUserRegister = z.infer<typeof zUserRegister>
