import { getVersionId } from '../lib/utils'
import { vi, test, expect } from 'vitest'
vi.mock('../lib/env.ts', () => ({
  default: {}
}))
vi.mock('../../data/content-versions.json', () => ({
  defaultVersion: 'defaultVersion',
  overrides: {
    testhost: {
      course: {
        1: 'courseOverrideVersion'
      }
    },
    testhost2: {
      prefix: {
        '/edition1/': 'prefixOverrideVersion'
      }
    }
  }
}))

const originalLocation = { ...window.location }

beforeEach(() => {
  delete window.M
  Object.defineProperty(window, 'location', {
    value: {
      host: originalLocation.host,
      pathname: originalLocation.pathname
    },
    writable: true
  })
})

afterEach(() => {
  delete window.M
  Object.defineProperty(window, 'location', {
    value: {
      host: originalLocation.host,
      pathname: originalLocation.pathname
    },
    writable: true
  })
})

test('getVersionId returns default when no course context', async () => {
  expect(getVersionId()).toBe('defaultVersion')
})

test('getVersionId returns default with course context and no override', async () => {
  window.M = {
    cfg: {
      wwwroot: 'http://moodle',
      sesskey: '12345',
      courseId: 1
    }
  }

  expect(getVersionId()).toBe('defaultVersion')
})

test('getVersionId returns override when course configured', async () => {
  window.M = {
    cfg: {
      wwwroot: 'http://moodle',
      sesskey: '12345',
      courseId: 1
    }
  }

  Object.defineProperty(window, 'location', {
    value: {
      host: 'testhost'
    }
  })
  expect(getVersionId()).toBe('courseOverrideVersion')
})

test('getVersionId returns override when prefix configured', async () => {
  Object.defineProperty(window, 'location', {
    value: {
      host: 'testhost2',
      pathname: '/edition1/unitslug/pageslug'
    }
  })
  expect(getVersionId()).toBe('prefixOverrideVersion')
})

test('getVersionId returns default when prefix does not match', async () => {
  Object.defineProperty(window, 'location', {
    value: {
      host: 'testhost2',
      pathname: '/edition2/unitslug/pageslug'
    }
  })
  expect(getVersionId()).toBe('defaultVersion')
})
