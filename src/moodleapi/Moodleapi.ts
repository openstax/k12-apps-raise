export class Moodleapi {
    endpoint = 'local_raise_get_user'
    // pass in host and session key. 
    constructor( sessionKey?: string){
        if (sessionKey){

        }
    }

    async getUser(){
        const userRequest = {
            index: 0,
            methodname: this.endpoint,
            args: {
            }
          }
        const url = this.getMoodlePluginMethodUrl(this.endpoint)

        let response = await fetch(url, {method: 'POST', body: JSON.stringify([userRequest])})

        const userID = await response.json()
        return userID[0].data['uuid']
    }

    getMoodlePluginMethodUrl(endpointMethod: string): string {
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
      }}
