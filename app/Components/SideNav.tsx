'use client'
import styled from 'styled-components'
import { FiShoppingBag, FiShoppingCart } from 'react-icons/fi';
import { useRouter } from 'next/navigation'

import { useSelectedNav } from '../util/context/selectedNav'
import { white } from '../util/styles'

const Wrapper = styled.section`
  padding: 2em 0;
  border: solid ${white};
  height: 70vh;
  border-radius: 1em;
`

const NavItem = styled.div<{ $selected?: boolean }>`
  font-size: 1.4em;
  background-color: ${props => props.$selected ? "gray" : "black"};
  color: ${white};
  text-align: left;
  padding: 20px;
  display: flex;
  gap: 20px;
`

export default function SideNav() {

  const { selectedNav, setSelectedNav } = useSelectedNav()
  const router = useRouter()

  const onProductsClick = () => {
    setSelectedNav('product')
    router.push('/')
  }

  const onOrdersClick = () => {
    setSelectedNav('order')
    router.push('/orders')
  }

  return (
  <Wrapper>
    {selectedNav === 'product' ?
    <NavItem $selected className='hoverable' onClick={onProductsClick}>
        <FiShoppingBag />
        Products
    </NavItem>
    :
    <NavItem className='hoverable' onClick={onProductsClick}>
        <FiShoppingBag />
        Products
    </NavItem>}
    {selectedNav === 'order' ?
    <NavItem $selected className='hoverable' onClick={onOrdersClick}>
        <FiShoppingCart />
        Orders
    </NavItem>
    :
    <NavItem className='hoverable' onClick={onOrdersClick}>
        <FiShoppingCart />
        Orders
    </NavItem>}
  </Wrapper>
  )
}
