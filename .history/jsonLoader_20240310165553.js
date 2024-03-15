window.onload = function () {
	document
		.querySelectorAll('.progBtn')
		.forEach((li) => li.addEventListener('click', handleButtonClick))
	;['automatic', 'manual', 'fwd', 'rwd', 'awd'].forEach((id) =>
		document.getElementById(id).addEventListener('change', handleRadioChange)
	)
	document.getElementById('year').addEventListener('input', function () {
		if (this.value.length > 4) this.value = this.value.slice(0, 4)
	})
	document.getElementById('addForm').addEventListener('submit', handleFormSubmit)
}

function handleButtonClick() {
	var buttonText = this.textContent.trim()
	console.log(buttonText)
	if (buttonText == 'Add New Listing') addCar()
}

function handleRadioChange(event) {
	let radios = document.querySelectorAll(`input[name="${event.target.name}"]`)
	radios.forEach((radio) => {
		radio.checked = false
	})
	event.target.checked = true
}

function addCar() {
	document.querySelector('.addContain').style.display = 'grid'
	document.getElementById('btnCont').style.display = 'none'
}

function handleFormSubmit(event) {
	event.preventDefault()
	var formData = new FormData(event.target)
	var formObject = {}
	formData.forEach((value, key) => {
		formObject[key] = value
	})
	console.log(JSON.stringify(formObject))
}
