export interface Product {
    id?: string
    name: string
    unitPrice: number
    quantity: number
}

export interface Order {
    id?: string
    orderItems: OrderItem[]
    orderStatus: string
    shippingAddress: string
    totalValue: number
    trackingNumber?: string
    trackingCompany?: string
    createdAt: string
}

export interface CreateOrderPayload {
    shippingAddress: string
    orderItems: OrderItem[]
}

export interface OrderUpdateValues {
    orderStatus: string
    trackingNumber: string
    trackingCompany: string
}

export interface OrderItem {
    id: string
    quantity: number
    name?: string
}

export interface ToastMessage {
    showMessage: boolean
    type?: 'success' | 'error'
    message?: string
}