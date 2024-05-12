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

	// Navigate to the URL, which should be handled by the server to render the EJS page
	window.location.href = url
}
