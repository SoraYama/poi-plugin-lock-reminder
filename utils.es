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

export const canBePushed = shipId => {
  logger.log('shipId', shipId)
  if (!shipId) {
    return false
  }
  const mode = getStore(`config.plugin.${PLUGIN_NAME}.mode`) || 'custom'
  const category =
    getStore(`config.plugin.${PLUGIN_NAME}.customNotifyCategory`) || 'willnot'
  const customModeSelectedShips = selectedShipsSelector(getStore())
  const customModeUnownedShips = customModeShouldNotifiedSelector(getStore())
  const pictureModeShouldNotifiedShips = pictureModeShouldNotifiedSelector(
    getStore(),
  )
  logger.log('customModeSelectedShips', customModeSelectedShips)
  logger.log('customModeShouldNotifiedShips', customModeUnownedShips)
  logger.log('pictureModeShouldNotifiedShips', pictureModeShouldNotifiedShips)
  const shipIsIn = group => _.some(group, s => +s.api_id === +shipId)

  if (mode === 'custom') {
    logger.log('custom mode, category ', category)
    return category === 'willnot'
      ? shipIsIn(customModeUnownedShips)
      : shipIsIn(customModeSelectedShips)
  }
  return shipIsIn(pictureModeShouldNotifiedShips)
}

export const CONFIG_PATH = `plugin.${PLUGIN_NAME}.selectedShips`
