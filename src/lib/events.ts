
import { EventsInner, ContentLoadedV1, ContentLoadFailedV1, DefaultApi, Configuration, ConfigurationParameters, CreateEventsV1EventsPostRequest, DetailMessage } from '../eventsapi'
import { v4 as uuidv4 } from 'uuid'
import { MoodleApi } from '../moodleapi'
import * as settings from './settings'
const impressionID = uuidv4()

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

export const createContentLoadFailedV1 = (contentID: string, error?: string): ContentLoadFailedV1 => {
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

export class EventManager {
  private static instance: EventManager
  protected eventQueue: EventsInner[] = []
  protected static eventApi: DefaultApi | undefined
  protected static moodleApi: MoodleApi | undefined

  private constructor() {
    setTimeout(() => {
      this.flushEvents()
    }, settings.EVENT_FLUSH_PERIOD)

    document.onvisibilitychange = () => {
      if (document.visibilityState === 'hidden') {
        this.flushEvents()
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
    if (envRoot === settings.ENV_PRODUCTION || envRoot === settings.ENV_STAGING) {
      return settings.API_ENDPOINT_PROD
    } else {
      return settings.API_ENDPOINT_LOCAL
    }
  }

  static getInstance(): EventManager {
    const envRoot = window.location.host.toString()
    if (envRoot !== settings.ENV_PRODUCTION && envRoot !== settings.ENV_STAGING && envRoot !== settings.ENV_LOCAL) {
      this.eventApi = undefined
      this.moodleApi = undefined
      return new EventManager()
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!this.instance) {
      this.instance = new EventManager()
    }

    this.getAccessToken().then((jwt) => {
      const eventApiPath = EventManager.getApiPath(envRoot)
      const parameters: ConfigurationParameters = {
        accessToken: jwt,
        basePath: eventApiPath
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

  flushEvents(): boolean {
    console.log('FLUSH')
    this.flushEventsAsync().then((response) => {
      if (response.detail !== 'Success!') {
        console.log(response.detail)
        return false
      }
      return true
    }).catch(() => { return false })
    return false
  }

  private async flushEventsAsync(): Promise<DetailMessage> {
    let ret: DetailMessage
    if (EventManager.eventApi === undefined || EventManager.moodleApi === undefined) {
      ret = { detail: 'EventsApi not instantiated' }
    } else if (this.eventQueue.length === 0) {
      ret = { detail: 'No Events in Queue to Flush' }
    } else {
      const requestInit = { keepalive: true }
      const eventsRequest: CreateEventsV1EventsPostRequest = {
        eventsInner: this.eventQueue
      }
      const response = await EventManager.eventApi.createEventsV1EventsPost(eventsRequest, requestInit)
      if (response.detail === 'Success!') {
        this.eventQueue = []
      }
      ret = response
    }
    setTimeout(() => {
      this.flushEvents()
    }, settings.EVENT_FLUSH_PERIOD)
    return ret
  }
}
