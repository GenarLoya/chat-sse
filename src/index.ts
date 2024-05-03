import { serve } from '@hono/node-server'
import { config } from 'dotenv'
import { Hono } from 'hono'
import { allApiRouter } from './api/all.route'
import { isAuthApi } from './middlewares/isAuthApi'
import { honoLogger, pinolog } from './middlewares/logger'
import './models/conn'

config({
	path: `.env.${process.env.NODE_ENV}`,
})
const app = new Hono()

app.use(honoLogger)
app.use('/*', isAuthApi)

app.route('/api/', allApiRouter)

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
