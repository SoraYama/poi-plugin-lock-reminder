import _ from 'lodash'

const { getStore } = window

export const PLUGIN_NAME = 'poi-plugin-ship-lock-reminder'

export const canBePushed = ship => {
  if (_.isEmpty(ship)) {
    return false
  }
  return _.isEmpty(
    _.find(
      getStore('info.ships'),
      ships => ship.api_ship_id === ships.api_ship_id,
    ),
  )
}
