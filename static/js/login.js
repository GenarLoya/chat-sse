console.log(document)

document.querySelector('#login').addEventListener('click', function (e) {
	e.preventDefault()
	var name = document.querySelector('#username').value
	var pass = document.querySelector('#password').value
	var data = {
		name: name,
		pass: pass,
	}
	fetch('/api/users/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	}).then(function (response) {
		if (response.status === 200) {
			window.location.href = '/page/home'
		} else {
			response.json().then(function (data) {
				console.log(data)
			})
		}
	})
})
