const addTogglePrevNextBtnsActive = (emblaApi, prevBtn, nextBtn) => {
	const togglePrevNextBtnsState = () => {
		if (emblaApi.canScrollPrev()) prevBtn.removeAttribute('disabled')
		else prevBtn.setAttribute('disabled', 'disabled')

		if (emblaApi.canScrollNext()) nextBtn.removeAttribute('disabled')
		else nextBtn.setAttribute('disabled', 'disabled')
	}

	emblaApi
		.on('select', togglePrevNextBtnsState)
		.on('init', togglePrevNextBtnsState)
		.on('reInit', togglePrevNextBtnsState)

	return () => {
		prevBtn.removeAttribute('disabled')
		nextBtn.removeAttribute('disabled')
	}
}
export const addPrevNextBtnsClickHandlers = (
	emblaApiMain,
	emblaApiThumb,
	prevBtnNode,
	nextBtnNode,
	syncCarousels
) => {
	const scrollPrev = () => {
		emblaApiMain.scrollPrev()
		syncCarousels(emblaApiMain, emblaApiThumb)
	}
	const scrollNext = () => {
		emblaApiMain.scrollNext()
		syncCarousels(emblaApiMain, emblaApiThumb)
	}
	prevBtnNode.addEventListener('click', scrollPrev, false)
	nextBtnNode.addEventListener('click', scrollNext, false)

	const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(
		emblaApiMain,
		prevBtnNode,
		nextBtnNode
	)

	return () => {
		removeTogglePrevNextBtnsActive()
		prevBtnNode.removeEventListener('click', scrollPrev, false)
		nextBtnNode.removeEventListener('click', scrollNext, false)
	}
}
