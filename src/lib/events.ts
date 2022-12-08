
import { EventsInner, ContentLoadedV1, ContentLoadFailedV1, DefaultApi, Configuration, ConfigurationParameters, CreateEventsV1EventsPostRequest, DetailMessage } from '../eventsapi'
import { v4 as uuidv4 } from 'uuid'
import { MoodleApi } from '../moodleapi'

const ENV_STAGING = 'staging.raiselearing.org'
const ENV_PRODUCTION = 'raiselearning.org'
const ENV_LOCAL = 'localhost:8000'
const API_ENDPOINT_PROD = 'https://k12.openstax.org/contents/raise'
const API_ENDPOINT_LOCAL = 'http://localhost:8888'
const EVENT_FLUSH_PERIOD = 30000
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
      const response = this.flushEvents()
    }, EVENT_FLUSH_PERIOD)

    document.onvisibilitychange = () => {
      if (document.visibilityState === 'hidden') {
        const response = this.flushEvents()
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

  async flushEvents(): Promise<DetailMessage> {
    console.log('FLUSH')
    let ret: DetailMessage
    if (EventManager.eventApi === undefined || EventManager.moodleApi === undefined) {
      console.log('Events API Not Instantiated')
      ret = { detail: 'EVENTS API NOT INSTANTIATED' }
    } else if (this.eventQueue.length === 0) {
      console.log('NO EVENTS')
      ret = { detail: 'NO EVENTS QUEUED' }
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
      const response = this.flushEvents()
    }, EVENT_FLUSH_PERIOD)
    return ret
  }
}
