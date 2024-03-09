window.onload = function () {
	var liElements = document.querySelectorAll('.progBtn')

	liElements.forEach(function (li) {
		li.addEventListener('click', function () {
			var buttonText = this.textContent.trim() // This will store the text of the clicked li element in the buttonText variable
			// You can use the buttonText variable to route it
			console.log(buttonText) // This will print the text of the clicked li element to the console
			if (buttonText == 'Add New Listing') {
			} else if (buttonText == 'Remove A Listing') {
			} else if (buttonText == 'Re-Order Listings') {
			} else if (buttonText == 'Edit A Listign') {
			}
		})
	})
}
