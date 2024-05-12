function fetchProductDetails(productId) {
	const pCont = document.getElementById('pCont')
	const breadCrumbHeader = document.getElementById('bCrumbTitle')
	const breadCrumbPath = document.getElementById('bCrumbPath')
	const heroImg = document.getElementById('heroImg')
	const price = document.getElementById('vehPrice')
	const vehTitle = document.getElementById('VehMakeModelYr')
	const vehDesc = document.getElementById('vehDesc')
	console.log('Grabbing JSON...')
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
/*console.log('Grabbing listings from the database...')
	fetch('http://localhost:3000/listings') // Assuming you have an endpoint '/api/listings' set up on your server
		.then((response) => {
			if (!response.ok) {
				throw new Error('Network response was not ok ' + response.statusText)
			}
			return response.json()
		})
		.then((data) => {
			
		})
		.catch((error) => {
			console.error('There has been a problem with your fetch operation:', error)
		*/
// Simulate clicking on a product and fetching its details
const productId = '1' // Replace with the actual product VIN
fetchProductDetails(productId)
