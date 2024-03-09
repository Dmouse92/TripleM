window.onload = function () {
	var liElements = document.querySelectorAll('.progBtn')

	liElements.forEach(function (li) {
		li.addEventListener('click', function () {
			var buttonText = this.textContent.trim() // This will store the text of the clicked li element in the buttonText variable
			// You can use the buttonText variable to route it
			console.log(buttonText) // This will print the text of the clicked li element to the console
			if (buttonText == 'Add New Listing') {
				console.log('Add New Listing')
			} else if (buttonText == 'Remove A Listing') {
				console.log('Remove A Listing')
			} else if (buttonText == 'Re-Order Listings') {
				console.log('Re-Order Listings')
			} else if (buttonText == 'Edit A Listing') {
				console.log('Edit A Listing')
			}
		})
	})
}

let progCont = document.getElementById('body')
function reOrder() {}
function addCar() {
	progCont.classList.add('addContainer')
}
function remCar() {}
function editCar() {}

let btnCont = `<div id="body">
				<ul id="itmList">
					<li class="progBtn addBtn button">Add New Listing</li>
					<li class="progBtn remBtn">Remove A Listing</li>
					<li class="progBtn reoBtn">Re-Order Listings</li>
					<li class="progBtn edtBtn">Edit A Listing</li>
				</ul>
			</div>`
let addCont = `addCont.innerHTML = `
		<form id="addForm">
					<label for="make" class="inpLabel">Make:</label>
					<input type="text" id="make" name="make" class="inpForm" />

					<label for="model" class="inpLabel">Model:</label>
					<input type="text" id="model" name="model" class="inpForm" />

					<label for="year" class="inpLabel">Year:</label>
					<input type="number" id="year" name="year" class="inpForm" />

					<label for="price" class="inpLabel">Price:</label>
					<input type="number" id="price" name="price" class="inpForm" />

					<label for="vin" class="inpLabel">VIN:</label>
					<input type="text" id="vin" name="vin" class="inpForm" />

					<label for="engine" class="inpLabel">Engine:</label>
					<input type="text" id="engine" name="engine" class="inpForm" />

					<label for="transmission" class="inpLabel">Transmission Type:</label>
					<input type="text" id="transmission" name="transmission" class="inpForm" />

					<label for="drive" class="inpLabel">Drive Type:</label>
					<input type="text" id="drive" name="drive" class="inpForm" />

					<label for="mileage" class="inpLabel">Mileage:</label>
					<input type="number" id="mileage" name="mileage" class="inpForm" />

					<label for="exterior" class="inpLabel">Exterior Color:</label>
					<input type="text" id="exterior" name="exterior" class="inpForm" />

					<label for="interior" class="inpLabel">Interior Color:</label>
					<input type="text" id="interior" name="interior" class="inpForm" />

					<!-- Continue adding classes for the rest of your form fields -->
				</form>
	`
let remCont = ``
let reoCont = ``
let edtCont = ``