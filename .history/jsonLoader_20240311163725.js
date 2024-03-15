// Ensure that the DOM is fully loaded before executing any script
window.onload = function () {
	// Button event listeners
	document.querySelectorAll('.progBtn').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var buttonText = this.textContent.trim()
			switch (buttonText) {
				case 'Add New Listing':
					toggleAddCarForm(true)
					break
				case 'Remove A Listing':
					// Implement remove functionality
					break
				case 'Re-Order Listings':
					// Implement re-order functionality
					break
				case 'Edit A Listing':
					// Implement edit functionality
					break
			}
		})
	})

	// Radio button event listeners
	document.querySelectorAll('input[type="radio"]').forEach(function (radio) {
		radio.addEventListener('change', handleRadioChange)
	})

	// Form event listeners
	initializeFormEventListeners()
}

// Radio change handler
function handleRadioChange(event) {
	document.querySelectorAll('input[name="' + event.target.name + '"]').forEach((radio) => {
		radio.checked = false
	})
	event.target.checked = true
}

// Toggle add car form display
function toggleAddCarForm(show) {
	let addCont = document.querySelector('.addContain')
	let btnCont = document.getElementById('btnCont')
	addCont.style.display = show ? 'grid' : 'none'
	btnCont.style.display = show ? 'none' : 'block'
}

// Initialize form event listeners
function initializeFormEventListeners() {
	document.getElementById('year').addEventListener('input', function () {
		if (this.value.length > 4) this.value = this.value.slice(0, 4)
	})
	document.getElementById('images').addEventListener('change', handleImageUpload)
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
	initializeSortable()
}

function createImagePreview(file, index) {
	const reader = new FileReader()
	reader.onload = function (e) {
		const preview = document.getElementById('preview')
		const imgWrap = document.createElement('div')
		imgWrap.className = 'img-wrap'
		imgWrap.innerHTML = `<img src="${e.target.result}" />
                         <div class="close" onclick="removeImage(${index})">X</div>
                         <div class="order-number">#${index + 1}</div>`
		preview.appendChild(imgWrap)
	}
	reader.readAsDataURL(file)
}

function removeImage(index) {
	document.querySelectorAll('.img-wrap')[index].remove()
	imageFiles.splice(index, 1) // Remove the image from the array
	updateOrderNumbers()
}

function updateOrderNumbers() {
	document.querySelectorAll('.img-wrap .order-number').forEach((elem, index) => {
		elem.textContent = '#' + (index + 1)
	})
}

// Sortable images
function initializeSortable() {
	Sortable.create(document.getElementById('preview'), {
		animation: 150,
		ghostClass: 'blue-background-class',
		onUpdate: updateOrderNumbers,
	})
}

// Form submission handler
function handleFormSubmit(e) {
	e.preventDefault()
	let formData = new FormData(e.target)
	imageFiles.forEach((file) => formData.append('images', file))
	submitFormData(formData)
}

// Submit form data
function submitFormData(formData) {
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
