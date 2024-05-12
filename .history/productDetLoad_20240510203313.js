function fetchProductDetails(make, model, vin) {
	const pCont = document.getElementById('pCont')
	const breadCrumbHeader = document.getElementById('bCrumbTitle')
	const breadCrumbPath = document.getElementById('bCrumbPath')
	const heroImg = document.getElementById('heroImg')
	const price = document.getElementById('vehPrice')
	const vehTitle = document.getElementById('VehMakeModelYr')
	const vehDesc = document.getElementById('vehDesc')
	console.log('MID: ', make, model, vin)
	// Use template literals to construct the URL with the make, model, and vin
	const url = `http://localhost:3000/cars/${encodeURIComponent(make)}/${encodeURIComponent(
		model
	)}/${encodeURIComponent(vin)}`

	console.log(url)
	fetch(url)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`)
			}
			return response.json()
		})
		.then((data) => {
			// Load the data details into the datadetails ejs
			breadCrumbHeader.textContent = data.year + ' ' + data.make + ' ' + data.model
			breadCrumbPath.textContent = data.year + ' ' + data.make + ' ' + data.model
			heroImg.setAttribute('data-bg-src', data.img[0])
			heroImg.style.backgroundImage = `url(${data.img[0]})`
			console.log('IMG: ', data.img[0])
			price.textContent = '$' + data.price
			vehTitle.textContent = data.year + ' ' + data.make + ' ' + data.model
			vehDesc.textContent = data.comments
			const dataImages = data.img
			const dataSlides = document.getElementById('dataSlides')

			dataImages.forEach((image) => {
				const slide = document.createElement('li')
				slide.classList.add('glide__slide')

				const img = document.createElement('img')
				img.src = image
				img.alt = 'Product Image'
				console.log(image)
				slide.appendChild(img)
				dataSlides.appendChild(slide)
			})
		})
		.catch((error) => {
			console.error('Error fetching car details:', error)
		})
}
