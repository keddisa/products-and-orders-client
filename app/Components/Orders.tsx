'use client'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlus } from 'react-icons/fa'

import { white } from '../util/styles'
import { useSelectedNav } from '../util/context/selectedNav'

import { getAllOrders } from '../util/api'
import { Order } from '../types'
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

const AddOrder = styled.div`
  font-size: 1.5;
  text-align: left;
`

const Table = styled.table`
  border-collapse: collapse;
  color: ${white};
  font-size: 1em;
  text-align: left;
  margin-top: 50px;
  margin-bottom: 50px;
`

const Header = styled.th `
  color: ${white};
  font-weight: bold;
  padding: 15px 50px;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-top: 2px solid ${white};
  border-bottom: 2px solid ${white};
`

const RowCell = styled.td`
  padding: 15px 50px;
  border-bottom: .5px solid ${white};
`
export default function Products() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { setSelectedNav } = useSelectedNav()

  useEffect(() => {
    const getData = async() => {
      const res = await getAllOrders()
      setOrders(res.data.data)
      setLoading(false)
    }
    setSelectedNav('order')
    getData()
  }, [])

  const onRowClick = async (id: string) => {
    router.push(`/order/${id}`)
  }

  const renderRows = () => {
    return orders.map(({id, orderItems, orderStatus, shippingAddress, totalValue, createdAt}, index) => {
      return <tr key={index} onClick = {() => onRowClick(id || '')} className='hoverable'>
        <RowCell>{id}</RowCell>
        <RowCell>{orderItems.length}</RowCell>
        <RowCell>${totalValue}</RowCell>
        <RowCell>{shippingAddress}</RowCell>
        <RowCell>{orderStatus}</RowCell>
        <RowCell>{createdAt}</RowCell>
      </tr>
    })
  }

  const onAddOrderClick = () => {
    router.push(`/order/create`)
  }

  return (
  <Wrapper>
    {loading && <Spinner />}
    {!loading && <>
      <Title>Order List</Title>
      <AddOrder className='hoverable' onClick={onAddOrderClick}><FaPlus/>&nbsp;&nbsp;Place a new order</AddOrder>
      <div style={{overflowX: 'auto'}}>
        <Table>
          <thead>
              <tr>
                  <Header>ID</Header>
                  <Header>Number of Items</Header>
                  <Header>Total Value</Header>
                  <Header>Shipping Address</Header>
                  <Header>Status</Header>
                  <Header>Date</Header>
              </tr>
          </thead>
          <tbody>
              {renderRows()}
          </tbody>
        </Table>
      </div>

      {/* <Grid>
        {renderProducts()}
        <GridItem onClick = {onProductAddClick}><AddProductCard/></GridItem>
      </Grid> */}
    </>}
  </Wrapper>
  )
}
