document.addEventListener('DOMContentLoaded', () => {
	// Add event listeners to the buttons
	document.querySelectorAll('.progBtn').forEach((btn) => {
		btn.addEventListener('click', (event) => {
			const buttonText = event.target.textContent.trim()
			switch (buttonText) {
				case 'Add New Listing':
					toggleAddCarForm(true)
					break
				case 'Remove A Listing':
					// Future implementation
					break
				case 'Re-Order Listings':
					// Future implementation
					break
				case 'Edit A Listing':
					// Future implementation
					break
				default:
					console.error('Unhandled button text:', buttonText)
			}
		})
	})

	initializeFormEventListeners()
})

function handleRadioChange(event) {
	document.querySelectorAll(`input[name="${event.target.name}"]`).forEach((radio) => {
		radio.checked = radio === event.target
	})
}

function toggleAddCarForm(show) {
	let addCont = document.querySelector('.addContain')
	let btnCont = document.getElementById('btnCont')
	addCont.style.display = show ? 'grid' : 'none'
	btnCont.style.display = show ? 'none' : 'block'
}

function initializeFormEventListeners() {
	const yearInput = document.getElementById('year')
	yearInput.addEventListener('input', function () {
		if (this.value.length > 4) {
			this.value = this.value.slice(0, 4)
		}
	})

	document.getElementById('images').addEventListener('change', handleImageUpload)
	document.getElementById('addForm').addEventListener('submit', handleFormSubmit)
}

let imageFiles = [] // Store image files

function handleImageUpload(e) {
	const files = e.target.files
	const preview = document.getElementById('preview')
	preview.innerHTML = '' // Clear existing images
	imageFiles = Array.from(files) // Store the FileList as an array
	imageFiles.forEach((file, index) => createImagePreview(file, index))
}

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

		imgWrap
			.querySelector('.preview-img')
			.addEventListener('click', () => openImageOverlay(e.target.result))
	}
	reader.readAsDataURL(file)
}

function openImageOverlay(src) {
	if (document.getElementById('image-overlay')) return

	const overlay = document.createElement('div')
	overlay.id = 'image-overlay'
	overlay.innerHTML = `<div class="overlay-content"><img src="${src}" class="overlay-img" /><div class="overlay-close" onclick="closeImageOverlay()">X</div></div>`
	document.body.appendChild(overlay)
}

function closeImageOverlay() {
	document.getElementById('image-overlay')?.remove()
}

function removeImage(index) {
	document.querySelectorAll('.img-wrap')[index].remove()
	imageFiles.splice(index, 1)
	updateOrderNumbers() // Reflect changes in UI
}

function updateOrderNumbers() {
	document.querySelectorAll('.img-wrap').forEach((wrap, index) => {
		wrap.querySelector('.order-number').textContent = `#${index + 1}`
		wrap.querySelector('.close').setAttribute('onclick', `removeImage(${index})`)
	})
}

function initializeSortable() {
	new Sortable(document.getElementById('preview'), {
		animation: 150,
		ghostClass: 'sortable-ghost',
		onSort: updateOrderNumbers,
	})
}

function handleFormSubmit(e) {
	e.preventDefault()
	let formData = new FormData(e.target)

	imageFiles.forEach((file, index) => {
		formData.append('images', file)
	})

	// Dynamically update the Order-Index header based on current order
	const orderIndexes = [...document.querySelectorAll('.order-number')].map(
		(orderNumber) => parseInt(orderNumber.textContent.substring(1)) - 1
	)
	submitFormData(formData, orderIndexes)
}

function submitFormData(formData, orderIndexes) {
	fetch('http://localhost:3000/upload', {
		method: 'POST',
		body: formData,
		headers: {
			'Order-Index': JSON.stringify(orderIndexes),
		},
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

toggleAddCarForm(false) // Initially hide the form
initializeSortable() // Initialize sortable functionality once
