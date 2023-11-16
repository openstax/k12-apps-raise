export interface GetUserResponse {
  uuid: string
  jwt: string
}
export type PersistorGetResponse = Array<{ dataKey: string, dataValue: string }>

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
      throw new Error(responseJSON.error)
    }

    return {
      uuid: responseJSON[0].data.uuid,
      jwt: responseJSON[0].data.jwt
    }
  }

  private getMoodleAjaxUrl(endpointMethod: string): string {
    let userUrl: string
    userUrl = this.wwwroot
    userUrl += '/lib/ajax/service.php?sesskey='
    userUrl += this.sesskey
    userUrl += '&info=' + endpointMethod
    return userUrl
  }

  async putData(courseId: number, dataKey: string, dataValue: string, prefetchKey?: string): Promise<void> {
    const methodName = 'local_persist_put'

    const userRequest = {
      index: 0,
      methodname: methodName,
      args: {
        courseId,
        dataKey,
        dataValue,
        prefetchKey
      }
    }
    const url = this.getMoodleAjaxUrl(methodName)
    const response = await fetch(url, { method: 'POST', body: JSON.stringify([userRequest]) })
    const responseJSON = await response.json()
    if (responseJSON.error !== undefined) {
      throw new Error(responseJSON.error)
    }
  }

  async getData(courseId: number, dataKey: string, prefetchKey?: string): Promise<PersistorGetResponse> {
    const methodName = 'local_persist_get'
    const userRequest = {
      index: 0,
      methodname: methodName,
      args: {
        courseId,
        prefetchKey,
        dataKey
      }
    }
    const url = this.getMoodleAjaxUrl(methodName)
    const response = await fetch(url, { method: 'POST', body: JSON.stringify([userRequest]) })
    const responseJSON = await response.json()
    if (responseJSON.error !== undefined) {
      throw new Error(responseJSON.error)
    }

    const data: PersistorGetResponse = responseJSON[0].data
    return data
  }
}
