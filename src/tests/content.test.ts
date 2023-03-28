import { getVersionId } from '../lib/content'

jest.mock('../lib/env.ts', () => {})

jest.mock('../../data/content-versions.json', () => ({
  defaultVersion: 'defaultVersion',
  overrides: {
    testhost: {
      1: 'overrideVersion'
    }
  }
}))

test('getVersionId returns default when no context', async () => {
  expect(getVersionId()).toBe('defaultVersion')
})

test('getVersionId returns default with context and no override', async () => {
  window.M = {
    cfg: {
      wwwroot: 'http://moodle',
      sesskey: '12345',
      courseId: 1
    }
  }

  expect(getVersionId()).toBe('defaultVersion')
})

test('getVersionId returns override when configured', async () => {
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
  expect(getVersionId()).toBe('overrideVersion')
})
