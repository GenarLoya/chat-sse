import { logger } from 'hono/logger'
import pino from 'pino'

export const pinolog = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const honoLogger = logger((str: string, ...res: any[]) => {
	pinolog.info(str, ...res)
})
