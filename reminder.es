import _ from 'lodash'
import i18next from 'views/env-parts/i18next'
import { PLUGIN_NAME, canBePushed, logger } from './utils'
import { recordPictureData } from './redux'

const { toast } = window

class Reminder {
  ships = []

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
        this.record()
        break
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

  record = () => {
    const dropShip = _.get(this.currentRes, 'body.api_get_ship', null)
    logger.log('dropShip: ', dropShip)
    if (canBePushed(dropShip)) {
      this.ships.push(dropShip)
      logger.log('ships: ', this.ships)
    }
  }

  reset = () => {
    this.ships = []
    this.currentRes = {}
  }

  handleEnterPictureBook = page => {
    recordPictureData(this.currentRes.body, page)
  }

  publish = () => {
    if (_.isEmpty(this.ships)) {
      logger.log('current ship queue is empty, nothing to do')
      return
    }
    const shipNames = _.map(this.ships, ship => ship.api_ship_name)
    logger.log('shipNames: ', shipNames)
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
    this.reset()
  }
}

export default new Reminder()
