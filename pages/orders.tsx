'use client'
import styled from 'styled-components'

import styles from './page.module.css'
import Layout from '../app/MainLayout';
import Orders from '@/app/Components/Orders';



export default function Home() {
  return (
  <Layout>
    <Orders />
  </Layout>
  )
}
