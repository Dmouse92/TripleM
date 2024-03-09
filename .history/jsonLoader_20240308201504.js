window.onload = function () {
	var liElements = document.querySelectorAll('.progBtn')

	liElements.forEach(function (li) {
		li.addEventListener('click', function () {
			var buttonText = this.textContent.trim() // This will store the text of the clicked li element in the buttonText variable
			// You can use the buttonText variable to route it
			console.log(buttonText) // This will print the text of the clicked li element to the console
			if (buttonText == 'Add New Listing') {
				console.log('Add New Listing')
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
function addCar() {}
function remCar() {}
function editCar() {}

let addCont = document.createElement('div')
let remCont = document.createElement('div')
let reoCont = document.createElement('div')
let edtCont = document.createElement('div')
addCont.innerHTML = `
	<div id="parent">
			<div id="header">
				<h1 id="header Title">Triple M Product Manager</h1>
				<p id="headerDescr">Add, Remove, and Re-order Products Below</p>
			</div>
			<div id="body">
				<ul id="itmList">
					<li class="progBtn addBtn button">Add New Listing</li>
					<li class="progBtn remBtn">Remove A Listing</li>
					<li class="progBtn reoBtn">Re-Order Listings</li>
					<li class="progBtn edtBtn">Edit A Listing</li>
				</ul>
			</div>
		</div>
	`
