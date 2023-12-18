export const stylify = async (element: HTMLElement): Promise<void> => {
  const accordionItems = element.querySelectorAll('.os-raise-accordion-item')

  const setMaxHeight = (item: Element, content: HTMLElement): void => {
    if (item.classList.contains('active')) {
      content.style.maxHeight = content.scrollHeight + 'px'
      content.setAttribute('aria-hidden', 'false')
    } else {
      content.style.maxHeight = '0px'
      content.setAttribute('aria-hidden', 'true')
    }
  }

  accordionItems.forEach(item => {
    const header = item.querySelector('.os-raise-accordion-header')
    const content = item.querySelector('.os-raise-accordion-content')
    const contentElement = content as HTMLElement

    if (header === null || content === null) {
      console.error('Header or content missing')
      return
    }
    const dynamicElements = contentElement.querySelectorAll('img, iframe, video')
    const toggleAccordion = (): void => {
      item.classList.toggle('active')
      setMaxHeight(item, contentElement)
    }

    header.addEventListener('click', toggleAccordion)

    dynamicElements.forEach(element => {
      element.addEventListener('load', () => { setMaxHeight(item, contentElement) })
    })
    if (!item.classList.contains('active')) {
      contentElement.setAttribute('aria-hidden', 'true')
    }
  })

  const handleWindowResize = (): void => {
    accordionItems.forEach(item => {
      const content = item.querySelector('.os-raise-accordion-content')
      const contentElement = content as HTMLElement

      setMaxHeight(item, contentElement)
    })
  }

  window.addEventListener('resize', handleWindowResize)
}
