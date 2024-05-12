
import { addThumbBtnsClickHandlers, addToggleThumbBtnsActive } from './EmblaCarouselThumbsButton.js'
document.addEventListener('DOMContentLoaded', function () {
	// Update the preview image when the carousel selection changes

	const OPTIONS = { align: 'start', watchDrag: false, loop: false }
	const OPTIONS_THUMBS = {
		containScroll: 'keepSnaps',
		dragFree: true,
		align: 'start',
	}
	const emblaNode = document.querySelector('.embla')	const viewportNodeMainCarousel = document.querySelector('.embla__viewport')
	const viewportNodeThumbCarousel = document.querySelector('.embla-thumbs__viewport')
	const emblaApiMain = EmblaCarousel(viewportNodeMainCarousel, OPTIONS)
	const emblaApiThumb = EmblaCarousel(viewportNodeThumbCarousel, OPTIONS_THUMBS)
	const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(emblaApiMain, emblaApiThumb)
	const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(emblaApiMain, emblaApiThumb)


	emblaApiMain
		.on('destroy', removeThumbBtnsClickHandlers)
		.on('destroy', removeToggleThumbBtnsActive)


	emblaApiThumb
		.on('destroy', removeThumbBtnsClickHandlers)
		.on('destroy', removeToggleThumbBtnsActive)

})
