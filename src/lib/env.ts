export const ENV = {
  OS_RAISE_CONTENT_URL_PREFIX: import.meta.env.PROD ? 'https://k12.openstax.org/contents/raise' : 'http://localhost:8800/contents'
}

Object.freeze(ENV)
