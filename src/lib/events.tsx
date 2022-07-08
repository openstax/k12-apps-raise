import { ENV } from '../lib/env'

const LOCAL_USER_ID_FUNCTION_HANDLER = 'local_fe_events_direct_user_id_handler'
const LOCAL_FE_EVENTS_MOODLE_FUNCTION_HANDLER = 'local_fe_events_moodle_content_loaded_handler'
const LOCAL_FE_EVENTS_DIRECT_FUNCTION_HANDLER = 'local_fe_events_direct_content_loaded_handler'

const PIPELINE_MOODLE_EVENTS = 'moodle_eventing'
const PIPELINE_MOODLE_DIRECT = 'moodle_direct'
const PIPELINE_FE_DIRECT = 'fe_direct'

function getMoodlePluginMethodUrl(endpointMethod: string): string {
  if (window.M === undefined) {
    console.log('moodle variables not found')
    return ''
  }
  let userUrl: string
  userUrl = String(window.M.cfg.wwwroot)
  userUrl += '/lib/ajax/service.php?sesskey='
  userUrl += String(window.M.cfg.sesskey)
  userUrl += '&info=' + endpointMethod
  return userUrl
}

async function sendEventMoodlePlugin(pipelineId: string): Promise<void> {
  const contentId = 'moodle_test_content_via_moodle_direct'
  let endpoint, url
  if (pipelineId === PIPELINE_MOODLE_DIRECT) {
    endpoint = LOCAL_FE_EVENTS_DIRECT_FUNCTION_HANDLER
    url = getMoodlePluginMethodUrl(endpoint)
  } else {
    endpoint = LOCAL_FE_EVENTS_MOODLE_FUNCTION_HANDLER
    url = getMoodlePluginMethodUrl(LOCAL_FE_EVENTS_MOODLE_FUNCTION_HANDLER)
  }

  const request = {
    index: 0,
    methodname: endpoint,
    args: {
      contentId: contentId
    }
  }

  const response = await fetch(url, { method: 'POST', body: JSON.stringify([request]) })
  if (response.ok) {
    const responseJson = await response.json()
    console.log(responseJson)
    if (responseJson.error === undefined) {
      console.log('response success')
    } else {
      console.log('response ERROR: ' + String(responseJson))
    }
  }
}

async function sendEventFeDirect(): Promise<void> {
  const contentId = 'moodle_test_content_direct_from_fe'
  const endpoint = LOCAL_USER_ID_FUNCTION_HANDLER
  const date = new Date()

  const userRequest = {
    index: 0,
    methodname: endpoint,
    args: {
    }
  }

  const urlUser = getMoodlePluginMethodUrl(LOCAL_USER_ID_FUNCTION_HANDLER)
  const userResponse: Response = await fetch(urlUser, { method: 'POST', body: JSON.stringify([userRequest]) })
  const userID = await userResponse.json()

  const urlEventsAPI = ENV.OS_RAISE_EVENTS_URL_PREFIX + '/events'
  const eventRequest = {
    eventname: 'content_loaded',
    user_id: userID[0].data.userId,
    content_id: contentId,
    timestamp: date.getTime()
  }

  const response = await fetch(urlEventsAPI, {
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(eventRequest)
  })

  console.log('Events Api Response:')
  console.log(response)
}

export const sendEvent = async (pipelineId: string | undefined): Promise<void> => {
  if (pipelineId === PIPELINE_FE_DIRECT) {
    await sendEventFeDirect()
  } else if (pipelineId === PIPELINE_MOODLE_EVENTS || pipelineId === PIPELINE_MOODLE_DIRECT) {
    await sendEventMoodlePlugin(pipelineId)
  }
}
