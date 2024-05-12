function loadListings() {
	//const pCont = document.querySelector('#vehCont')

	console.log('Grabbing listings from the database...')
	fetch('http://localhost:3000/listings') // Assuming you have an endpoint '/api/listings' set up on your server
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText)
			}
			return response.json()
		})
		.then((data) => {
			const listings = data.cars // Access the cars team from the response
			const pCont = document.querySelector('#vehCont')
			listings.forEach((car) => {
				const listing = document.createElement('div')
				const imageFileName = `${car.make}_${car.model}_${car.vin}`
				listing.dataset.make = car.make
				listing.dataset.model = car.model
				listing.dataset.vin = car.vin
				listing.style.cursor = 'pointer'
				const carimage = `/assets/img/vehicles/${imageFileName}/${imageFileName}_0.jpg`
				listing.innerHTML = `
				<div class="team-box">
					<div class="team-img">
						<img
							decoding="async"
							src="${carimage}"
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
				listing.addEventListener('click', (event) => {
					event.preventDefault()
					const make = event.currentTarget.dataset.make
					const model = event.currentTarget.dataset.model
					const vin = event.currentTarget.dataset.vin
					fetchProductDetails(make, model, vin)
				})

				pCont.appendChild(listing)
			})
		})
		.catch((error) => {
			console.error('There has been a problem with your fetch operation:', error)
		})
}

window.onload = loadListings()
