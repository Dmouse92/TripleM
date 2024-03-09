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
}

let progCont = document.getElementById('body')
function reOrder() {}
function addCar() {
	progCont.classList.add('addContainer')
	progCont.innerHTML = addCont
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
let addCont = `
		<form id="addForm">
	<div class="formDiv">
		<label for="make" class="inpLabel">Make:</label>
		<input type="text" id="make" name="make"  placeholder="Enter Make" class="inpForm" />
	</div>
	<div class="formDiv">
		<label for="model" class="inpLabel">Model:</label>
		<input type="text" id="model" name="model"  placeholder="Enter Modal" class="inpForm" />
	</div >
	<div class="formDiv">
		<label for="year" class="inpLabel">Year:</label>
		<input type="number" maxlength="4" id="year"  placeholder="Enter Year" name="year" class="inpForm" />
	</div >
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
        <label for="transmission" class="inpLabel">Transmission Type:</label>
        <input type="radio" id="automatic" name="transmission" value="Automatic">
        <label for="automatic">Automatic</label>
        <input type="radio" id="manual" name="transmission" value="Manual">
        <label for="manual">Manual</label>
    </div>
    <div class="formDiv">
        <label for="drive" class="inpLabel">Drive Type:</label>
        <input type="radio" id="fwd" name="drive" value="FWD">
        <label for="fwd">FWD</label>
        <input type="radio" id="rwd" name="drive" value="RWD">
        <label for="rwd">RWD</label>
        <input type="radio" id="awd" name="drive" value="AWD">
        <label for="awd">AWD</label>
        <input type="radio" id="4wd" name="drive" value="4WD">
        <label for="4wd">4WD</label>
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
	<!-- Continue adding classes for the rest of your form fields -->
</form>

	`
let remCont = ''
let reoCont = ''
let edtCont = ''
addCar()
/*
 <script>
    const priceInput = document.getElementById('price');
    priceInput.addEventListener('focus', function() {
        if (!this.value) {
            this.value = '$';
        }
    });
    priceInput.addEventListener('blur', function() {
        if (this.value === '$') {
            this.value = '';
        }
    });
</script> */
