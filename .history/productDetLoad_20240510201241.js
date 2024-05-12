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
	const url = `http://localhost:3000/api/car/${encodeURIComponent(make)}/${encodeURIComponent(
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
		.catch((error) => {
			console.error('Error fetching car details:', error)
		})
}
