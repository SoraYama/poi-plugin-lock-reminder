import React from 'react'
import PropTypes from 'prop-types'
import { includes, pull } from 'lodash'
import { Avatar } from 'views/components/etc/avatar'
import styled from 'styled-components'
import { Checkbox } from '@blueprintjs/core'
import { CONFIG_PATH } from '../utils'

const KanmusuWrapper = styled.div`
  width: 115px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;

  label {
    margin: 0 !important;
  }
`

const Name = styled.span`
  max-width: 60px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Kanmusu = ({ id, name, checked }) => {
  const handleChange = () => {
    const rst = [...config.get(CONFIG_PATH, [])]
    if (includes(rst, id)) {
      pull(rst, id)
    } else {
      rst.push(id)
    }
    config.set(CONFIG_PATH, rst)
  }

  return (
    <KanmusuWrapper>
      <Avatar mstId={id} height={20} />
      <Name>{name}</Name>
      <Checkbox checked={checked} onChange={handleChange} />
    </KanmusuWrapper>
  )
}

Kanmusu.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  checked: PropTypes.bool,
}

export default Kanmusu
