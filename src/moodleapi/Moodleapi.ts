interface Response {
  uuid: string
  jwt: string
}
export class Moodleapi {
  endpoint = 'local_raise_get_user'

  async getUser(): Promise<Response> {
    const userRequest = {
      index: 0,
      methodname: this.endpoint,
      args: {
      }
    }
    const url = this.getMoodlePluginMethodUrl(this.endpoint)
    if (url === '') {
      console.log('Invalid environment variables')
    }
    const response = await fetch(url, { method: 'POST', body: JSON.stringify([userRequest]) })
    const responseJSON = await response.json()

    return {
      uuid: responseJSON[0].data.uuid,
      jwt: responseJSON[0].data.jwt
    }
  }

  getMoodlePluginMethodUrl(endpointMethod: string): string {
    if (window.M === undefined) {
      return ''
    }
    let userUrl: string
    userUrl = String(window.M.cfg.wwwroot)
    userUrl += '/lib/ajax/service.php?sesskey='
    userUrl += String(window.M.cfg.sesskey)
    userUrl += '&info=' + endpointMethod
    return userUrl
  }
}
