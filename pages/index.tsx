'use client'
import styled from 'styled-components'

import styles from './page.module.css'
import Layout from '../app/MainLayout';
import Products from '@/app/Components/Products';



export default function Home() {
  return (
  <Layout>
    <Products />
  </Layout>
  )
}
