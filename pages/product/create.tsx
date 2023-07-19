'use client'
import Layout from '../../app/MainLayout'

import { Product } from '@/app/types'
import ProductForm from '@/app/Components/ProductForm'

export default function Product() {
  return (
  <Layout>
    <ProductForm action="create"/>
  </Layout>
  )
}
