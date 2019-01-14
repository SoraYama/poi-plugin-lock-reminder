import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'
import { PLUGIN_NAME } from '../utils'
import RadioCheck from './radio-config'
// import styled from 'styled-components'

@withNamespaces(PLUGIN_NAME)
class SettingsClass extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  render() {
    const { t } = this.props
    return (
      <div>
        <RadioCheck
          label={t('Notify mode')}
          configName={`plugin.${PLUGIN_NAME}.mode`}
          default="custom"
          options={[
            {
              label: t('Custom mode'),
              value: 'custom',
            },
            {
              label: t('Picture mode'),
              value: 'picture',
            },
          ]}
        />
      </div>
    )
  }
}

export default SettingsClass
