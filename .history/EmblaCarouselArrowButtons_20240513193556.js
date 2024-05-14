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
export const addPrevNextBtnsClickHandlers = (emblaApi, prevBtn, nextBtn) => {
	const scrollPrev = () => {
		emblaApi.scrollPrev()
	}
	const scrollNext = () => {
		emblaApi.scrollNext()
	}
	prevBtn.addEventListener('click', scrollPrev, false)
	nextBtn.addEventListener('click', scrollNext, false)

	const removeTogglePrevNextBtnsActive = addTogglePrevNextBtnsActive(emblaApi, prevBtn, nextBtn)

	return () => {
		removeTogglePrevNextBtnsActive()
		prevBtn.removeEventListener('click', scrollPrev, false)
		nextBtn.removeEventListener('click', scrollNext, false)
	}
}
