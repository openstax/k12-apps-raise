export const ENV = {
  OS_RAISE_CONTENT_URL_PREFIX: import.meta.env.PROD ? 'https://k12.openstax.org/contents/raise' : 'http://localhost:8800/contents',
  OS_RAISE_EVENTS_URL_PREFIX: 'http://localhost:8888'
}

Object.freeze(ENV)
