import _ from 'lodash'
import {
  shipsSelector,
  shipRemodelInfoSelector,
  constSelector,
  configSelector,
} from 'views/utils/selectors'
import { createSelector } from 'reselect'

import { CONFIG_PATH } from '../utils'

export const unownedShipsSelector = createSelector(
  shipsSelector,
  constSelector,
  shipRemodelInfoSelector,
  (ships, { $ships }, { remodelChains, originMstIdOf }) =>
    _.map(
      _.filter(
        _.keys(remodelChains),
        id => !_.find(ships, s => id === originMstIdOf[String(s.api_ship_id)]),
      ),
      id => $ships[id],
    ),
)

export const selectedShipsSelector = createSelector(
  configSelector,
  config => _.get(config, CONFIG_PATH, []),
)
