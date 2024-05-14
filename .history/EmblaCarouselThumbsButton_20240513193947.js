export const addThumbBtnsClickHandlers = (emblaApiMain, emblaApiThumb) => {
	//console.log('LAUNCH')
	const slidesThumbs = emblaApiThumb.slideNodes()
	if (!slidesThumbs.length) {
		console.error('No thumbnail slides found')
		return
	}
	const scrollToIndex = slidesThumbs.map((_, index) => () => {
		console.log(`Thumbnail ${index} clicked`)
		emblaApiMain.scrollTo(index)
	})

	slidesThumbs.forEach((slideNode, index) => {
		if (!slideNode) {
			console.error(`Missing slideNode at index ${index}`)
			return
		}
		//console.log(`Adding click handler to thumbnail ${index}`)
		slideNode.addEventListener('click', scrollToIndex[index], false)
	})

	return () => {
		slidesThumbs.forEach((slideNode, index) => {
			if (!slideNode) {
				console.error(`Missing slideNode at index ${index}`)
				return
			}
			console.log(`Removing click handler from thumbnail ${index}`)
			slideNode.removeEventListener('click', scrollToIndex[index], false)
		})
	}
}

export const addToggleThumbBtnsActive = (emblaApiMain, emblaApiThumb) => {
	const slidesThumbs = emblaApiThumb.slideNodes()

	const toggleThumbBtnsState = () => {
		//console.log('TOGGLE THUM BTN STATE INIT')
		emblaApiThumb.scrollTo(emblaApiMain.selectedScrollSnap())
		const previous = emblaApiMain.previousScrollSnap()
		const selected = emblaApiMain.selectedScrollSnap()
		slidesThumbs[previous].classList.remove('embla-thumbs__slide--selected')
		slidesThumbs[selected].classList.add('embla-thumbs__slide--selected')
	}

	emblaApiMain.on('select', toggleThumbBtnsState)
	emblaApiThumb.on('init', toggleThumbBtnsState)

	return () => {
		const selected = emblaApiMain.selectedScrollSnap()
		slidesThumbs[selected].classList.remove('embla-thumbs__slide--selected')
	}
}
