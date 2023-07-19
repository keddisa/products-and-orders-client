'use client'
import styled from 'styled-components'

import Layout from '../../app/MainLayout'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getProductById } from '@/app/util/api'
import { Product } from '@/app/types'
import ProductForm from '@/app/Components/ProductForm'
import Spinner from '@/app/Components/Spinner'

export default function Product() {
  const [product, setProduct] = useState<Product>()
  const [loading, setLoading] = useState<boolean>(true)
  const {id} = useRouter().query
  const productId = typeof id === 'object' ? id[0] : id || ''
  useEffect(() => {
    const getData = async() => {
      if(productId) {
        const res = await getProductById(productId)
        setProduct(res.data.data)
        setLoading(false)
      }

    }
    getData()
  }, [id])
  return (
  <Layout>
    {loading && <Spinner />}
    {!loading && <ProductForm action="update" product= {product}/>}
  </Layout>
  )
}
