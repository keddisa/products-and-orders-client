import { useFormik } from 'formik'
import { z } from 'zod'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'

import { redError, white } from '../util/styles'
import { Order, OrderUpdateValues } from '../types'
import Modal from './Modal'
import { updateOrderById } from '../util/api'
import { useSelectedNav } from '../util/context/selectedNav'
import Spinner from './Spinner'

const Wrapper = styled.section`
  width: 100%;
  padding: 1em;
  border-radius: 10px;
`

const Title = styled.h2`
  font-size: 1.5em;
  text-align: center;
  color: ${white};
  padding-bottom: 3em;
`

const SummarySubtitle = styled.div`
  font-size: 1.2em;
  text-align: left;
  color: ${white};
  margin: 1em 2em 1em; 2em;
`

const SummaryDetail = styled.div`
  font-size: 1em;
  text-align: left;
  color: ${white};
  padding-bottom: 1em;
  margin: 0 4em;
`

const Table = styled.table`
  border-collapse: collapse;
  color: ${white};
  font-size: 1em;
  text-align: left;
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

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2em;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 70%;
  margin-bottom: 1rem;
`

const InputLabel = styled.label`
  font-size: 1.2em;
  font-family: inherit;
  margin-left: 1rem;
`

const InputElement = styled.input`
  font-size: 1rem;
  padding: 1rem 2rem;
  border: 1px solid black;
  font-family: inherit;
  border-radius: 2px;
  width: 100%;
  margin: 1rem 0;
`

const ErrorMessage = styled.div`
  color: ${redError};
  font-size: 1rem;
  justify-self: left;
  align-self: center;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 70%;
`

const Button = styled.button`
  background: black;
  color: ${white};

  font-size: 1em;
  margin: 1em;
  padding: 0.5em 1.5em;
  border: 2px solid ${white};
  border-radius: 3px;
`

const SelectElement = styled.select`
  font-size: 1rem;
  padding: 1rem 2rem;
  border: 1px solid black;
  font-family: inherit;
  border-radius: 2px;
  width: 100%;
  margin: 1rem 0;
`

const UpdateOrderSchema = z.object({
  orderStatus: z
    .string()
})

const validate = (values: OrderUpdateValues) => {
  try {
    UpdateOrderSchema.parse(values)
    return {};
  } catch (error: any) {
    return error.formErrors.fieldErrors
  }
}

type Props = {
  order: Order
  setOrder: React.Dispatch<React.SetStateAction<Order | undefined>>
}

export default function UpdateOrderForm(props: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [values, setValues] = useState<OrderUpdateValues>()
  const { setSelectedNav } = useSelectedNav()

  const formik = useFormik<OrderUpdateValues>({
    initialValues: {
      orderStatus: props.order.orderStatus,
      trackingNumber: props.order.trackingNumber || '',
      trackingCompany: props.order.trackingCompany || ''
    },
    validate,
    onSubmit: async (values: OrderUpdateValues) => {
      setValues(values)
      setIsModalOpen(true)
    },
  })

  const router = useRouter()

  useEffect(() => {
    setSelectedNav('order')
    formik.setValues({
      orderStatus: props.order.orderStatus,
      trackingNumber: props.order.trackingNumber || '',
      trackingCompany: props.order.trackingCompany || ''
    })
  }, [props.order])

  const onBackClick = () => {
    router.push(`/orders`)
  }

  const onConfirmUpdate = async () => {
    setIsModalOpen(false)
    setIsLoading(true)
    try {
      if(values && props.order.id) {
        const res = await updateOrderById(props.order.id, values)
        setIsLoading(false)
        props.setOrder(res.data.data)
        if(res?.status === 200) {
          toast.success(res.data.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            theme: "light",
          })
        }
      }
    } catch(e: any) {
      toast.error(e.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        theme: "light",
        })
    }
  }

  const onCloseModal = () => {
    setIsModalOpen(false)
  }

  const renderOrderItems = () => {
    return props.order.orderItems.map(({name, quantity}, index) => {
      return <tr key={index} >
        <RowCell>{name}</RowCell>
        <RowCell>{quantity}</RowCell>
      </tr>
    })
  }

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && <Wrapper>
        <Title>Order Summary</Title>
        <SummarySubtitle>Order Items</SummarySubtitle>
        <SummaryDetail>
          <Table>
          <thead>
              <tr>
                  <Header>Product Name</Header>
                  <Header>Ordered Quantity</Header>
              </tr>
          </thead>
          <tbody>
              {renderOrderItems()}
          </tbody>
        </Table>
        </SummaryDetail>
        <SummarySubtitle>Shipping Address: <span style={{fontSize: '0.8em', marginLeft: '1em'}}>{props.order.shippingAddress}</span></SummarySubtitle>
        <SummarySubtitle>Order Status: <span style={{fontSize: '0.8em', marginLeft: '1em'}}>{props.order.orderStatus}</span></SummarySubtitle>
        <SummarySubtitle>Total Value: <span style={{fontSize: '0.8em', marginLeft: '1em'}}>{props.order.totalValue}</span></SummarySubtitle>
        <SummarySubtitle>Tracking Number: <span style={{fontSize: '0.8em', marginLeft: '1em'}}>{props.order.trackingNumber ? props.order.trackingNumber : 'Tracking number is not available'}</span></SummarySubtitle>
        <SummarySubtitle>Tracking Company: <span style={{fontSize: '0.8em', marginLeft: '1em'}}>{props.order.trackingCompany ? props.order.trackingCompany : 'Tracking company is not available'}</span></SummarySubtitle>
        <SummarySubtitle>Date of Order: <span style={{fontSize: '0.8em', marginLeft: '1em'}}>{props.order.createdAt}</span></SummarySubtitle>
        <FormElement onSubmit={formik.handleSubmit}>
          <InputGroup>
            <InputLabel>Order Status</InputLabel>
            <SelectElement name="orderStatus" value={formik.values.orderStatus} onChange={formik.handleChange}>
              <option value="">Select an order status</option>
              <option value="Processing">Processing</option>
              <option value="In Transit">In Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </SelectElement>
            {formik.errors.orderStatus && <ErrorMessage>{formik.errors.orderStatus}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <InputLabel>Tracking Number</InputLabel>
            <InputElement name="trackingNumber" value={formik.values.trackingNumber} onChange={formik.handleChange} type="text" />
            {formik.errors.trackingNumber && <ErrorMessage>{formik.errors.trackingNumber}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <InputLabel>Tracking Company</InputLabel>
            <InputElement name="trackingCompany" value={formik.values.trackingCompany} onChange={formik.handleChange} type="text" />
            {formik.errors.trackingCompany && <ErrorMessage>{formik.errors.trackingCompany}</ErrorMessage>}
          </InputGroup>
          <ButtonWrapper>
            <Button type="button" className="hoverable" onClick={onBackClick}>
              <FaArrowLeft />
            </Button>
            <Button type="submit" className="hoverable">
              Update
            </Button>
          </ButtonWrapper>
        </FormElement>
      </Wrapper>}
      {isModalOpen && <Modal onClose={()=>{}}>
          <h4>Are you sure you want to update this order?</h4>
          <Button onClick={onConfirmUpdate}  className='hoverable'>Update</Button>
          <Button onClick={onCloseModal}  className='hoverable'>Cancel</Button>
        </Modal>}
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
     );
}
