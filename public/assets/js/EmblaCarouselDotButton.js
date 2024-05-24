export const addDotBtnsAndClickHandlers = (
	emblaApiMain,
	emblaApiThumb,
	dotsNode,
	syncCarousels
) => {
	let dotNodes = []

	const addDotBtnsWithClickHandlers = () => {
		dotsNode.innerHTML = emblaApiMain
			.scrollSnapList()
			.map(() => '<button class="embla__dot" type="button"></button>')
			.join('')

		const scrollTo = (index) => {
			emblaApiMain.scrollTo(index)
			syncCarousels(emblaApiMain, emblaApiThumb)
		}

		dotNodes = Array.from(dotsNode.querySelectorAll('.embla__dot'))
		dotNodes.forEach((dotNode, index) => {
			dotNode.addEventListener('click', () => scrollTo(index), false)
		})
	}

	const toggleDotBtnsActive = () => {
		const previous = emblaApiMain.previousScrollSnap()
		const selected = emblaApiMain.selectedScrollSnap()
		dotNodes[previous].classList.remove('embla__dot--selected')
		dotNodes[selected].classList.add('embla__dot--selected')
	}

	emblaApiMain
		.on('init', addDotBtnsWithClickHandlers)
		.on('reInit', addDotBtnsWithClickHandlers)
		.on('init', toggleDotBtnsActive)
		.on('reInit', toggleDotBtnsActive)
		.on('select', toggleDotBtnsActive)

	return () => {
		dotsNode.innerHTML = ''
	}
}
