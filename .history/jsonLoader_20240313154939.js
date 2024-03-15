// Ensure that the DOM is fully loaded before executing any script
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
	if (show) {
		addCont.style.display = 'grid'
		btnCont.style.display = 'none'
	} else {
		addCont.style.display = 'none'
		btnCont.style.display = 'block'
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

	// Initialize image upload and preview functionality
	document.getElementById('images').addEventListener('change', handleImageUpload)

	// Initialize form submission
	document.getElementById('addForm').addEventListener('submit', handleFormSubmit)
}
// Image handling
let imageFiles = [] // Store image files

function handleImageUpload(e) {
	const files = e.target.files
	const preview = document.getElementById('preview')
	preview.innerHTML = '' // Clear existing images
	// Append new images to the end of the array
	imageFiles.push(...Array.from(files))

	imageFiles.forEach((file, index) => createImagePreview(file, index))
	// Re-initialize sortable here after adding new images
	initializeSortable()
}

// Function to create image previews
function createImagePreview(file, index) {
	const reader = new FileReader()
	reader.onload = function (e) {
		const imgWrap = document.createElement('div')
		imgWrap.className = 'img-wrap'
		imgWrap.innerHTML = `
      <div class="order-number">#${index + 1}</div>
      <img src="${e.target.result}" class="preview-img" />
      <div class="close" onclick="removeImage(${index})">X</div>`
		document.getElementById('preview').appendChild(imgWrap)

		// Add click event to open the image in a larger view
		imgWrap.querySelector('.preview-img').addEventListener('click', function () {
			// Check if the overlay is already open
			if (!document.getElementById('image-overlay')) {
				openImageOverlay(e.target.result)
			}
		})
	}
	reader.readAsDataURL(file)
}

function openImageOverlay(src) {
	// Prevent opening multiple overlays
	if (document.getElementById('image-overlay')) {
		return
	}
	const overlay = document.createElement('div')
	overlay.id = 'image-overlay'
	overlay.innerHTML = `
    <div class="overlay-content">
      <img src="${src}" class="overlay-img" />
      <div class="overlay-close" onclick="closeImageOverlay()">X</div>
    </div>`
	document.body.appendChild(overlay)
}

// Function to close the image overlay
function closeImageOverlay() {
	const overlay = document.getElementById('image-overlay')
	if (overlay) {
		overlay.remove()
	}
}

function removeImage(index) {
	// Function to remove an image from the preview and the imageFiles array
	document.querySelectorAll('.img-wrap')[index].remove()
	imageFiles.splice(index, 1) // Remove the image from the array
	// Must also update the index for each remaining file
	updateOrderNumbers()
}
function updateOrderNumbers() {
	const auxArray = [] // Create a new auxiliary array to re-order images

	document.querySelectorAll('.img-wrap').forEach((wrap, index) => {
		const orderNumber = wrap.querySelector('.order-number')
		if (orderNumber) {
			const orderPos = index + 1 // Calculate the order position based on index

			auxArray[orderPos - 1] = imageFiles[index] // Position the image at the specified order position
			console.log('AUX: ', auxArray[orderPos - 1], 'IMG: ', imageFiles[index], 'ORDER: ', orderPos)
			orderNumber.textContent = `#${orderPos}` // Update the order number in the top left corner
			console.log('POS: ', orderPos)
		}
	})

	// Update imageFiles to point to the new auxiliary array with images stored as paths/URLs or Files
	imageFiles = auxArray
}

function initializeSortable() {
	// Function to make the preview images sortable (draggable)
	new Sortable(document.getElementById('preview'), {
		animation: 150,
		ghostClass: 'sortable-ghost',
		onSort: updateOrderNumbers,
	})
}

// Form submission handler
function handleFormSubmit(e) {
	//Refresh Prev && Instantiate Form Object
	e.preventDefault()
	let formData = new FormData(e.target)

	// Append each image file to formData only once, sorted by name
	console.log('Appending images to FormData') // Log before appending images
	console.log('IMGFILE1: ', imageFiles)
	if (imageFiles && imageFiles.every((file) => file && file.name)) {
		imageFiles.forEach((file, index) => {
			const extension = file.name.split('.').pop()
			const newFilename = `${make}_${model}_${vin}_${index}.${extension}`
			const url = URL.createObjectURL(file)
			const a = document.createElement('a')
			a.href = url
			a.download = newFilename
			a.click()
			URL.revokeObjectURL(url)
			formData.append('images', file, newFilename)
		})
	}
	console.log('IMGFILE: ', imageFiles)
	console.log('IMG: ', formData.getAll('images'))
	console.log('Finished appending images to FormData') // Log after appending images

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
toggleAddCarForm(false)
