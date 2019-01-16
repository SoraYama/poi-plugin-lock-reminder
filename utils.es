import _ from 'lodash'
import pkg from './package.json'
import {
  selectedShipsSelector,
  customModeShouldNotifiedSelector,
  pictureModeShouldNotifiedSelector,
} from './views/selectors'

const { getStore, dbg } = window

export const PLUGIN_NAME = pkg.name

export const logger = dbg.extra(PLUGIN_NAME)

export const canBePushed = ship => {
  if (_.isEmpty(ship)) {
    return false
  }
  const mode = getStore(`config.plugin.${PLUGIN_NAME}.mode`)
  const category = getStore(`config.plugin.${PLUGIN_NAME}.customNotifyCategory`)
  const customModeSelectedShips = selectedShipsSelector(getStore())
  const customModeUnownedShips = customModeShouldNotifiedSelector(getStore())
  const pictureModeShouldNotifiedShips = pictureModeShouldNotifiedSelector(
    getStore(),
  )
  logger.log('customModeShouldNotifiedShips', customModeUnownedShips)
  logger.log('pictureModeShouldNotifiedShips', pictureModeShouldNotifiedShips)
  const shipIsIn = group =>
    !!_.find(group, s => +s.api_id === +ship.api_ship_id)

  if (mode === 'custom') {
    return category === 'willnot'
      ? shipIsIn(customModeUnownedShips)
      : shipIsIn(customModeSelectedShips)
  }
  return shipIsIn(pictureModeShouldNotifiedShips)
}

export const CONFIG_PATH = `plugin.${PLUGIN_NAME}.selectedShips`
