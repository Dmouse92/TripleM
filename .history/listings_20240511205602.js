import { addPrevNextBtnsClickHandlers } from './EmblaCarouselArrowButtons.js'
import { addDotBtnsAndClickHandlers } from './EmblaCarouselDotButton.js'
import { addThumbBtnsClickHandlers, addToggleThumbBtnsActive } from './EmblaCarouselThumbsButton.js'
document.addEventListener('DOMContentLoaded', function () {
	// Update the preview image when the carousel selection changes

	const OPTIONS = { align: 'start', dragFree: true, loop: false }
	const OPTIONS_THUMBS = {
		containScroll: 'keepSnaps',
		dragFree: true,
	}
	const emblaNode = document.querySelector('.embla')
	//const viewportNode = emblaNode.querySelector('.embla__viewport')
	const prevBtnNode = emblaNode.querySelector('.embla__button--prev')
	const nextBtnNode = emblaNode.querySelector('.embla__button--next')
	const dotsNode = emblaNode.querySelector('.embla__dots')
	const viewportNodeMainCarousel = document.querySelector('.embla__viewport')
	const viewportNodeThumbCarousel = document.querySelector('.embla-thumbs__viewport')
	const emblaApiMain = EmblaCarousel(viewportNodeMainCarousel, OPTIONS)
	const emblaApiThumb = EmblaCarousel(viewportNodeThumbCarousel, OPTIONS_THUMBS)
	const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(emblaApiMain, emblaApiThumb)
	const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(emblaApiMain, emblaApiThumb)
	const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
		emblaApiThumb,
		prevBtnNode,
		nextBtnNode
	)

	emblaApiMain
		.on('destroy', removeThumbBtnsClickHandlers)
		.on('destroy', removeToggleThumbBtnsActive)

		.on('destroy', removePrevNextBtnsClickHandlers)

	emblaApiThumb
		.on('destroy', removeThumbBtnsClickHandlers)
		.on('destroy', removeToggleThumbBtnsActive)

		.on('destroy', removePrevNextBtnsClickHandlers)

	emblaApiM.on('select', function () {})
})
