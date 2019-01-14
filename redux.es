import { combineReducers } from 'redux'
import { compareUpdate } from 'views/utils/tools'
import { keyBy, get } from 'lodash'

import { PLUGIN_NAME, logger } from './utils'

const LS_PATH = '_lock-reminder'

const indexify = data => keyBy(data, 'api_table_id')

export const CACHE = (() => {
  const item = window.isSafeMode ? '{}' : localStorage.getItem(LS_PATH)
  return JSON.parse(item || '{}')
})()

const picture = (state = CACHE, action) => {
  const { type, payload = {} } = action
  const { list = {}, timestamp } = payload
  switch (type) {
    case `@@${PLUGIN_NAME}@record@pictureBook`: {
      const newState = indexify(list.api_list)
      return {
        list: compareUpdate(newState, get(state, 'body.api_list', {})),
        timestamp,
      }
    }
    default:
      return state
  }
}

export const recordPictureData = list => {
  logger.log('recordPicData:', list)
  const payload = {
    list,
    timestamp: Date.now(),
  }
  window.dispatch({
    type: `@@${PLUGIN_NAME}@record@pictureBook`,
    payload,
  })
  process.nextTick(() => {
    localStorage.setItem(LS_PATH, JSON.stringify(payload || {}))
  })
}

export const reducer = combineReducers({
  picture,
})
