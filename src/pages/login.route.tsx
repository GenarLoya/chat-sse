import { Hono } from 'hono'
import type { TTokenPayload } from '../types/token'
import { Layout } from './_components/Layout'
import { Toolbar } from './_components/Toolbar'

export const loginRouter = new Hono<{
	Variables: {
		tokenPayload: TTokenPayload
	}
}>()

loginRouter.get('/', (c) => {
	const tokenPayload = c.get('tokenPayload')

	return c.html(
		<Layout>
			<Toolbar tokenPayload={tokenPayload} />
			<input
				id='username'
				type='text'
				placeholder='username'></input>
			<input
				id='password'
				type='password'
				placeholder='password'></input>
			<button id='login'>Log in</button>
			<script src='/static/js/login.js'></script>
		</Layout>,
	)
})
