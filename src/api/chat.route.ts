import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
import { subscribe } from 'valtio'
import { usersProxy } from '../proxys/users.proxy'
import type { TokenPayload } from '../types/token'

export const chatRouter = new Hono<{
	Variables: {
		tokenPayload: TokenPayload
	}
}>()

chatRouter.get('/online', async (c) => {
	const token = c.get('tokenPayload')

	return streamSSE(c, async (w) => {
		// Add online user
		const sessionSeq =
			usersProxy.users.filter((u) => u._id === token._id).length + 1

		usersProxy.users.push({
			_id: token._id,
			onlineStamp: Date.now(),
			sessionSeq,
		})

		// Initial SSE
		w.writeSSE({
			data: JSON.stringify(usersProxy.users),
			event: 'message',
			id: Math.random().toString() + Math.random().toString(),
		})

		// Disconnect SSE
		w.onAbort(() => {
			usersProxy.users = usersProxy.users.filter((u) => {
				// Remove user from online users
				return !(u._id === token._id && u.sessionSeq === sessionSeq)
			})
		})

		// Subscribe to usersProxy for receive conected users
		subscribe(usersProxy, () => {
			w.writeSSE({
				data: JSON.stringify(usersProxy.users),
				event: 'message',
				id: Math.random().toString() + Math.random().toString(),
			})
		})

		return new Promise<void>(() => {})
	})
})
