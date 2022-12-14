import {
  EventsInner as ApiEvent,
  ContentLoadedV1,
  ContentLoadFailedV1,
  DefaultApi as EventsApi,
  Configuration,
  ConfigurationParameters,
  CreateEventsV1EventsPostRequest
} from '../eventsapi'
import { v4 as uuidv4 } from 'uuid'
import { MoodleApi } from '../moodleapi'
import { getCurrentContext } from './utils'
import { ENV } from './env'

export const queueContentLoadedV1Event = async (timestamp: number, contentId: string, variant: string): Promise<void> => {
  const eventManager = await EventManager.getInstance()
  eventManager.queueContentLoadedV1Event(timestamp, contentId, variant)
}

export const queueContentLoadFailedV1Event = async (timestamp: number, contentId: string, error?: string): Promise<void> => {
  const eventManager = await EventManager.getInstance()
  eventManager.queueContentLoadFailedV1Event(timestamp, contentId, error)
}

interface EventManagerConfig {
  eventsApi: EventsApi
  flushPeriod: number
  impressionId: string
  courseId: number
}
class EventManager {
  private static instance: EventManager
  private static impressionId: string
  private readonly config: EventManagerConfig | undefined
  private readonly eventQueue: ApiEvent[] = []
  private timer: number | undefined
  private constructor(config?: EventManagerConfig) {
    this.config = config

    if (this.config !== undefined) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
          this.flushEvents()
        }
      })
    }
  }

  static async getInstance(): Promise<EventManager> {
    if (this.instance !== undefined) {
      return this.instance
    }
    this.impressionId = this.impressionId ?? uuidv4()
    const context = getCurrentContext()
    const eventsEndpointMapper = ENV.OS_RAISE_EVENTSAPI_URL_MAP as { [key: string]: string | undefined }
    const eventsEndpoint = eventsEndpointMapper[window.location.host]

    if (context.courseId === undefined || eventsEndpoint === undefined || window.M === undefined) {
      this.instance = new EventManager()
      return this.instance
    }
    const moodleApi = new MoodleApi(window.M.cfg.wwwroot, window.M.cfg.sesskey)
    const user = await moodleApi.getUser()
    const parameters: ConfigurationParameters = {
      accessToken: user.jwt,
      basePath: eventsEndpoint
    }

    const eventsApi = new EventsApi(new Configuration(parameters))

    this.instance = new EventManager({
      eventsApi,
      impressionId: this.impressionId,
      courseId: parseInt(context.courseId),
      flushPeriod: ENV.EVENT_FLUSH_PERIOD
    })
    return this.instance
  }

  flushEvents(): void {
    window.clearTimeout(this.timer)
    this.timer = undefined
    const events = this.eventQueue.splice(0)
    if ((this.config === undefined) || (events.length === 0)) {
      return
    }
    const requestInit = { keepalive: true }
    const eventsRequest: CreateEventsV1EventsPostRequest = {
      eventsInner: events
    }
    this.config.eventsApi.createEventsV1EventsPost(eventsRequest, requestInit).catch((err) => {
      console.error(err)
    })
  }

  private flushLater(): void {
    if (this.config === undefined || this.timer !== undefined) {
      return
    }
    this.timer = window.setTimeout(
      () => { this.flushEvents() },
      this.config.flushPeriod
    )
  }

  private queueEvent(event: ApiEvent): void {
    this.eventQueue.push(event)
    this.flushLater()
  }

  queueContentLoadedV1Event(timestamp: number, contentId: string, variant: string): void {
    if (this.config === undefined) {
      return
    }
    const event: ContentLoadedV1 = {
      courseId: this.config.courseId,
      impressionId: this.config.impressionId,
      sourceUri: window.location.toString(),
      timestamp,
      eventname: 'content_loaded_v1',
      contentId,
      variant
    }
    this.queueEvent(event)
  }

  queueContentLoadFailedV1Event(timestamp: number, contentId: string, error?: string): void {
    if (this.config === undefined) {
      return
    }
    const event: ContentLoadFailedV1 = {
      courseId: this.config.courseId,
      impressionId: this.config.impressionId,
      sourceUri: window.location.toString(),
      timestamp,
      eventname: 'content_load_failed_v1',
      contentId,
      error
    }
    this.queueEvent(event)
  }
}