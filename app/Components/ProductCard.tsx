'use client'
import styled from 'styled-components'
import Image from 'next/image'

import { white } from '../util/styles'
import { useEffect, useState } from 'react'

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

const ImageWrapper = styled.div`
  border-radius: 5px;
  overflow: hidden;
  width: 100px;
  height: 100px;
  border: 2px solid #555;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: 10px;
`


const Description = styled.div`
  text-align: left;
`

const DescriptionItemGrid = styled.div`
  display: grid;
  grid-template-columns: 70% 30%;
  gap: 10px;
  padding-left: 10px;
`

const DescriptionItem = styled.div`
  font-size: 0.8em;
  padding: 10px 0;
  font-weight: bold;
`
type Props = {
  name: string;
  quantity: number;
  unitPrice: number;
}

export default function ProductCard({name, quantity, unitPrice}: Props) {

  const [imageNum, setImageNum] = useState(0);

  useEffect(() => {
    setImageNum(Math.floor(Math.random()*7));
  }, []);

  const imageLocation = `/assets/product-img-${imageNum}.jpeg`
  return (
    // <Hoverable>
      <Wrapper className = "hoverable">
        {/* <NonHoverable> */}
          <Title>{name}</Title>
          <Grid>
            <ImageWrapper>
              <Image
                src = {imageLocation}
                width = {100}
                height = {100}
                alt= "product image"
              />
            </ImageWrapper>
            <Description>
              <DescriptionItemGrid>
                <DescriptionItem>Available Quantity:</DescriptionItem>
                <DescriptionItem>{quantity}</DescriptionItem>
              </DescriptionItemGrid>
              <DescriptionItemGrid>
                <DescriptionItem>Price: </DescriptionItem>
                <DescriptionItem>${unitPrice}</DescriptionItem>
              </DescriptionItemGrid>
            </Description>
          </Grid>
        {/* </NonHoverable> */}
      </Wrapper>
    // </Hoverable>

  )
}
