import {
  EventsInner as ApiEvent,
  ContentLoadedV1,
  ContentLoadFailedV1,
  DefaultApi as EventsApi,
  Configuration,
  ConfigurationParameters,
  CreateEventsV1EventsPostRequest,
  DetailMessage
} from '../eventsapi'
import { v4 as uuidv4 } from 'uuid'
import { MoodleApi } from '../moodleapi'
import { getCurrentContext } from './utils'
import { ENV } from './env'
const impressionId = uuidv4()

export const createContentLoadedV1Event = (contentId: string, variant: string): ContentLoadedV1 | null => {
  const ctx = getCurrentContext()
  if (ctx.courseId === undefined) {
    return null
  }
  const event: ContentLoadedV1 = {
    courseId: parseInt(ctx.courseId),
    impressionId,
    sourceUri: window.location.toString(),
    timestamp: Date.now(),
    eventname: 'content_loaded_v1',
    contentId,
    variant
  }
  return event
}

export const createContentLoadFailedV1Event = (contentId: string, error?: string): ContentLoadFailedV1 | null => {
  const ctx = getCurrentContext()

  if (ctx.courseId === undefined) {
    return null
  }
  const event: ContentLoadFailedV1 = {
    courseId: parseInt(ctx.courseId),
    impressionId,
    sourceUri: window.location.toString(),
    timestamp: Date.now(),
    eventname: 'content_load_failed_v1',
    contentId,
    error
  }
  return event
}

export class EventManager {
  private static instance: EventManager
  protected eventQueue: ApiEvent[] = []
  protected static eventApi: EventsApi | undefined
  protected static moodleApi: MoodleApi | undefined

  private constructor() {
    setTimeout(() => {
      this.flushEvents()
    }, ENV.EVENT_FLUSH_PERIOD)

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
    const eventsEndpointMapper = ENV.OS_RAISE_EVENTSAPI_URL_MAP as { [key: string]: string | undefined }
    const eventsEndpoint = eventsEndpointMapper[window.location.host]
    if (eventsEndpoint !== undefined) {
      return eventsEndpoint
    } else {
      throw new Error('Environment data not availiable')
    }
  }

  static getInstance(): EventManager {
    // Check Environment
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

    // Authenticate with EventsApi
    this.getAccessToken().then((jwt) => {
      const parameters: ConfigurationParameters = {
        accessToken: jwt,
        basePath: EventManager.getApiPath(envRoot)
      }
      this.eventApi = new EventsApi(new Configuration(parameters))
    }).catch(() => {
      this.eventApi = undefined
      this.moodleApi = undefined
    })

    return this.instance
  }

  queueEvent(event: ApiEvent): void {
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
    }, ENV.EVENT_FLUSH_PERIOD)
    return result
  }
}
