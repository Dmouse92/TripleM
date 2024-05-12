function loadListings() {
	const pCont = document.querySelector('#vehCont')

	console.log('Grabbing listings from the database...')

	db.serialize(() => {
		db.all('SELECT * FROM vehDB', [], (err, rows) => {
			if (err) {
				console.error('Error fetching cars', err)
				return
			}

			rows.forEach((car) => {
				const carImagePath = `/assets/img/vehicles/${car.make}_${car.model}_${car.vin}/${car.make}_${car.model}_${car.vin}_1.jpg`

				const listing = document.createElement('a')
				listing.className = 'col-md-6 col-lg-4'
				listing.href = `/listings/${car.make}_${car.model}_${car.vin}.html`

				listing.style.width = '100%'
				listing.innerHTML = `
					<div class="team-box">
						<div class="team-img">
							<img
								decoding="async"
								src="${carImagePath}"
								alt="${car.model}"
								title=""
								style="overflow: hidden;" />
							<div class="team-content">
								<h3 class="team-title">
									<a href="/listings/${car.make}_${car.model}_${car.vin}.html/">
										${car.year} ${car.make} ${car.model}
									</a>
								</h3>
								<span class="vehicle-desig">$${car.price}</span>
							</div>
						</div>
						<div class="th-social background-image">
							<ul class="vehDetListL">
								<li class="vehDetListItemL engine vehDetTxt">${car.engine}</li>
								<li class="vehDetListItemL transmission vehDetTxt">${car.transmission}</li>
								<li class="vehDetListItemL drive vehDetTxt">${car.drive}</li>
								<li class="vehDetListItemL mileage vehDetTxt">${car.mileage}</li>
							</ul>
							<ul class="vehDetListR">
								<li class="vehDetListItemL exterior vehDetTxt">${car.exterior}</li>
								<li class="vehDetListItemL interior vehDetTxt">${car.interior}</li>
								<li class="vehDetListItemL fuelEconomy vehDetTxt">${car.fuelEconomy}</li>
							</ul>
						</div>
					</div>
				`

				pCont.appendChild(listing)
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
/*
fetch('cars.json')
		.then((response) => {
			if (!response.ok) {
				throw new Error('HTTP error ' + response.status)
			}
			return response.json()
		})
		.then((json) => {
			json.cars.forEach((car) => {
				const listing = document.createElement('a')
				listing.className = 'col-md-6 col-lg-4'
				listing.href = `/listings/${car.make}_${car.model}_${car.vin}.html`
				console.log('CAR: ', car.img[1])
				listing.style.width = '100%'
				listing.innerHTML = `
				<div class="team-box">
					<div class="team-img">
						<img
							decoding="async"
							src="${car.img[0]}"
							alt="${car.model}"
							title=""
							style="overflow: hidden;" />
						
						<div
							class="team-content"
							style="
								gap: 0.75em;
								display: flex;
								flex-direction: column;
								justify-content: space-between;
								border-radius: 0.5em 0.5em 0 0;
								border: 0 solid #1f2022;
							">
							<h3 class="team-title" style="font-size: 1.25em">
								<a href="/listings/${car.make}_${car.model}_${car.vin}.html/">
									${car.year} ${car.make} ${car.model}
								</a>
							</h3>
							<span
								style="color: #f6f5f5; font-size: 1em; font-weight: 700"
								class="vehicle-desig"
								>$${car.price}</span
							>
						</div>
					</div>
					<div class="th-social background-image" style="border: 1px solid #2f3032">
						<ul class="vehDetListL">
							<li class="vehDetListItemL engine vehDetTxt">
								${car.engine}
							</li>
							<li class="vehDetListItemL transmission vehDetTxt">
								${car.transmission}
							</li>
							<li class="vehDetListItemL drive vehDetTxt">
								${car.drive}
							</li>
							<li class="vehDetListItemL mileage vehDetTxt">
								${car.mileage}
							</li>
						</ul>
						<ul class="vehDetListR">
							<li class="vehDetListItemL exterior vehDetTxt">
								${car.exterior}
							</li>
							<li class="vehDetListItemL interior vehDetTxt">
								${car.interior}
							</li>
							<li class="vehDetListItemL fuelEconomy vehDetTxt">
								${car.fuelEconomy}
							</li>
						</ul>
					</div>
				</div>
                `

				pCont.appendChild(listing) // Moved inside the forEach loop
			})
		})
		.catch(function () {
			console.log('An error occurred while fetching the JSON file.')
		})
}
*/
