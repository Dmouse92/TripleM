function loadListings() {
	const pCont = document.querySelector('#vehCont')
	console.log('Grabbing JSON...')
	fetch('cars.json')
		.then((response) => {
			if (!response.ok) {
				throw new Error('HTTP error ' + response.status)
			}
			return response.json()
		})
		.then((json) => {
			json.cars.forEach((car) => {
				const listing = document.createElement('div')
				listing.className = 'col-md-6 col-lg-4'
				listing.innerHTML = `
				<div class="team-box" >
					<div class="team-img">
						<img
							decoding="async"
							src="${car.img}"
							alt="${car.model}"
							title=""
							style="" />
						<div class="team-content" style="border-radius: 0.5em 0.5em 0 0; border: 0 solid #1f2022">
							<h3 class="team-title">
								<a href="https://themeholy.com/wordpress/malen/team-members/">
									${car.year} ${car.make} ${car.model}
								</a>
							</h3>
							<span style="color: #f6f5f5;font-size:1.75vh; font-weight:400" class="vehicle-desig">$${car.price}</span>
						</div>
					</div>
					<div
						class="th-social background-image"
						style="
							border-radius: 0 0 0.5em 0.5em; 
							background-color:c #0f0;
							background-image: url('https://themeholy.com/wordpress/malen/wp-content/uploads/2023/09/pattern_bg_2-2.png');
						"></div>
				</div>
                `
				console.log(listing.innerHTML)
				pCont.appendChild(listing) // Moved inside the forEach loop
			})
			console.log(json)
		})
		.catch(function () {
			console.log('An error occurred while fetching the JSON file.')
		})
}
loadListings()
