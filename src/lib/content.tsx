import React, { useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { ContentLoader } from '../components/ContentLoader'
import { EventsInner, ContentLoadedV1, ContentLoadFailedV1 } from '../eventsapi'
import { v4 as uuidv4 } from 'uuid';
const OS_RAISE_CONTENT_CLASS = 'os-raise-content'
const impressionID = uuidv4()


export const renderContentElements = (): number => {
  const osContentItems = document.querySelectorAll(`.${OS_RAISE_CONTENT_CLASS}`)

  osContentItems.forEach((elem) => {
    const htmlElem = elem as HTMLElement
    const contentId = htmlElem.dataset.contentId

    if (contentId === undefined) {
      console.log('WARNING: Ignoring os-raise-content with missing UUID data attribute')
      return
    }

    if (htmlElem.hasChildNodes()) {
      console.log('WARNING: Found non-empty os-raise-content')
    }

    createRoot(htmlElem).render(
      <React.StrictMode>
        <ContentLoader contentId={contentId} onContentLoad={(contentID: string, variant: string) => { EventManager.getInstance().queueEvent(createContentLoadV1Event(contentID, variant)) }}
          onContentLoadFailure={(error: string) => { EventManager.getInstance().queueEvent(createContentLoadFailedV1(error, contentId)) }} />
      </React.StrictMode>
    )
  })

  return osContentItems.length
}

export const createContentLoadV1Event = (contentID: string, variant: string): ContentLoadedV1 => {

  const courseID = window.M?.cfg.courseId
  if (courseID === undefined) {
    throw new Error('No course ID')
  }
  const event: ContentLoadedV1 = {
    courseId: parseInt(courseID),
    impressionId: impressionID,
    sourceUri: window.location.toString(),
    timestamp: 1234,
    eventname: 'content_loaded_v1',
    contentId: contentID,
    variant: variant
  }
  return event
}

export const createContentLoadFailedV1 = (error: string, contentID: string): ContentLoadFailedV1 => {
  const courseID = window.M?.cfg.courseId
  if (courseID === undefined) {
    throw new Error('No course ID')
  }
  const event: ContentLoadFailedV1 = {
    courseId: parseInt(courseID),
    impressionId: impressionID,
    sourceUri: window.location.toString(),
    timestamp: 1234,
    eventname: 'content_load_failed_v1',
    contentId: contentID,
    error: error
  }
  return event
}

class EventManager {

  private static instance: EventManager
  private eventQueue: EventsInner[] = []

  private constructor() {

  }

  // Static method to retreive the singleton instance
  static getInstance(): EventManager {
    if (!this.instance) {
      this.instance = new EventManager()
      console.log('NEW EVENT MANAGER!!')
    }
    return this.instance;
  }
  queueEvent(event: EventsInner) {
    this.eventQueue.push(event)
    console.log(this.eventQueue)
  }

}