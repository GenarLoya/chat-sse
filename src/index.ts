import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { config } from 'dotenv'
import { Hono } from 'hono'
import { allApiRouter } from './api/all.route'
import { isAuthApi } from './middlewares/isAuthApi'
import { isAuthPage } from './middlewares/isAuthPage'
import { honoLogger, pinolog } from './middlewares/logger'
import './models/conn'
import { allPageRouter } from './pages/all.route'

console.log('process.env.NODE_ENV', process.env.NODE_ENV)
config({
	path: `.env.${process.env.NODE_ENV}`,
})
const app = new Hono()

app.use(honoLogger)
app.use('/api/*', isAuthApi)
app.use('/page/*', isAuthPage)

/* ROUTES */

//Api
app.route('/api/', allApiRouter)

//Pages
app.route('/page/', allPageRouter)

//Static
app.get(
	'/static/**',
	serveStatic({
		root: './',
	}),
)

const port = 3000

serve(
	{
		fetch: app.fetch,
		port,
	},
	({ address, family, port }) => {
		pinolog.info(`🚀 Server listening on ${address}:${port} (${family})`)
	},
)
