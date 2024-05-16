import { addThumbBtnsClickHandlers, addToggleThumbBtnsActive } from './EmblaCarouselThumbsButton.js'
import { addPrevNextBtnsClickHandlers } from './EmblaCarouselArrowButtons.js'
import { addDotBtnsAndClickHandlers } from './EmblaCarouselDotButton.js'
document.addEventListener('DOMContentLoaded', function () {
	// Update the preview image when the carousel selection changes

	const OPTIONS = { align: 'start', watchDrag: true, loop: false }
	const OPTIONS_THUMBS = {
		containScroll: 'keepSnaps',
		dragFree: true,
		align: 'start',
	}

	const viewportNodeMainCarousel = document.querySelector('.embla__viewport')
	const viewportNodeThumbCarousel = document.querySelector('.embla-thumbs__viewport')

	const emblaApiMain = EmblaCarousel(viewportNodeMainCarousel, OPTIONS)
	const emblaApiThumb = EmblaCarousel(viewportNodeThumbCarousel, OPTIONS_THUMBS)

	const prevBtnNode = document.querySelector('.embla__button--prev')
	const nextBtnNode = document.querySelector('.embla__button--next')
	const dotsNode = document.querySelector('.embla__dots')

	const syncCarousels = (primaryApi, secondaryApi) => {
		secondaryApi.scrollTo(primaryApi.selectedScrollSnap())
	}
	const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(emblaApiMain, emblaApiThumb)

	const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(emblaApiMain, emblaApiThumb)

	const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
		emblaApiMain,
		emblaApiThumb,
		prevBtnNode,
		nextBtnNode,
		syncCarousels
	)

	const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
		emblaApiMain,
		emblaApiThumb,
		dotsNode,
		syncCarousels
	)
	const slides = emblaApiMain.slideNodes()
	const overlay = document.getElementById('fullScreenOverlay')
	slides.forEach((slideNode, index) => {
		slideNode.addEventListener('click', function () {
			console.log('I: ', index)
			showFullScreenCarousel(index)
		})
	})

	overlay.addEventListener('click', function (event) {
		if (event.target === overlay) {
			closeFullScreenCarousel()
		}
	})
	document.getElementById('closeBTNEmbla').addEventListener('click', closeFullScreenCarousel)
	emblaApiMain
		.on('destroy', removeThumbBtnsClickHandlers)
		.on('destroy', removeToggleThumbBtnsActive)
		.on('destroy', removePrevNextBtnsClickHandlers)
		.on('destroy', removeDotBtnsAndClickHandlers)

	emblaApiThumb
		.on('destroy', removeThumbBtnsClickHandlers)
		.on('destroy', removeToggleThumbBtnsActive)
		.on('destroy', removePrevNextBtnsClickHandlers)
		.on('destroy', removeDotBtnsAndClickHandlers)
})

function showFullScreenCarousel(startIndex) {
	const overlay = document.getElementById('fullScreenOverlay')
	overlay.style.display = 'block'

	const emblaNodeMain = overlay.querySelector('.embla-fullscreen-view')
	const emblaNodeThumb = overlay.querySelector('.embla-fullscreen-view')
	const emblaMain = EmblaCarousel(emblaNodeMain, {
		align: 'start',
		watchDrag: true,
		loop: false,
		startIndex: startIndex,
	})
	const emblaThumb = EmblaCarousel(emblaNodeThumb, {
		align: 'start',
		watchDrag: true,
		loop: false,
		startIndex: startIndex,
	})

	const prevBtnNode = emblaNodeMain.querySelector('.embla__button--prev')
	const nextBtnNode = emblaNodeMain.querySelector('.embla__button--next')

	prevBtnNode.addEventListener('click', function () {
		console.log('PRES')
		embla.scrollPrev()
	})
	nextBtnNode.addEventListener('click', embla.scrollNext)

	embla.on('init', () => {
		prevBtnNode.disabled = embla.canScrollPrev() ? false : true
		nextBtnNode.disabled = embla.canScrollNext() ? false : true
	})

	embla.on('select', () => {
		console.log('PRESSSS')
		prevBtnNode.disabled = embla.canScrollPrev() ? false : true
		nextBtnNode.disabled = embla.canScrollNext() ? false : true
	})
	const syncCarousels = (primaryApi, secondaryApi) => {
		secondaryApi.scrollTo(primaryApi.selectedScrollSnap())
	}
	const removeThumbBtnsClickHandlers = addThumbBtnsClickHandlers(emblaMain, emblaThumb)

	const removeToggleThumbBtnsActive = addToggleThumbBtnsActive(emblaMain, emblaThumb)

	const removePrevNextBtnsClickHandlers = addPrevNextBtnsClickHandlers(
		emblaMain,
		emblaThumb,
		prevBtnNode,
		nextBtnNode,
		syncCarousels
	)

	const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
		emblaMain,
		emblaThumb,
		dotsNode,
		syncCarousels
	)
	emblaApiMain
		.on('destroy', removeThumbBtnsClickHandlers)
		.on('destroy', removeToggleThumbBtnsActive)
		.on('destroy', removePrevNextBtnsClickHandlers)
		.on('destroy', removeDotBtnsAndClickHandlers)

	emblaApiThumb
		.on('destroy', removeThumbBtnsClickHandlers)
		.on('destroy', removeToggleThumbBtnsActive)
		.on('destroy', removePrevNextBtnsClickHandlers)
		.on('destroy', removeDotBtnsAndClickHandlers)
}
function closeFullScreenCarousel() {
	const overlay = document.getElementById('fullScreenOverlay')
	overlay.style.display = 'none'
}
