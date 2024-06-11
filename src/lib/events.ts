import {
  type EventsInner as ApiEvent,
  type ContentLoadedV1,
  type ContentLoadFailedV1,
  type IbPsetProblemAttemptedV1,
  DefaultApi as EventsApi,
  Configuration,
  type ConfigurationParameters,
  type CreateEventsV1EventsPostRequest,
  type IbInputSubmittedV1
} from '../eventsapi'
import { v4 as uuidv4 } from 'uuid'
import {
  MoodleApi,
  type GetUserResponse
} from '../moodleapi'
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

export const queueIbPsetProblemAttemptedV1Event = async (
  timestamp: number,
  contentId: string,
  variant: string,
  problemType: string,
  response: string | string[],
  correct: boolean,
  attempt: number,
  finalAttempt: boolean,
  psetContentId: string,
  psetProblemContentId: string
): Promise<void> => {
  const eventManager = await EventManager.getInstance()
  eventManager.queueIbPsetProblemAttemptedV1Event(
    timestamp, contentId, variant, problemType, response, correct, attempt, finalAttempt, psetContentId, psetProblemContentId
  )
}

export const queueIbInputSubmittedV1Event = async (
  timestamp: number,
  contentId: string,
  variant: string,
  response: string,
  inputContentId: string
): Promise<void> => {
  const eventManager = await EventManager.getInstance()
  eventManager.queueIbInputSumbittedV1Event(
    timestamp, contentId, variant, response, inputContentId
  )
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
  private static getUserPromise: Promise<GetUserResponse>
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
    const eventsEndpointMapper = ENV.OS_RAISE_EVENTSAPI_URL_MAP as Record<string, string | undefined>
    console.log('host', context.location.host)
    const eventsEndpoint = eventsEndpointMapper[context.location.host]

    if (context.courseId === undefined || eventsEndpoint === undefined || window.M === undefined) {
      this.instance = new EventManager()
      return this.instance
    }
    const moodleApi = new MoodleApi(window.M.cfg.wwwroot, window.M.cfg.sesskey)

    // Wait on a new or existing promise for user data from Moodle
    this.getUserPromise = this.getUserPromise ?? moodleApi.getUser()
    const user = await this.getUserPromise

    // Check for an initialized instance again in case there were multiple
    // waiters on the promise
    if (this.instance !== undefined) {
      return this.instance
    }

    const parameters: ConfigurationParameters = {
      accessToken: user.jwt,
      basePath: eventsEndpoint
    }

    const eventsApi = new EventsApi(new Configuration(parameters))

    this.instance = new EventManager({
      eventsApi,
      impressionId: this.impressionId,
      courseId: context.courseId,
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

  queueIbPsetProblemAttemptedV1Event(
    timestamp: number,
    contentId: string,
    variant: string,
    problemType: string,
    response: string | string[],
    correct: boolean,
    attempt: number,
    finalAttempt: boolean,
    psetContentId: string,
    psetProblemContentId: string
  ): void {
    if (this.config === undefined) {
      return
    }
    const event: IbPsetProblemAttemptedV1 = {
      courseId: this.config.courseId,
      impressionId: this.config.impressionId,
      sourceUri: window.location.toString(),
      timestamp,
      eventname: 'ib_pset_problem_attempted_v1',
      contentId,
      variant,
      problemType,
      response,
      correct,
      attempt,
      finalAttempt,
      psetContentId,
      psetProblemContentId
    }
    this.queueEvent(event)
  }

  queueIbInputSumbittedV1Event(
    timestamp: number,
    contentId: string,
    variant: string,
    response: string,
    inputContentId: string
  ): void {
    if (this.config === undefined) {
      return
    }
    const event: IbInputSubmittedV1 = {
      courseId: this.config.courseId,
      impressionId: this.config.impressionId,
      sourceUri: window.location.toString(),
      timestamp,
      eventname: 'ib_input_submitted_v1',
      contentId,
      variant,
      response,
      inputContentId
    }
    this.queueEvent(event)
  }
}
