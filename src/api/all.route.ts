import { Hono } from 'hono'
import { chatRouter } from './chat.route'
import { usersRouter } from './users.route'

export const allApiRouter = new Hono()

allApiRouter.route('/users', usersRouter)
allApiRouter.route('/chat', chatRouter)
