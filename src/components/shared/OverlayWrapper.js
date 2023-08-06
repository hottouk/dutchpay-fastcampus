import React, { Children } from 'react'
import { styled } from 'styled-components'

const OverlayWrapper = ({ children, padding, minHeight }) => {
  return (
    <StyledContainer padding = {padding} minHeight={minHeight}>
      {children}
    </StyledContainer>
  )
}

const StyledContainer = styled.div`
  background-color: white;
  border-radius: 20px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  min-height: ${(props) => { return props.minHeight || 0 }};
  padding: ${(props) => { return props.padding||'3vw'}};
`
export default OverlayWrapper