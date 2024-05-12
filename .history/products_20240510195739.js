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
				const listing = document.createElement('a')
				const imageFileName = `${car.make}_${car.model}_${car.vin}`
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
function fetchProductDetails(make, model, vin) {
	const pCont = document.getElementById('pCont')
	const breadCrumbHeader = document.getElementById('bCrumbTitle')
	const breadCrumbPath = document.getElementById('bCrumbPath')
	const heroImg = document.getElementById('heroImg')
	const price = document.getElementById('vehPrice')
	const vehTitle = document.getElementById('VehMakeModelYr')
	const vehDesc = document.getElementById('vehDesc')
	console.log('Grabbing JSON...')
	// Use template literals to construct the URL with the make, model, and vin
	const url = `/api/car/${encodeURIComponent(make)}/${encodeURIComponent(
		model
	)}/${encodeURIComponent(vin)}`
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			return response.json()
		})
		.then((data) => {
			// Now 'data' contains the car data from the SQLite database
			// Use 'data' to update the DOM elements as before
			// ...
		})
		.catch((error) => {
			console.error('Error fetching car details:', error)
		})
}
/*
	// Make a fetch request to retrieve the list of products from cars.json
	fetch('cars.json')
		.then((response) => response.json())
		.then((data) => {
			console.log('ID: ', productId)
			// Find the product with the given productId
			const product = data.cars.find((car) => car.vin === productId)
			console.log('PRODUCT: ', product)
			// Load the product details into the productdetails ejs
			breadCrumbHeader.textContent = product.year + ' ' + product.make + ' ' + product.model
			breadCrumbPath.textContent = product.year + ' ' + product.make + ' ' + product.model
			heroImg.setAttribute('data-bg-src', product.img[0])
			heroImg.style.backgroundImage = `url(${product.img[0]})`
			console.log('IMG: ', product.img[0])
			price.textContent = '$' + product.price
			vehTitle.textContent = product.year + ' ' + product.make + ' ' + product.model
			vehDesc.textContent = product.comments
			const productImages = product.img
			const productSlides = document.getElementById('productSlides')

			productImages.forEach((image) => {
				const slide = document.createElement('li')
				slide.classList.add('glide__slide')

				const img = document.createElement('img')
				img.src = image
				img.alt = 'Product Image'
				console.log(image)
				slide.appendChild(img)
				productSlides.appendChild(slide)
			})
		})
		.catch((error) => console.error('Error fetching product details:', error))
}
console.log('Grabbing listings from the database...')
	fetch('http://localhost:3000/listings') // Assuming you have an endpoint '/api/listings' set up on your server
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText)
			}
			return response.json()
		})
		.then((data) => {
			
		})
fetchProductDetails(productId)
