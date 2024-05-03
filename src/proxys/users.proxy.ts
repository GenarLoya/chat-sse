import { proxy } from 'valtio'

export type User = {
	_id: string
	sessionSeq: number
	onlineStamp: number
}

export const usersProxy = proxy<{ users: User[] }>({
	users: [],
})
