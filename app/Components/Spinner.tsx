import styled, { keyframes } from 'styled-components'

const SpinnerAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const SpinnerWrapper = styled.div`
  display: inline-block;
  width: 50px;
  height: 50px;
  &::after {
    content: " ";
    box-sizing: border-box;
    display: block;
    width: 40px;
    height: 40px;
    margin: 1px;
    border-radius: 50%;
    border: 6px solid #fff;  // Here, the border color is changed to white.
    border-color: #fff transparent #fff transparent;  // Here, the border color is changed to white.
    animation: ${SpinnerAnimation} 1.2s linear infinite;
  }
`

const Spinner = () => <SpinnerWrapper />
export default Spinner
