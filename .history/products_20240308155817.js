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
				const listing = document.createElement('a')
				listing.className = 'col-md-6 col-lg-4'
				listing.href = `/listings/${car.make}_${car.model}_${car.vin}.html`
				listing.innerHTML = `
	
				<div class="team-box" >
					<div class="team-img">
						<img
							decoding="async"
							src="${car.img}"
							alt="${car.model}"
							title=""
							style="" />
						 <div class="team-content" style="  gap: 0.75em; display:flex; flex-direction: column; justify-content: space-between; border-radius: 0.5em 0.5em 0 0; border: 0 solid #1f2022">
							<h3 class="team-title" style="font-size:2.5vh;">
								<a href="/listings/${car.make}_${car.model}_${car.vin}.html/">
									${car.year} ${car.make} ${car.model}
								</a>
							</h3>
							<span style="  color: #f6f5f5;font-size:2vh; font-weight:700" class="vehicle-desig">$${car.price}</span>
						</div>
					</div>
					<div
						class="th-social background-image"
						style="
							background-color: #2f30FF;
							border-radius: 0 0 0.5em 0.5em; 
							display: flex;
							flex-direction: row;
							justify-content: space-between;
							align-items: center;
							justify-content: center;
							border: 0.05em solid #2f3032;
							background-image: url('https://themeholy.com/wordpress/malen/wp-content/uploads/2023/09/pattern_bg_2-2.png');
						">
						<ul class="vehDetListL">
							<li class="vehDetListItemL">
								<i class="fa fa-car" aria-hidden="true"></i>
								<h5 class="vehDetTxt">TEST</h5>
							</li>

							</ul>
							<ul class="vehDetListR">
							<li class="vehDetListItemR">
								<i class="fa fa-car" aria-hidden="true"></i>
								<h5 class="vehDetTxt">TEST</h5>
							</li>

							</ul>
						</div>
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
