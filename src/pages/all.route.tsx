import { Hono } from 'hono'
import { homeRouter } from './home.route'
import { loginRouter } from './login.route'

export const allPageRouter = new Hono()

allPageRouter.route('/login', loginRouter)
allPageRouter.route('/home', homeRouter)
