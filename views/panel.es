import React from 'react'
import PropTypes from 'prop-types'
import { H5, Card, Collapse, Icon } from '@blueprintjs/core'
import styled from 'styled-components'
import { map } from 'lodash'
import Kanmusu from './kanmusu'

const PanelWrapper = styled.div`
  margin-bottom: 10px;
`

const ShipWrapper = styled(Card)`
  display: flex;
  flex-wrap: wrap;
`

const Header = styled(H5)`
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: space-between;
  padding-bottom: 5px;
  border-bottom: 1px dashed gray;

  .bp3-icon {
    cursor: pointer;
  }
`

class Panel extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    ships: PropTypes.array,
  }

  state = {
    isOpen: false,
  }

  render() {
    const { ships, title } = this.props
    const { isOpen } = this.state

    return (
      <PanelWrapper>
        <Header onClick={() => this.setState({ isOpen: !isOpen })}>
          {`${title}（${ships.length}）`}
          <Icon icon={`chevron-${isOpen ? 'up' : 'down'}`} />
        </Header>
        <Collapse isOpen={isOpen} keepChildrenMounted>
          <ShipWrapper>
            {map(ships, shipProps => (
              <Kanmusu {...shipProps} />
            ))}
          </ShipWrapper>
        </Collapse>
      </PanelWrapper>
    )
  }
}

export default Panel
