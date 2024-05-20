export interface GetUserResponse {
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
    const methodName = 'local_raise_get_user'
    const userRequest = {
      index: 0,
      methodname: methodName,
      args: {
      }
    }
    const url = this.getMoodleAjaxUrl(methodName)
    const response = await fetch(url, { method: 'POST', body: JSON.stringify([userRequest]) })
    const responseJSON = await response.json()
    if (responseJSON.error !== undefined) {
      throw new Error(responseJSON.error as string)
    }

    return {
      uuid: responseJSON[0].data.uuid,
      jwt: responseJSON[0].data.jwt
    }
  }

  async getUserRoles(courseId: number): Promise<string[]> {
    const methodName = 'local_raise_get_user_roles'
    const userRequest = {
      index: 0,
      methodname: methodName,
      args: {
        courseid: courseId
      }
    }
    const url = this.getMoodleAjaxUrl(methodName)
    const response = await fetch(url, { method: 'POST', body: JSON.stringify([userRequest]) })
    const responseJSON = await response.json()
    if (responseJSON.error !== undefined) {
      throw new Error(responseJSON.error as string)
    }

    return responseJSON[0].data
  }

  private getMoodleAjaxUrl(endpointMethod: string): string {
    let userUrl: string
    userUrl = this.wwwroot
    userUrl += '/lib/ajax/service.php?sesskey='
    userUrl += this.sesskey
    userUrl += '&info=' + endpointMethod
    return userUrl
  }
}
