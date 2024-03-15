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
	imageFiles = Array.from(files) // Store the FileList as an array
	imageFiles.forEach((file, index) => createImagePreview(file, index))
	// Re-initialize sortable here after adding new images
	initializeSortable()
}

function createImagePreview(file, index) {
	// Function to create image previews
	const reader = new FileReader()
	reader.onload = function (e) {
		const imgWrap = document.createElement('div')
		imgWrap.className = 'img-wrap'
		imgWrap.innerHTML = `
      <div class="order-number">#${index + 1}</div>
      <img src="${e.target.result}" />
      <div class="close" onclick="removeImage(${index})">X</div>`
		document.getElementById('preview').appendChild(imgWrap)
	}
	reader.readAsDataURL(file)
}

function removeImage(index) {
	// Function to remove an image from the preview and the imageFiles array
	document.querySelectorAll('.img-wrap')[index].remove()
	imageFiles.splice(index, 1) // Remove the image from the array
	// Must also update the index for each remaining file
	updateOrderNumbers()
}

function updateOrderNumbers() {
	// Function to update the order numbers after reordering or removing images
	document.querySelectorAll('.img-wrap').forEach((wrap, index) => {
		const orderNumber = wrap.querySelector('.order-number')
		if (orderNumber) {
			orderNumber.textContent = `#${index + 1}`
		}
		wrap.querySelector('.close').setAttribute('onclick', `removeImage(${index})`)
	})
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
	e.preventDefault()
	let formData = new FormData(e.target)

	// Append each image file to formData
	imageFiles.forEach((file) => formData.append('images', file))

	// Now send formData to the server
	submitFormData(formData) // Separated the fetch call into a new function for clarity
}

// Submit form data
function submitFormData(formData) {
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
