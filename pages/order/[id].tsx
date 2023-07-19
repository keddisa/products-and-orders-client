'use client'
import Layout from '../../app/MainLayout'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getOrderById } from '@/app/util/api'
import { Order } from '@/app/types'
import Spinner from '@/app/Components/Spinner'
import UpdateOrderForm from '@/app/Components/UpdateOrderForm'

export default function Order() {
  const [order, setOrder] = useState<Order>()
  const {id} = useRouter().query
  const orderId = typeof id === 'object' ? id[0] : id || ''

  useEffect(() => {
    const getData = async() => {
      if(orderId) {
        const res = await getOrderById(orderId)
        setOrder(res.data.data)
      }

    }
    getData()
  }, [id])
  return (
  <Layout>
    {!order && <Spinner />}
    {order && <UpdateOrderForm order= {order} setOrder={setOrder} />}
  </Layout>
  )
}
