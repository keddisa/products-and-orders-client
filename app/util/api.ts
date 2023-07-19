import axios from 'axios'
import { CreateOrderPayload, Order, OrderUpdateValues, Product } from '../types'

const host = 'https://rjj3lkfvpb.execute-api.us-east-1.amazonaws.com/Prod'

export const getAllProducts = async() => {
    const res = await axios.get(`${host}/products`)
    return res
}
export const deleteProduct = async(id: string) => {
    const res = await axios.delete(`${host}/product/${id}`)
    return res
}

export const getAllOrders = async() => {
    const res = await axios.get(`${host}/orders`)
    return res
}


export const getProductById = async(id: string) => {
    const res = await axios.get(`${host}/product/${id}`)
    return res
}

export const getOrderById = async(id: string) => {
    const res = await axios.get(`${host}/order/${id}`)
    return res
}

export const updateProductById = async(id: string, values: Product) => {
    const res = await axios.patch(`${host}/product/${id}`, values)
    return res
}

export const updateOrderById = async(id: string, values: OrderUpdateValues) => {
    const res = await axios.patch(`${host}/order/${id}`, values)
    return res
}

export const createProduct = async(values: Product) => {
    const res = await axios.post(`${host}/product`, values)
    return res
}

export const createOrder = async(values: CreateOrderPayload) => {
    const res = await axios.post(`${host}/order`, values)
    return res
}