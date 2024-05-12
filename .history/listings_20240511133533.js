import { addPrevNextBtnsClickHandlers } from './EmblaCarouselArrowButtons.js'
import { addDotBtnsAndClickHandlers } from './EmblaCarouselDotButton.js'

document.addEventListener('DOMContentLoaded', function () {
	// Update the preview image when the carousel selection changes

	const OPTIONS = { align: 'start', dragFree: true, loop: false }

	const emblaNode = document.querySelector('.embla')
	const viewportNode = emblaNode.querySelector('.embla__viewport')
	const prevBtnNode = emblaNode.querySelector('.embla__button--prev')
	const nextBtnNode = emblaNode.querySelector('.embla__button--next')
	const dotsNode = emblaNode.querySelector('.embla__dots')

	const emblaApi = EmblaCarousel(viewportNode, OPTIONS)

	const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
		emblaApi,
		prevBtnNode,
		nextBtnNode
	)
	const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(emblaApi, dotsNode)

	emblaApi.on('destroy', removePrevNextBtnsClickHandlers)
	emblaApi.on('destroy', removeDotBtnsAndClickHandlers)
	emblaApi.on('select', function () {
		var selectedIndex = embla.selectedScrollSnap()
		var selectedImage = embla.slideNodes()[selectedIndex].querySelector('img')
		var previewImage = document.getElementById('vehImg')
		previewImage.src = selectedImage.src
	})
})
