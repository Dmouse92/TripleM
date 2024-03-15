function loadListings() {
	const pCont = document.querySelector('#vehCont')
	console.log('Grabbing JSON...')
	fetch('cars-defv.json')
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
				listing.innerHTML = `
				<div class="team-box">
					<div class="team-img">
						<img
							decoding="async"
							src="${car.img[0]}"
							alt="${car.model}"
							title=""
							style="" />
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
							<h3 class="team-title" style="font-size: 2.5vh">
								<a href="/listings/${car.make}_${car.model}_${car.vin}.html/">
									${car.year} ${car.make} ${car.model}
								</a>
							</h3>
							<span
								style="color: #f6f5f5; font-size: 2vh; font-weight: 700"
								class="vehicle-desig"
								>$${car.price}</span
							>
						</div>
					</div>
					<div class="th-social background-image" style="border: 1px solid #2f3032">
						<ul class="vehDetListL">
							<li class="vehDetListItemL engine">
								<h5 class="vehDetTxt">${car.engine}</h5>
							</li>
							<li class="vehDetListItemL transmission">
								<h5 class="vehDetTxt">${car.transmission}</h5>
							</li>
							<li class="vehDetListItemL drive">
								<h5 class="vehDetTxt">${car.drive}</h5>
							</li>
							<li class="vehDetListItemL mileage">
								<h5 class="vehDetTxt">${car.mileage}</h5>
							</li>
						</ul>
						<ul class="vehDetListR">
							<li class="vehDetListItemR exterior">
								<h5 class="vehDetTxt">${car.exterior}</h5>
							</li>
							<li class="vehDetListItemR interior">
								<h5 class="vehDetTxt">${car.interior}</h5>
							</li>
							<li class="vehDetListItemR fuelEconomy">
								<h5 class="vehDetTxt">${car.fuelEconomy}</h5>
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
loadListings()
