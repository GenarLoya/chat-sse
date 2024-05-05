import { Hono } from 'hono'
import type { TTokenPayload } from '../types/token'
import { Layout } from './_components/Layout'
import { Toolbar } from './_components/Toolbar'

export const homeRouter = new Hono<{
	Variables: {
		tokenPayload: TTokenPayload
	}
}>()

homeRouter.get('/', (c) => {
	const tokenPayload = c.get('tokenPayload')

	return c.html(
		<Layout>
			<Toolbar tokenPayload={tokenPayload} />
			<button id='connect'>CONNECT</button>
			<script src='/static/js/chat.js'></script>
		</Layout>,
	)
})
