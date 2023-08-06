import React from 'react'
import { styled } from 'styled-components'

const ServiceLogo = () => {
  return (
    <div>
      <StyledLogo>Dutch Pay</StyledLogo>
    </div>
  )
}

const StyledLogo = styled.h1`
 font-weight:300;
 letter-spacing:10px;
 color: slateblue;
 text-align:center;
 margin-bottom:0.8em;
`

export default ServiceLogo

