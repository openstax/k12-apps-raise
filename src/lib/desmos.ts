import { loadScriptTag } from './utils'

export const DESMOS_URL = 'https://www.desmos.com/api/v1.7/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6'

export const loadDesmos = async (): Promise<void> => {
  if (window.Desmos === undefined) {
    await loadScriptTag(DESMOS_URL)
  }
}
