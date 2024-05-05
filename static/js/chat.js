document
	.querySelector('#connect')
	.addEventListener('click', async function (e) {
		const eventSource = new EventSource('/api/chat/online')

		eventSource.onmessage = function (event) {
			console.log('New message:', event.data)
		}

		eventSource.onerror = function (event) {
			console.error('Error:', event)
		}
	})
