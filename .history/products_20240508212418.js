function loadListings() {
	const pCont = document.querySelector('#vehCont')
	const db = new sqlite3.Database('vehdatabase.sqlite', (err) => {
		if (err) {
			console.error('Error opening database', err)
			return
		}
	})

	console.log('Grabbing listings from the database...')

	db.serialize(() => {
		db.all('SELECT * FROM vehDB', [], (err, rows) => {
			if (err) {
				console.error('Error fetching cars', err)
				return
			}

			// Process each row here, similar to how you handled each JSON object in your .then() chain
			rows.forEach((car) => {
				console.log(car)
			})
		})
	})

	db.close((err) => {
		if (err) {
			console.error('Error closing database', err)
		}
	})
}

loadListings()
