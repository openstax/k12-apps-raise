interface GetUserResponse {
  uuid: string
  jwt: string
}

export class MoodleApi {
  private readonly wwwroot: string
  private readonly sesskey: string

  constructor(wwwroot: string, sesskey: string) {
    this.wwwroot = wwwroot
    this.sesskey = sesskey
  }

  async getUser(): Promise<GetUserResponse> {
    const methodname = 'local_raise_get_user'
    const userRequest = {
      index: 0,
      methodname: methodname,
      args: {
      }
    }
    const url = this.getMoodleAjaxUrl(methodname)
    const response = await fetch(url, { method: 'POST', body: JSON.stringify([userRequest]) })
    const responseJSON = await response.json()

    if (responseJSON.error !== undefined) {
      console.log('ERROR in response json')
      console.log(responseJSON.error)
      throw new Error(responseJSON.error)
    }

    return {
      uuid: responseJSON[0].data.uuid,
      jwt: responseJSON[0].data.jwt
    }
  }

  getMoodleAjaxUrl(endpointMethod: string): string {
    let userUrl: string
    userUrl = this.wwwroot
    userUrl += '/lib/ajax/service.php?sesskey='
    userUrl += this.sesskey
    userUrl += '&info=' + endpointMethod
    return userUrl
  }
}
