import _ from 'lodash'
import pkg from './package.json'

const { getStore, dbg } = window

export const PLUGIN_NAME = pkg.name

export const logger = dbg.extra(PLUGIN_NAME)

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

export const CONFIG_PATH = `plugin.${PLUGIN_NAME}.selectedShips`
