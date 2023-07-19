'use client'
import Image from 'next/image'
import styled from 'styled-components'

import styles from './page.module.css'
import Componenets from '../Components';
import { white } from '../util/styles';
import { ReactNode, useState } from 'react';
import { SelectedNavStateProvider } from '../util/context/selectedNav';

import 'react-toastify/dist/ReactToastify.css'

const {SideNav, Products} = Componenets

const Wrapper = styled.section`
  padding: 4em;
`
const Title = styled.h1`
  font-size: 2em;
  text-align: center;
  color: ${white};
  padding-bottom: 2em;
  border-bottom: solid ${white};
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: min-content 1fr;
  gap: 10px;
`

const GridItem = styled.div`
  padding: 20px;
  text-align: center;
`

interface LayoutProps {
    children: ReactNode;
  }

export default function Layout({children}: LayoutProps) {
  return (
    <SelectedNavStateProvider>
        <Wrapper>
          <Title>
            Products and Orders Management System
          </Title>
          <Grid>
            <GridItem>
              <SideNav />
            </GridItem>
            <GridItem>
              {children}
            </GridItem>
          </Grid>
        </Wrapper>
    </SelectedNavStateProvider>
  )
}
