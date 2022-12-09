
import { EventsInner, ContentLoadedV1, ContentLoadFailedV1, DefaultApi, Configuration, ConfigurationParameters, CreateEventsV1EventsPostRequest, DetailMessage } from '../eventsapi'
import { v4 as uuidv4 } from 'uuid'
import { MoodleApi } from '../moodleapi'
import { collectCourseID } from './utils'
import * as settings from './settings'
const impressionID = uuidv4()

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
      const parameters: ConfigurationParameters = {
        accessToken: jwt,
        basePath: EventManager.getApiPath(envRoot)
      }
      this.eventApi = new DefaultApi(new Configuration(parameters))
    }).catch(() => {
      this.eventApi = undefined
      this.moodleApi = undefined
    })

    return this.instance
  }

  queueEvent(event: EventsInner): void {
    this.eventQueue.push(event)
  }

  flushEvents(): boolean {
    this.flushEventsAsync().then((response) => {
      if (response.detail !== 'Success!') {
        return false
      }
      this.eventQueue = []
      return true
    }).catch(() => { return false })
    return false
  }

  private async flushEventsAsync(): Promise<DetailMessage> {
    let result: DetailMessage
    if (EventManager.eventApi === undefined || EventManager.moodleApi === undefined) {
      result = { detail: 'EventsApi not instantiated' }
    } else if (this.eventQueue.length === 0) {
      result = { detail: 'No events in queue to flush' }
    } else {
      const requestInit = { keepalive: true }
      const eventsRequest: CreateEventsV1EventsPostRequest = {
        eventsInner: this.eventQueue
      }
      result = await EventManager.eventApi.createEventsV1EventsPost(eventsRequest, requestInit)
    }
    setTimeout(() => {
      this.flushEvents()
    }, settings.EVENT_FLUSH_PERIOD)
    return result
  }
}
