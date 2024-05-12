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
					// Call the respective function when available
					break
				case 'Re-Order Listings':
					console.log('Re-Order Listings')
					// Call the respective function when available
					break
				case 'Edit A Listing':
					console.log('Edit A Listing')
					// Call the respective function when available
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
function initializeFormEventListeners() {
	// Limit year input length
	const yearInput = document.getElementById('year')
	yearInput.addEventListener('input', function () {
		if (this.value.length > 4) {
			this.value = this.value.slice(0, 4)
		}
	})

	// Initialize form submission
	document.getElementById('addForm').addEventListener('submit', handleFormSubmit(e,pond)))
}
// Image handling
let imageFiles = [] // Store image files

function updateOrderNumbers() {
	const auxArray = [] // Create a new auxiliary array to re-order images

	document.querySelectorAll('.img-wrap').forEach((wrap, index) => {
		const orderNumber = wrap.querySelector('.order-number')

		if (orderNumber) {
			const orderPos = index + 1 // Calculate the order position based on index
			const oldPos = parseInt(orderNumber.textContent.slice(1)) // Get the old order position

			auxArray[orderPos - 1] = imageFiles[oldPos - 1] // Position the image at the specified order position
			//console.log('OPOS: ', orderPos, 'oldPos: ', oldPos, 'IND: ', index)
			//console.log('AUX: ', auxArray[orderPos - 1], 'IMG: ', imageFiles[oldPos])
			orderNumber.textContent = `#${orderPos}` // Update the order nu
		}
	})

	// Update imageFiles to point to the new auxiliary array with images stored as paths/URLs or Files
	imageFiles = auxArray
}

// Form submission handler
function handleFormSubmit(e, pond) {
	//Refresh Prev && Instantiate Form Object
	e.preventDefault()
	let formData = new FormData(e.target)
	// Get files in their current order
	const files = pond.getFiles()

	// Append files to FormData with custom names based on order
	files.forEach((file) => {
		const index = file.getMetadata('orderIndex')
		const nameParts = file.file.name.split('.')
		const extension = nameParts.pop()
		const newFilename = `${make}_${model}_${vin}_${index}.${extension}`
		formData.append('images[]', file.file, newFilename)
	})
	// Append each image file to formData only once, sorted by name
	console.log('Appending images to FormData') // Log before appending images
	// Get make, model, and vin values from form inputs
	const make = document.getElementById('make').value
	const model = document.getElementById('model').value
	const vin = document.getElementById('vin').value
	// Clear existing images in FormData
	formData.delete('images')

	// Loop through imageFiles array
	imageFiles.forEach((file, index) => {
		if (file && file.name) {
			// Construct unique file path based on make, model, and vin
			const extension = file.name.split('.').pop()
			const newFilename = `${make}_${model}_${vin}_${index}.${extension}`

			// Append each image file to formData with the unique filename
			formData.append('images', file, newFilename)
		} else {
			console.error('Skipping invalid image:', file)
		}
	})
	console.log('IMGFILE: ', imageFiles)
	console.log('Finished appending images to FormData') // Log after appending images
	console.log('FormData image array:', formData.getAll('images'))
	// Fetch request to the server
	fetch('http://localhost:3000/upload', {
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

// Start with the form hidden
toggleAddCarForm(true)
