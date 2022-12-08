import React from 'react'
import { createRoot } from 'react-dom/client'
import { ContentLoader } from '../components/ContentLoader'
import { EventsInner, ContentLoadedV1, ContentLoadFailedV1, DefaultApi, Configuration, ConfigurationParameters, CreateEventsV1EventsPostRequest } from '../eventsapi'
import { v4 as uuidv4 } from 'uuid'
import { MoodleApi } from '../moodleapi'
const OS_RAISE_CONTENT_CLASS = 'os-raise-content'
const ENV_STAGING = 'staging.raiselearing.org'
const ENV_PRODUCTION = 'raiselearning.org'
const ENV_LOCAL = 'localhost:8000'
const API_ENDPOINT_PROD = 'https://k12.openstax.org/contents/raise'
const API_ENDPOINT_LOCAL = 'http://localhost:8888'
const EVENT_FLUSH_PERIOD = 2000
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

const collectCourseID = (): number => {
  const courseID = window.M?.cfg.courseId
  if (courseID === undefined) {
    throw new Error('Error Collecting CourseID')
  }
  return parseInt(courseID)
}

export const createContentLoadV1Event = (contentID: string, variant: string): ContentLoadedV1 => {
  const event: ContentLoadedV1 = {
    courseId: collectCourseID(),
    impressionId: impressionID,
    sourceUri: window.location.toString(),
    timestamp: Date.now(),
    eventname: 'content_loaded_v1',
    contentId: contentID,
    variant
  }
  return event
}

export const createContentLoadFailedV1 = (error: string, contentID: string): ContentLoadFailedV1 => {
  const event: ContentLoadFailedV1 = {
    courseId: collectCourseID(),
    impressionId: impressionID,
    sourceUri: window.location.toString(),
    timestamp: Date.now(),
    eventname: 'content_load_failed_v1',
    contentId: contentID,
    error
  }
  return event
}

class EventManager {
  private static instance: EventManager
  protected eventQueue: EventsInner[] = []
  protected static eventApi: DefaultApi | undefined
  protected static moodleApi: MoodleApi | undefined

  private constructor() {
    setTimeout(() => {
      void this.flushEvents()
    }, EVENT_FLUSH_PERIOD)

    document.onvisibilitychange = () => {
      if (document.visibilityState === 'hidden') {
        void this.flushEvents()
      }
    }
  }

  private static async getAccessToken(): Promise<string> {
    if (window.M?.cfg.wwwroot === undefined) {
      throw new Error('wwwroot env variable is undefined.')
    }
    this.moodleApi = new MoodleApi(window.M?.cfg.wwwroot, window.M?.cfg.sesskey)
    const res = await this.moodleApi.getUser()
    return res.jwt
  }

  private static getApiPath(envRoot: string): string {
    if (envRoot === ENV_PRODUCTION || envRoot === ENV_STAGING) {
      return API_ENDPOINT_PROD
    } else {
      return API_ENDPOINT_LOCAL
    }
  }

  static getInstance(): EventManager {
    const envRoot = window.location.host.toString()
    if (envRoot !== ENV_PRODUCTION && envRoot !== ENV_STAGING && envRoot !== ENV_LOCAL) {
      this.eventApi = undefined
      this.moodleApi = undefined
      return new EventManager()
    }

    if (!this.instance) {
      this.instance = new EventManager()
      console.log('NEW EVENT MANAGER!!')
    }

    this.getAccessToken().then((jwt) => {
      const eventApiPath = EventManager.getApiPath(envRoot)
      const parameters: ConfigurationParameters = {
        accessToken: jwt,
        basePath: eventApiPath,
        headers: { 'Access-Control-Allow-Origin': eventApiPath }
      }
      const config = new Configuration(parameters)
      this.eventApi = new DefaultApi(config)
      console.log('Setup complete')
    }).catch(() => {
      this.eventApi = undefined
      this.moodleApi = undefined
    })

    return this.instance
  }

  queueEvent(event: EventsInner): void {
    this.eventQueue.push(event)
    console.log(this.eventQueue)
  }

  private async flushEvents(): Promise<void> {
    console.log('FLUSH')
    if (EventManager.eventApi === undefined || EventManager.moodleApi === undefined) {
      console.log('Events API Not Instantiated')
    } else if (this.eventQueue.length === 0) {
      console.log('NO EVENTS')
    } else {
      const requestInit = { keepalive: true }
      const eventsRequest: CreateEventsV1EventsPostRequest = {
        eventsInner: this.eventQueue
      }
      const ret = await EventManager.eventApi.createEventsV1EventsPost(eventsRequest, requestInit)
      if (ret.detail === 'Success!') {
        this.eventQueue = []
      }
    }
    setTimeout(() => {
      void this.flushEvents()
    }, EVENT_FLUSH_PERIOD)
  }
}
