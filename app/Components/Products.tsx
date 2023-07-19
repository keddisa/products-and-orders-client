'use client'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { white } from '../util/styles'
import ProductCard from './ProductCard'
import AddProductCard from './AddProductCard'
import { getAllProducts, getProductById } from '../util/api'
import { Product } from '../types'
import Spinner from './Spinner'


const Wrapper = styled.section`
  padding: 2em;
  width: 100%;
`

const Title = styled.h2`
  font-size: 1.7em;
  text-align: center;
  color: ${white};
  padding-bottom: 2.5em;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20em, 1fr));
  gap: 50px;
`


const GridItem = styled.div`
  text-align: center;
  box-shadow: 0px 0px 15px 2px rgba(0, 0, 0, 0.05);
`

export default function Products() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const getData = async() => {
      const res = await getAllProducts()
      setProducts(res.data.data)
      setLoading(false)
    }

    getData()
  }, [])

  const onProductCardClick = async (id: string) => {
    router.push(`/product/${id}`)
  }

  const renderProducts = () => {
    return products.map(({id, name, quantity, unitPrice}, index) => {
      return <GridItem key={index} onClick = {() => onProductCardClick(id || '')}>
        <ProductCard
          name = {name}
          quantity = {quantity}
          unitPrice = {unitPrice}
          />
        </GridItem>
    })}

  const onProductAddClick = () => {
    router.push(`/product/create`)
  }

  return (
  <Wrapper>
    {loading && <Spinner />}
    {!loading && <>
      <Title>Product List</Title>
      <Grid>
        {renderProducts()}
        <GridItem onClick = {onProductAddClick}><AddProductCard/></GridItem>
      </Grid>
    </>}
  </Wrapper>
  )
}
