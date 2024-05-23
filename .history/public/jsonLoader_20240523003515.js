// Ensure that the DOM is fully loaded before executing any script
let pond
window.onload = function () {
	// Add event listeners to the buttons
	document.querySelectorAll('.progBtn').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var buttonText = this.textContent.trim()
			console.log(buttonText) // Debugging: Log button text to console
			switch (buttonText) {
				case 'Add New Listing':
					console.log('Add New Listing')
					toggleAddCarForm(true)
					break
				case 'Remove A Listing':
					console.log('Remove A Listing')
					toggleRemoveCarForm(true)
					break
				case 'Edit A Listing':
					console.log('Edit A Listing')
					toggleEditCarForm(true)
					break
				default:
					console.error('Unhandled button text:', buttonText)
			}
		})
	})

	// Add event listeners to radio buttons
	document.querySelectorAll('input[type="radio"]').forEach(function (radio) {
		radio.addEventListener('change', handleRadioChange)
	})

	// Initialize form event listeners
	initializeFormEventListeners()
}
// RDIO
function handleRadioChange(event) {
	document.querySelectorAll('input[name="' + event.target.name + '"]').forEach((radio) => {
		radio.checked = false // Uncheck all radios with the same name
	})
	event.target.checked = true // Check the clicked radio button
}

function toggleAddCarForm(show) {
	let addCont = document.querySelector('.addContain')
	let btnCont = document.getElementById('btnCont')
	let uplCont = document.getElementById('uplCont')
	const inputElement = document.querySelector('input[type="file"]')
	let fileIndex = 0 // Initialize a counter outside of the FilePond instance
	if (show) {
		addCont.style.display = 'grid'
		btnCont.style.display = 'none'
		// Create a multi file upload component.
		// Define your resize options

		pond = FilePond.create(inputElement, {
			allowMultiple: true,
			acceptedFileTypes: ['image/*'],
			allowReorder: true,
			itemInsertLocationFreedom: true, // Allows items to be inserted at new locations
			allowImageEdit: true,
			imageEditAutoFocus: true,

			required: true,
			checkValidity: true,
			dropValidation: true,
			labelIdle: ' <span class="filepond--label-action"> Browse </span>',
			imageEditButtons: ['crop', 'flip', 'rotate', 'resize', 'remove', 'save'],
			imageEditOutputTarget: 'preview',
			storeAsFile: true,
			allowImagePreview: true, // Enable image previews
			imagePreviewHeight: 140, // Set the preview height
			server: false,

			onaddfile: (err, fileItem) => {
				if (!err) {
					fileItem.setMetadata('index', fileIndex++)
					fileItem.setMetadata('edit', true) // Enable editing
				}
			},
		})

		FilePond.setOptions({
			imageEditInstantEdit: true,
			/*imageEditEditor: Pintura.create({
				// Configure as needed
				imageEditButtonConfirmLabel: 'Apply',
				imageEditButtonCancelLabel: 'Cancel',
				onconfirm: (output) => {
					pond.addFile(output.data).then(() => {
						pond.removeFile(fileItem)
					})
				},
			}),*/
		})
		// Add listener for file order changes
		pond.on('reorderfiles', (files) => {
			// Update visual order index and metadata for each file
			files.forEach((file, index) => {
				files.forEach((fileItem, index) => {
					// Recalculate and set the new index metadata for each file
					fileItem.setMetadata('index', index)
				})
			})
		})

		// Add it to the DOM
		//addCont.appendChild(pond.element)
	} else {
		addCont.style.display = 'none'
		btnCont.style.display = 'block'
		FilePond.destroy(inputElement)
	}
}
function toggleRemoveCarForm(show) {
	let remCont = document.querySelector('.remContain')
	let btnCont = document.getElementById('btnCont')

	if (show) {
		remCont.style.display = 'grid'
		btnCont.style.display = 'none'
	} else {
		remCont.style.display = 'none'
		btnCont.style.display = 'block'
	}
}
function toggleEditCarForm(show) {
	let addCont = document.querySelector('.addContain')
	let btnCont = document.getElementById('btnCont')
	let uplCont = document.getElementById('uplCont')
	const inputElement = document.querySelector('input[type="file"]')
	let fileIndex = 0 // Initialize a counter outside of the FilePond instance
	if (show) {
		addCont.style.display = 'grid'
		btnCont.style.display = 'none'
		// Create a multi file upload component.
		// Define your resize options

		pond = FilePond.create(inputElement, {
			allowMultiple: true,
			acceptedFileTypes: ['image/*'],
			allowReorder: true,
			itemInsertLocationFreedom: true, // Allows items to be inserted at new locations
			allowImageEdit: true,
			imageEditAutoFocus: true,

			required: true,
			checkValidity: true,
			dropValidation: true,
			labelIdle: ' <span class="filepond--label-action"> Browse </span>',
			imageEditButtons: ['crop', 'flip', 'rotate', 'resize', 'remove', 'save'],
			imageEditOutputTarget: 'preview',
			storeAsFile: true,
			allowImagePreview: true, // Enable image previews
			imagePreviewHeight: 140, // Set the preview height
			server: false,

			onaddfile: (err, fileItem) => {
				if (!err) {
					fileItem.setMetadata('index', fileIndex++)
					fileItem.setMetadata('edit', true) // Enable editing
				}
			},
		})

		FilePond.setOptions({
			imageEditInstantEdit: true,
			/*imageEditEditor: Pintura.create({
				// Configure as needed
				imageEditButtonConfirmLabel: 'Apply',
				imageEditButtonCancelLabel: 'Cancel',
				onconfirm: (output) => {
					pond.addFile(output.data).then(() => {
						pond.removeFile(fileItem)
					})
				},
			}),*/
		})
		// Add listener for file order changes
		pond.on('reorderfiles', (files) => {
			// Update visual order index and metadata for each file
			files.forEach((file, index) => {
				files.forEach((fileItem, index) => {
					// Recalculate and set the new index metadata for each file
					fileItem.setMetadata('index', index)
				})
			})
		})

		// Add it to the DOM
		//addCont.appendChild(pond.element)
	} else {
		addCont.style.display = 'none'
		btnCont.style.display = 'block'
		FilePond.destroy(inputElement)
	}
}
function initializeFormEventListeners() {
	// Limit year input length
	const yearInput = document.getElementById('year')
	yearInput.addEventListener('input', function () {
		if (this.value.length > 4) {
			this.value = this.value.slice(0, 4)
		}
	})

	// Initialize form submission
	document.getElementById('addForm').addEventListener('submit', handleFormASubmit)
	document.getElementById('remForm').addEventListener('submit', handleFormRSubmit)
}

// Form submission handler
function handleFormASubmit(e) {
	//Refresh Prev && Instantiate Form Object
	e.preventDefault()
	let formData = new FormData(e.target)
	// Get files in their current order
	const files = pond.getFiles()

	// Append each image file to formData only once, sorted by name
	console.log('Appending images to FormData') // Log before appending images
	// Get make, model, and vin values from form inputs
	const make = document.getElementById('make').value
	const model = document.getElementById('model').value
	const vin = document.getElementById('vin').value
	// Clear existing images in FormData
	formData.delete('images')
	// Append files to FormData with custom names based on order
	files.forEach((file) => {
		const index = file.getMetadata('index')
		const nameParts = file.file.name.split('.')
		const extension = nameParts.pop()
		const newFilename = `${make}_${model}_${vin}_${index}.${extension}`
		formData.append('images', file.file, newFilename)
	})

	console.log('IMGFILE: ', files)
	console.log('Finished appending images to FormData') // Log after appending images
	console.log('FormData image array:', formData.getAll('images'))
	// Fetch request to the server
	fetch('http://192.168.1.159:3000/upload', {
		method: 'POST',
		body: formData,
	})
		.then((response) => {
			if (!response.ok) throw new Error('Network response was not ok')
			return response.json()
		})
		.then((data) => {
			console.log(data)
			toggleAddCarForm(false) // Hide form on successful submission
		})
		.catch((error) => console.error('Error:', error))
}

// Form submission handler
function handleFormRSubmit(e) {
	//Refresh Prev && Instantiate Form Object
	e.preventDefault()
	let formData = new FormData(e.target)

	// Fetch request to the server
	fetch('http://192.168.1.159:3000/preview', {
		method: 'POST',
		body: formData,
	})
		.then((response) => {
			if (!response.ok) throw new Error('Network response was not ok')
			return response.json()
		})
		.then((data) => {
			console.log(data)
			// Display Preview of Listing with Confirmation Request, then remove from DB.

			// Assuming data has the necessary information to display the listing
			let prevCont = document.getElementById('prevCont')
			prevCont.innerHTML = `
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
               ` // Clear previous content

			// Additional listing details can be shown here
			// ...

			// Create confirmation buttons
			let confirmButton = document.createElement('button')
			confirmButton.textContent = '✓ Confirm Deletion'
			confirmButton.onclick = function () {
				// Send a deletion request to the server
				fetch('https://192.168.1.159:3000/delete-listing', {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ id: data.id }), // Assuming data contains an id property for the listing
				})
					.then((response) => {
						if (!response.ok) throw new Error('Network response was not ok')
						return response.json()
					})
					.then((deleteResponse) => {
						console.log(deleteResponse)
						prevCont.style.display = 'none' // Hide the preview container
						// You may want to update the UI to reflect the deletion
					})
					.catch((error) => {
						console.error('Deletion error:', error)
					})
			}

			let cancelButton = document.createElement('button')
			cancelButton.textContent = '× Cancel'
			cancelButton.onclick = function () {
				prevCont.style.display = 'none'
			}

			// Append buttons to the container
			prevCont.appendChild(confirmButton)
			prevCont.appendChild(cancelButton)

			// Show the preview container
			prevCont.style.display = 'block'
		})
		.catch((error) => console.error('Error:', error))
}

// Start with the form hidden
toggleAddCarForm(true)
//toggleEditCarForm(false)
toggleRemoveCarForm(false)
