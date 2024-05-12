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
/*<!-- views/product-details.ejs -->
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title><%= year %> <%= make %> <%= model %></title>
	</head>
	<body>
		<h1 id="bCrumbTitle"><%= year %> <%= make %> <%= model %></h1>
		<p id="bCrumbPath"><%= year %> <%= make %> <%= model %></p>
		<div
			id="heroImg"
			style="background-image: url('<%= img[0] %>')"
			data-bg-src="<%= img[0] %>"
		></div>
		<h2 id="VehMakeModelYr"><%= year %> <%= make %> <%= model %></h2>
		<p id="vehPrice">$<%= price %></p>
		<p id="vehDesc"><%= comments %></p>
		<ul id="dataSlides">
			<% img.forEach(function(image) { %>
			<li class="glide__slide">
				<img src="<%= image %>" alt="Product Image" />
			</li>
			<% }); %>
		</ul>
	</body>
</html>
 */
