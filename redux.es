import { combineReducers } from 'redux'
// import { keyBy, get, map } from 'lodash'
import { get, map, uniq, flatMap, compact } from 'lodash'
import { shipRemodelInfoSelector } from 'subtender/poi/selectors'

import { PLUGIN_NAME, logger } from './utils'

const LS_PATH = '_lock-reminder'

const { getStore } = window

const { originMstIdOf } = shipRemodelInfoSelector(getStore())

// const indexify = data =>
//   keyBy(data, s => get(s, 'api_table_id.0', '1'))

export const getCache = () => {
  const item = window.isSafeMode ? '{}' : localStorage.getItem(LS_PATH)
  return JSON.parse(item || '{}')
}

const picture = (state = getCache(), action) => {
  const { type, payload = {} } = action
  const { list = {}, timestamp } = payload
  switch (type) {
    case `@@${PLUGIN_NAME}@record@pictureBook`: {
      const newState = compact(
        uniq(map(flatMap(list), s => originMstIdOf[get(s, 'api_table_id.0')])),
      )
      logger.log('newstate, payload, mapped', newState, payload, map(list))
      return {
        list: newState,
        timestamp,
      }
    }
    default:
      return state
  }
}

export const recordPictureData = (data, page) => {
  const origin = getCache()
  logger.log('recordPicData:', data, page)
  const payload = {
    list: {
      ...get(origin, 'list', {}),
      [page]: get(data, 'api_list', null),
    },
    timestamp: {
      ...get(origin, 'timestamp', {}),
      [page]: Date.now(),
    },
  }
  window.dispatch({
    type: `@@${PLUGIN_NAME}@record@pictureBook`,
    payload,
  })
  localStorage.setItem(LS_PATH, JSON.stringify(payload || {}))
}

export const reducer = combineReducers({
  picture,
})
