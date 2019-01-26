import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { connect } from 'react-redux'
import { map, groupBy, get, find, isEmpty, flatMap, compact } from 'lodash'
import styled from 'styled-components'
import {
  H4,
  H5,
  Callout,
  Button,
  Collapse,
  NonIdealState,
  Tooltip,
  Icon,
  Intent,
} from '@blueprintjs/core'
import { withNamespaces } from 'react-i18next'
import { extensionSelectorFactory } from 'views/utils/selectors'

import {
  unownedShipsSelector,
  selectedShipIdsSelector,
  originShipsSelector,
} from './selectors'
import Panel from './panel'
import { PLUGIN_NAME, logger } from '../utils'
import RadioCheck from '../settings-class/radio-config'

const ReminderWrapper = styled.div`
  padding: 10px;

  h4 {
    display: flex;
    align-items: center;

    .bp3-popover-wrapper {
      margin-left: 5px;

      .bp3-popover-target {
        display: flex;
      }
    }
  }
`

const Tip = styled(Callout)`
  margin-bottom: 10px;
`

const PictureTipWrapper = styled(Tip)`
  display: ${props => (props.disabled ? 'none' : '')};
`

const Expand = styled(Button)`
  display: inline;
  margin-left: 15px;
`

const PictureStatusTable = styled.table`
  width: 100%;

  td {
    border: 1px solid #a7b6c2;
    text-align: center;
    vertical-align: middle;
  }
`

@withNamespaces(PLUGIN_NAME)
@connect(state => ({
  selectedShips: selectedShipIdsSelector(state),
  unownedShips: unownedShipsSelector(state),
  originShips: originShipsSelector(state),
  $shipTypes: get(state, 'const.$shipTypes'),
  picture: get(extensionSelectorFactory(PLUGIN_NAME)(state), 'picture', {}),
  mode: get(state, `config.plugin.${PLUGIN_NAME}.mode`, 'custom'),
  category: get(
    state,
    `config.plugin.${PLUGIN_NAME}.customNotifyCategory`,
    'willnot',
  ),
}))
class ShipReminder extends React.PureComponent {
  static propTypes = {
    unownedShips: PropTypes.array,
    selectedShips: PropTypes.array,
    originShips: PropTypes.array,
    t: PropTypes.func.isRequired,
    $shipTypes: PropTypes.object,
    picture: PropTypes.object,
    mode: PropTypes.string,
    category: PropTypes.string,
  }

  state = {
    customIsOpen: true,
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.mode === 'custom') {
      this.setState({ customIsOpen: true })
    }
  }

  render() {
    const {
      selectedShips,
      unownedShips,
      originShips,
      $shipTypes,
      t,
      picture,
      mode,
      category,
    } = this.props
    const { customIsOpen } = this.state
    const isInitiallized = !isEmpty(originShips)
    const pageOptions = Array(6)
      .fill()
      .map((_, idx) => idx + 1)
    logger.log('unownedShips: \n', unownedShips)
    logger.log('isInitiallized', isInitiallized)
    if (mode === 'picture') {
      this.setState({ customIsOpen: false })
    }
    return isInitiallized ? (
      <ReminderWrapper>
        <H4>
          {t('Custom mode')}
          <Tooltip
            content={t('Will not notify checked ships')}
            intent={Intent.PRIMARY}
          >
            <Icon icon="info-sign" />
          </Tooltip>
          <Expand
            text={t(customIsOpen ? 'Collapse' : 'Expand')}
            intent="primary"
            minimal
            disabled={mode !== 'custom'}
            onClick={() => this.setState({ customIsOpen: !customIsOpen })}
          />
        </H4>
        {mode !== 'custom' ? <Tip>{t('customTipWhenModeIsPicture')}</Tip> : ''}
        <Collapse isOpen={customIsOpen} keepChildrenMounted>
          <RadioCheck
            label={t('Selected ships will')}
            configName={`plugin.${PLUGIN_NAME}.customNotifyCategory`}
            default="willnot"
            options={[
              {
                label: t('will not be notified'),
                value: 'willnot',
              },
              {
                label: t('will be notified'),
                value: 'will',
              },
            ]}
          />
          {isEmpty(unownedShips) && category === 'willnot' ? (
            <Tip intent={Intent.SUCCESS}>{t('No unowned ship')}</Tip>
          ) : (
            <>
              <H5>
                {t(category === 'willnot' ? 'Unowned ships' : 'All ships')}（
                {category === 'willnot'
                  ? unownedShips.length
                  : originShips.length}
                ）
              </H5>
              {map(
                groupBy(
                  category === 'willnot' ? unownedShips : originShips,
                  s => s.api_stype,
                ),
                (ships, type) => {
                  const panelShipsProp = map(ships, s => ({
                    name: s.api_name,
                    id: s.api_id,
                    checked: !!find(selectedShips, ss => s.api_id === ss),
                  }))
                  return (
                    <Panel
                      title={$shipTypes[type].api_name}
                      ships={panelShipsProp}
                    />
                  )
                },
              )}
            </>
          )}
        </Collapse>
        <H4>
          {t('Picture mode')}
          <Tooltip content={t('pictureIntroduce')} intent={Intent.PRIMARY}>
            <Icon icon="info-sign" />
          </Tooltip>
        </H4>
        {mode !== 'picture' ? <Tip>{t('pictureTipWhenModeIsCustom')}</Tip> : ''}
        <PictureTipWrapper disabled={mode !== 'picture'}>
          {isEmpty(picture.list) ? (
            t('enterPicture')
          ) : (
            <>
              {t('Updated info')}
              <PictureStatusTable>
                <thead>
                  <tr>
                    {map(pageOptions, op => (
                      <td key={`key-${op}`}>{t('page', { page: op })}</td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {map(pageOptions, op => (
                      <td
                        key={`key-${op}`}
                        style={{
                          background: picture.timestamp[op]
                            ? '#15b37150'
                            : '#f5565650',
                        }}
                      >
                        {picture.timestamp[op] ? (
                          <Tooltip
                            content={moment(picture.timestamp[op]).format(
                              'YYYY/MM/DD HH:mm:ss',
                            )}
                          >
                            <Icon icon="tick" />
                          </Tooltip>
                        ) : (
                          <Icon icon="cross" />
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </PictureStatusTable>
              {t('shipRecorded', {
                ships: compact(flatMap(picture.list)).length || '-',
              })}
            </>
          )}
        </PictureTipWrapper>
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
