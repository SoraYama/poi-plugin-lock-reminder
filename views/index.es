import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import { map, groupBy, get, find, every, isEmpty } from 'lodash'
import styled from 'styled-components'
import { H4, Callout, Button, Collapse, NonIdealState } from '@blueprintjs/core'
import { withNamespaces } from 'react-i18next'
import { extensionSelectorFactory } from 'views/utils/selectors'

import { unownedShipsSelector, selectedShipIdsSelector } from './selectors'
import Panel from './panel'
import { PLUGIN_NAME, logger } from '../utils'

const ReminderWrapper = styled.div`
  padding: 10px;

  h4 {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

const Tip = styled(Callout)`
  margin-bottom: 10px;
`

const Expand = styled(Button)`
  display: inline;
`

@withNamespaces(PLUGIN_NAME)
@connect(state => ({
  selectedShips: selectedShipIdsSelector(state),
  unownedShips: unownedShipsSelector(state),
  $shipTypes: get(state, 'const.$shipTypes'),
  picture: get(extensionSelectorFactory(PLUGIN_NAME)(state), 'picture', {}),
  mode: get(state, `config.plugin.${PLUGIN_NAME}.mode`, 'custom'),
}))
class ShipReminder extends React.PureComponent {
  static propTypes = {
    unownedShips: PropTypes.array,
    selectedShips: PropTypes.array,
    t: PropTypes.func.isRequired,
    $shipTypes: PropTypes.object,
    picture: PropTypes.object,
    mode: PropTypes.string,
  }

  state = {
    isOpen: false,
  }

  render() {
    const {
      selectedShips,
      unownedShips,
      $shipTypes,
      t,
      picture,
      mode,
    } = this.props
    const { isOpen } = this.state
    const isInitialed = !every(unownedShips, s => isEmpty(s))
    logger.log('unownedShips: \n', unownedShips)
    return isInitialed ? (
      <ReminderWrapper>
        <H4>{t('Picture info')}</H4>
        <Tip minimal intent="primary">
          {isEmpty(picture.list)
            ? t('Please check picture first')
            : t('updateTimestamp', {
                timestamp: map(
                  picture.timestamp,
                  (ts, page) =>
                    `${page}: ${moment(ts).format('YYYY/MM/DD HH:mm:ss')}`,
                ).join('\n'),
              })}
        </Tip>
        <H4>
          {t('Unowned ships')}
          <Expand
            text={t('Expand')}
            intent="primary"
            disabled={mode !== 'custom'}
            onClick={() => this.setState({ isOpen: !isOpen })}
          />
        </H4>
        {mode !== 'custom' ? <Tip>{t('customTipWhenModeIsPicture')}</Tip> : ''}
        <Collapse isOpen={isOpen} keepChildrenMounted>
          <Tip minimal intent="primary">
            {t('Will not notify checked ships')}
          </Tip>
          {map(groupBy(unownedShips, s => s.api_stype), (ships, type) => {
            const panelShipsProp = map(ships, s => ({
              name: s.api_name,
              id: s.api_id,
              checked: !!find(selectedShips, ss => s.api_id === ss),
            }))
            return (
              <Panel title={$shipTypes[type].api_name} ships={panelShipsProp} />
            )
          })}
        </Collapse>
      </ReminderWrapper>
    ) : (
      <NonIdealState
        icon="application"
        title={t('No game data')}
        description={t('NonIdealDesc')}
      />
    )
  }
}

export default ShipReminder
