document.addEventListener('DOMContentLoaded', function () {
	var emblaNode = document.querySelector('.embla')
	var options = { loop: true, draggable: true }
	var embla = EmblaCarousel(emblaNode, options)

	// Update the preview image when the carousel selection changes
	embla.on('select', function () {
		var selectedIndex = embla.selectedScrollSnap()
		var selectedImage = embla.slideNodes()[selectedIndex].querySelector('img')
		var previewImage = document.getElementById('previewImage')
		previewImage.src = selectedImage.src
	})
})

