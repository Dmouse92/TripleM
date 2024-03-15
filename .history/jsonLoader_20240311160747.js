//BTN Handler
window.onload = function () {
	var liElements = document.querySelectorAll('.progBtn')

	liElements.forEach(function (li) {
		li.addEventListener('click', function () {
			var buttonText = this.textContent.trim() // This will store the text of the clicked li element in the buttonText variable
			// You can use the buttonText variable to route it
			console.log(buttonText) // This will print the text of the clicked li element to the console
			if (buttonText == 'Add New Listing') {
				console.log('Add New Listing')
				addCar()
			} else if (buttonText == 'Remove A Listing') {
				console.log('Remove A Listing')
			} else if (buttonText == 'Re-Order Listings') {
				console.log('Re-Order Listings')
			} else if (buttonText == 'Edit A Listing') {
				console.log('Edit A Listing')
			}
		})
	})
	// Add event listeners to the transmission type radio buttons
	document.getElementById('automatic').addEventListener('change', handleTransmissionChange)
	document.getElementById('manual').addEventListener('change', handleTransmissionChange)

	// Add event listeners to the drive type radio buttons
	document.getElementById('fwd').addEventListener('change', handleDriveChange)
	document.getElementById('rwd').addEventListener('change', handleDriveChange)
	document.getElementById('awd').addEventListener('change', handleDriveChange)
}

// RADIO HANDLERS
function handleTransmissionChange(event) {
	// Get all transmission type radio buttons
	let transmissionRadios = document.querySelectorAll('input[name="transmission"]')

	// Uncheck all radio buttons
	transmissionRadios.forEach((radio) => {
		radio.checked = false
	})

	// Check the clicked radio button
	event.target.checked = true
}

function handleDriveChange(event) {
	// Get all drive type radio buttons
	let driveRadios = document.querySelectorAll('input[name="drive"]')

	// Uncheck all radio buttons
	driveRadios.forEach((radio) => {
		radio.checked = false
	})

	// Check the clicked radio button
	event.target.checked = true
}

// PAGE HANDLERS
let progCont = document.getElementById('body')
let btnCont = document.getElementById('btnCont')
//function reOrder() {}
let addCont = document.querySelector('.addContain')
function addCar() {
	addCont.style.display = 'grid'
	btnCont.style.display = 'none'

	//progCont.appendChild(addCont)
	const yearInput = document.getElementById('year')
	yearInput.addEventListener('input', function () {
		if (this.value.length > 4) {
			this.value = this.value.slice(0, 4)
		}
	})
}
addCar()
/*
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
let addCont = document.createElement('div')
addCont.innerHTML = `<div class="modal" id="modal">
		<form id="addForm">
	<div class="formDiv">
		<label for="make" class="inpLabel">Make:</label>
		<input type="text" id="make" name="make"  placeholder="Enter Make" class="inpForm" />
	</div>
	<div class="formDiv">
		<label for="model" class="inpLabel">Model:</label>
		<input type="text" id="model" name="model"  placeholder="Enter Model" class="inpForm" />
	</div>
	<div class="formDiv">
		<label for="year" class="inpLabel">Year:</label>
		<input type="number" id="year" name="year" class="inpForm" placeholder="Enter Year" />
	</div>
	<div class="formDiv">
		<label for="price" class="inpLabel">Price:</label>
		<input type="number" id="price"  placeholder="Enter Price" name="price" class="inpForm" />
	</div>
	<div class="formDiv">
		<label for="vin" class="inpLabel">VIN:</label>
		<input type="text" maxlength="17" placeholder="Enter VIN" id="vin" name="vin" class="inpForm" />
	</div>
	<div class="formDiv">
		<label for="engine" class="inpLabel">Engine:</label>
		<input type="text" id="engine"  placeholder="Enter Engine" name="engine" class="inpForm" />
	</div>
	  <div class="formDiv">
        <label class="radioLBL" for="transmission" class="inpLabel">Transmission Type:</label>
        <input class="radioBtn" type="radio" id="automatic" name="transmission" value="Automatic">
        <label class="radioLBL" for="automatic">Automatic</label>
        <input class="radioBtn" type="radio" id="manual" name="transmission" value="Manual">
        <label class="radioLBL" for="manual">Manual</label>
    </div>
    <div class="formDiv">
        <label class="radioLBL" for="drive" class="inpLabel">Drive Type:</label>
        <input class="radioBtn" type="radio" id="fwd" name="drive" value="FWD">
        <label class="radioLBL" for="fwd">FWD</label>
        <input class="radioBtn" type="radio" id="rwd" name="drive" value="RWD">
        <label class="radioLBL"  for="rwd">RWD</label>
        <input class="radioBtn" type="radio" id="awd" name="drive" value="AWD">
        <label class="radioLBL" for="awd">AWD</label>

    </div>
	<div class="formDiv">
		<label for="mileage" class="inpLabel">Mileage:</label>
		<input type="number" id="mileage"  placeholder="Enter Mileage" name="mileage" class="inpForm" />
	</div>
	<div class="formDiv">
		<label for="exterior" class="inpLabel">Exterior Color:</label>
		<input type="text" id="exterior" placeholder="Enter Ext Color"  name="exterior" class="inpForm" />
	</div>
	<div class="formDiv">
		<label for="interior" class="inpLabel">Interior Color:</label>
		<input type="text" id="interior"  placeholder="Enter Int Color" name="interior" class="inpForm" />
	</div>
	<div class="formDiv">
    <label for="images" class="inpLabel">Images:</label>
    <input type="file" id="images" name="images" class="inpForm" accept="image/*" />
</div>

	<!-- Continue adding classes for the rest of your form fields -->
</form>
</div>

	`

//addCar()
let remCont = ''
let reoCont = ''
let edtCont = ''*/
/*
 <script>
</script> */
// IMG INPUT FIELD
$(document).ready(function () {
	$('#images').change(function (e) {
		const files = e.target.files
		const preview = $('#preview')
		//preview.empty() // Clear existing images

		for (let i = 0; i < files.length; i++) {
			const file = files[i]
			const reader = new FileReader()

			reader.onload = function (e) {
				const imgWrap = $('<div>', { class: 'img-wrap' }).appendTo(preview)
				$('<img>', {
					src: e.target.result,
					click: function () {
						// Open image in fullscreen
						const fullScreenImg = $('<img>', { src: this.src }).css({
							width: '100%',
							height: '100%',
						})
						const fullScreenDiv = $('<div>')
							.css({
								position: 'fixed',
								top: 0,
								left: 0,
								width: '75%',
								height: '75%',
								backgroundColor: 'rgba(0,0,0,0.9)',
								border: '2em solid #7ebab5',
								borderRadius: '1em',
								zIndex: 10000,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							})
							.append(fullScreenImg)
							.appendTo('body')
							.click(function () {
								$(this).remove() // Remove fullscreen div on click
							})
					},
				}).appendTo(imgWrap)

				$('<div>', {
					class: 'close',
					text: 'X',
					click: function () {
						$(this).parent().remove()
						updateOrder()
					},
				}).appendTo(imgWrap)

				$('<div>', { class: 'order-number' }).appendTo(imgWrap)
				updateOrder()
			}

			reader.readAsDataURL(file)
		}
	})

	let imageUrls = [] // Declare this at the top of your script

	function updateOrder() {
		imageUrls = [] // Clear the existing array
		$('.img-wrap').each(function (index) {
			$(this)
				.find('.order-number')
				.text('#' + (index + 1))
			imageUrls.push($(this).find('img').attr('src')) // Add the image src to the array
		})
		console.log(imageUrls)
	}

	// Initialize Sortable
	const el = document.getElementById('preview')
	Sortable.create(el, {
		animation: 150,
		ghostClass: 'blue-background-class',
		onSort: function () {
			updateOrder() // Update order numbers when images are reordered
		},
	})
})
// SUBMISSION HANDLING
// Client-side JavaScript
let imageUrls = [] // Declare this at the top of your script
document.getElementById('addForm').addEventListener('submit', function (e) {
	try {
		e.preventDefault()

		var formData = new FormData(e.target)
		var formObject = {}
		formData.forEach(function (value, key) {
			formObject[key] = value
		})

		// Add the array of image URLs to the formObject
		formObject['images'] = imageUrls
		console.log('LOADING TO JSON')
		console.log(imageUrls)

		var jsonString = JSON.stringify(formObject)

		console.log(jsonString)
		// Send a POST request to the /upload route
		fetch('http://localhost:3000/upload', {
			method: 'POST',
			body: formData,
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok')
				}
				return response.json()
			})
			.then((data) => {
				console.log(data)
				// Here you can add the data to your cars-dev.json
			})
			.catch((error) => {
				console.error('Error:', error)
			})
	} catch (error) {
		console.error('An error occurred during form submission:', error)
	}
})
$('#images').change(function (e) {
	const files = e.target.files

	for (let i = 0; i < files.length; i++) {
		const file = files[i]
		console.log(file.name) // This will print the name of the file

		const reader = new FileReader()

		reader.onload = function (e) {
			// The rest of your code...
		}

		reader.readAsDataURL(file)
	}
})
