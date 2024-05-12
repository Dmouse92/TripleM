import EmblaCarousel from 'embla-carousel'
import { addPrevNextBtnsClickHandlers } from './EmblaCarouselArrowButtons'
import { addDotBtnsAndClickHandlers } from './EmblaCarouselDotButton'
import '../css/base.css'
import '../css/sandbox.css'
import '../css/embla.css'
document.addEventListener('DOMContentLoaded', function () {
	const OPTIONS = { align: 'start', dragFree: true, loop: true }
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
