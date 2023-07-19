'use client'
import styled from 'styled-components'
import Image from 'next/image'

import { white } from '../util/styles'

const Wrapper = styled.section`
  background-color: ${white};
  width: 100%;
  height: 12em;
  padding: 1em;
  border-radius: 10px;
  color: black;
`

const Title = styled.h2`
  font-size: 1em;
  text-align: center;
  padding-bottom: 1.5em;
`

export default function AddProductCard() {
  return (
  <Wrapper className = "hoverable">
    <Title>Add a New Product</Title>
      <Image
        src = '/assets/add.png'
        width = {100}
        height = {100}
        alt= "product image"
      />
  </Wrapper>
  )
}
