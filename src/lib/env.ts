export const ENV = {
  OS_RAISE_CONTENT_URL_PREFIX: import.meta.env.MODE === 'production' ? 'https://k12.openstax.org/contents/raise' : 'http://localhost:8800/contents',
  OS_RAISE_SEARCHAPI_URL_PREFIX: import.meta.env.MODE === 'development' ? 'http://localhost:9400' : 'https://search.raiselearning.org',
  OS_RAISE_EVENTSAPI_URL_MAP: {},
  EVENT_FLUSH_PERIOD: 60000
}

if (import.meta.env.MODE === 'production') {
  ENV.OS_RAISE_EVENTSAPI_URL_MAP = {
    'raiselearning.org': 'https://events.raiselearning.org',
    'staging.raiselearning.org': 'https://events.staging.raiselearning.org'
  }
} else if (import.meta.env.MODE === 'development') {
  ENV.OS_RAISE_EVENTSAPI_URL_MAP = {
    'localhost:8000': 'http://localhost:8888'
  }
}

Object.freeze(ENV)
