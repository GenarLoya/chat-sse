import mongoose from 'mongoose'
import { pinolog } from '../middlewares/logger'

mongoose
	.connect('mongodb://localhost:27017/chat')
	.then(() => {
		pinolog.info('🚀 Connected to MongoDB')
	})
	.catch((err) => {
		console.error(err)
	})

import { Observable } from 'rxjs'

const collection = mongoose.connection.collection('Users')

// Create a change stream
const changeStream = collection.watch()

// Create an Observable from the change stream
export const changeStreamObservable = new Observable((observer) => {
	changeStream.on('change', (change) => {
		observer.next(change)
	})

	// On unsubscribe, close the change stream
	return () => {
		changeStream.close()
	}
})
