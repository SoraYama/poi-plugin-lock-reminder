import _ from 'lodash'
import i18next from 'views/env-parts/i18next'
import { PLUGIN_NAME, canBePushed, logger } from './utils'
import { recordPictureData } from './redux'

const { toast, getStore } = window

class Reminder {
  shipIds = []

  currentRes = {}

  handler = e => {
    const { path, body, postBody } = e.detail
    logger.log('\npath', path, '\nbody', body)
    this.currentRes = { path, body }

    switch (path) {
      case '/kcsapi/api_req_map/start':
        this.start()
        break
      case '/kcsapi/api_req_sortie/battleresult':
      case '/kcsapi/api_req_combined_battle/battleresult': {
        const dropShipId = _.get(
          this.currentRes,
          'body.api_get_ship.api_ship_id',
          null,
        )
        logger.log('dropShipId: ', dropShipId)
        // 海域攻略報酬 イベント海域突破時のみ存在
        const eventItems = _.get(this.currentRes, 'body.api_get_eventitem', [])
        const eventRewardShipIds = []
        _.each(eventItems, item => {
          // 報酬種別 1=アイテム, 2=艦娘, 3=装備, 5=家具
          if (+item.type === 2) {
            eventRewardShipIds.push(item.api_id)
          }
        })
        this.checkPush(dropShipId, ...eventRewardShipIds)
        break
      }
      case '/kcsapi/api_req_quest/clearitemget': {
        const bonus = _.get(this.currentRes, 'body.api_bounus', [])
        logger.log('quest clear bonus: ', bonus)
        const bonusShipIds = _.map(
          // 11=艦船
          _.filter(bonus, i => +i.api_type === 11),
          ship => _.get(ship, 'api_item.api_ship_id', null),
        )
        this.checkPush(...bonusShipIds)
        break
      }
      case '/kcsapi/api_get_member/picture_book': {
        if (_.get(postBody, 'api_type') === '1') {
          this.handleEnterPictureBook(_.get(postBody, 'api_no', '1'))
        }
        break
      }
      case '/kcsapi/api_port/port':
        this.publish()
        break
      default:
        logger.log('default, path: ', path)
        break
    }
  }

  start = () => {
    this.reset()
  }

  checkPush = (...ids) => {
    logger.log('checkPush ids: ', ids)
    _.each(ids, id => {
      logger.log('id, canBePushed', id, canBePushed(id))
      if (canBePushed(id)) {
        this.shipIds.push(id)
      }
    })
  }

  reset = () => {
    this.shipIds = []
    this.currentRes = {}
  }

  handleEnterPictureBook = page => {
    recordPictureData(this.currentRes.body, page)
  }

  publish = () => {
    if (_.isEmpty(this.shipIds)) {
      logger.log('current ship queue is empty, nothing to do')
      return
    }
    const shipNames = _.map(
      this.shipIds,
      id => getStore(`const.$ships.${id}.api_name`) || '',
    )
    logger.log('shipNames: ', shipNames)
    if (!_.isEmpty(_.compact(shipNames))) {
      toast(
        i18next.t(
          `${PLUGIN_NAME}:New KanMusu {{ships}} joined, remember to lock`,
          {
            ships: shipNames.join(', '),
          },
        ),
        {
          intent: 'success',
          icon: 'tick',
          timeout: 0,
        },
      )
    }
    this.reset()
  }
}

export default new Reminder()
