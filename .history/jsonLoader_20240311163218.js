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

// Image Handling
let imageUrls = [] // Store image data URLs
function handleImageUpload(e) {
	const files = e.target.files
	const preview = document.getElementById('preview')
	preview.innerHTML = '' // Clear existing images

	Array.from(files).forEach((file, index) => {
		const reader = new FileReader()
		reader.onload = function (e) {
			const imgWrap = document.createElement('div')
			imgWrap.className = 'img-wrap'
			imgWrap.innerHTML = `<img src="${e.target.result}" />
                            <div class="close" onclick="removeImage(${index})">X</div>
                            <div class="order-number">#${index + 1}</div>`
			preview.appendChild(imgWrap)
			imageUrls[index] = e.target.result // Store image data URL at the index
		}
		reader.readAsDataURL(file)
	})

	initializeSortable()
}

function removeImage(index) {
	document.querySelectorAll('.img-wrap')[index].remove()
	imageUrls.splice(index, 1) // Remove the image from the array
	updateOrderNumbers()
}

function updateOrderNumbers() {
	document.querySelectorAll('.img-wrap .order-number').forEach((elem, index) => {
		elem.textContent = '#' + (index + 1)
		imageUrls[index] = elem.previousElementSibling.src // Update imageUrls array after removing
	})
}

function initializeSortable() {
	Sortable.create(document.getElementById('preview'), {
		animation: 150,
		ghostClass: 'blue-background-class',
		onUpdate: function () {
			updateOrderNumbers() // Update order numbers when images are reordered
		},
	})
}

// Form Submission
function handleFormSubmit(e) {
	e.preventDefault()
	let form = e.target
	let formData = new FormData(form)

	// Add the imageUrls to formData
	imageUrls.forEach((url, index) => {
		formData.append(`images[${index}]`, url)
		console.log(images[${index}]`, url);
	})
	
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
			toggleAddCarForm(false) // Hide form on successful submission
		})
		.catch((error) => {
			console.error('Error:', error)
		})
}

// Start with the form hidden
toggleAddCarForm(false)
