import _ from 'lodash'
import {
  shipsSelector,
  constSelector,
  configSelector,
  extensionSelectorFactory,
} from 'views/utils/selectors'
import { shipRemodelInfoSelector } from 'subtender/poi/selectors'
import { createSelector } from 'reselect'

import { CONFIG_PATH, PLUGIN_NAME } from '../utils'

export const unownedShipsSelector = createSelector(
  shipsSelector,
  constSelector,
  shipRemodelInfoSelector,
  (ships, { $ships }, { remodelChains, originMstIdOf }) =>
    _.map(
      _.filter(
        _.keys(remodelChains),
        id =>
          !_.find(ships, s => +id === +originMstIdOf[String(s.api_ship_id)]),
      ),
      id => $ships[id],
    ),
)

export const originShipsSelector = createSelector(
  constSelector,
  shipRemodelInfoSelector,
  ({ $ships }, { remodelChains }) =>
    _.map(_.keys(remodelChains), k => _.find($ships, s => +s.api_id === +k)),
)

export const pictureUnownedShipsSelector = createSelector(
  [extensionSelectorFactory(PLUGIN_NAME), unownedShipsSelector],
  ({ picture: pictureOwnedShipIds }, uShips) => {
    if (_.isEmpty(pictureOwnedShipIds)) {
      return uShips
    }
    return _.filter(
      uShips,
      us => _.indexOf(_.map(pictureOwnedShipIds, id => +id), +us.api_id) === -1,
    )
  },
)

export const selectedShipIdsSelector = createSelector(
  configSelector,
  config => _.get(config, CONFIG_PATH, []),
)

export const selectedShipsSelector = createSelector(
  selectedShipIdsSelector,
  constSelector,
  (ids, { $ships }) => _.map(ids, id => _.find($ships, s => +s.api_id === +id)),
)

export const customModeShouldNotifiedSelector = createSelector(
  [unownedShipsSelector, selectedShipIdsSelector],
  (uShips, sShipIds) =>
    _.filter(uShips, ship => _.indexOf(sShipIds, +ship.api_id) === -1),
)

export const pictureModeShouldNotifiedSelector = createSelector(
  pictureUnownedShipsSelector,
  ships => ships,
)
