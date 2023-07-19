import { useFormik } from 'formik'
import { z } from 'zod'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useRouter } from 'next/router'
import { ToastContainer, toast } from 'react-toastify'

import { redError, white } from '../util/styles'
import { CreateOrderPayload, Product } from '../types'
import { createOrder, getAllProducts } from '../util/api'
import { useSelectedNav } from '../util/context/selectedNav'
import Modal from './Modal'
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

const FormElement = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const SelectElement = styled.select`
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

interface FormValues {
  shippingAddress: string;
  productId: string;
  quantity: number;
}

const FormSchema = z.object({
  shippingAddress: z.string().min(16, 'Please provide a valid shipping address'),
  productId: z.string().nonempty('Please make sure you select a product'),
  quantity: z.number().min(1, 'Quantity must be positive'),
})

const validate = (values: FormValues) => {
  try {
    FormSchema.parse(values);
    return {}
  } catch (error: any) {
    return error.formErrors.fieldErrors
  }
}

export default function CreateOrderForm() {
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hideSubmitButton, setHideSubmitButton] = useState(false)
  const [postPayload, setPostPayload] = useState<CreateOrderPayload>()

  const { setSelectedNav } = useSelectedNav()
  const router = useRouter()

  useEffect(() => {
    const getData = async() => {
      const res = await getAllProducts()
      if(res.status === 200) {
        setProducts(res.data.data)
      }
    }
    setSelectedNav('order')
    getData()
  }, [])

  const formik = useFormik<FormValues>({
    initialValues: {
      shippingAddress: '',
      productId: '',
      quantity: 1,
    },
    validate,
    onSubmit: async ({shippingAddress, productId, quantity}: FormValues) => {
      setPostPayload({
        shippingAddress,
        orderItems: [{
          id: productId,
          quantity
        }]
      })
      setIsModalOpen(true)
    },
  })

  const onBackClick = () => {
    router.push(`/orders`)
  }

  const onConfirmSubmit = async () => {
    setIsModalOpen(false)
    try {
      if(postPayload) {
        const product = products.filter(({id}) => id === postPayload.orderItems[0].id)[0]
        if(product.quantity < postPayload.orderItems[0].quantity) {
          toast.error(`Only ${product.quantity} items are avialable for ${product.name}`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            theme: "light",
          })
          return
        }
        setIsLoading(true)
        const res = await createOrder(postPayload)
        setIsLoading(false)
        if(res.status === 200) {
          toast.success(res.data.message, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            theme: "light",
          })
          setHideSubmitButton(true)
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

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && <Wrapper>
        <Title>Create a New Order</Title>
        <FormElement onSubmit={formik.handleSubmit}>
          <InputGroup>
            <InputLabel>Product</InputLabel>
            <SelectElement name="productId" value={formik.values.productId} onChange={formik.handleChange}>
              <option value="">Select a product</option>
              {products.map((product, index) => (
                <option value={product.id} key={index}>{product.name}</option>
              ))}
            </SelectElement>
            {formik.errors.productId && (
              <ErrorMessage>{formik.errors.productId}</ErrorMessage>
            )}
            <InputLabel>Quantity</InputLabel>
            <InputElement
              name="quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              type="number"
            />
            {formik.errors.quantity && (
              <ErrorMessage>{formik.errors.quantity}</ErrorMessage>
            )}
          </InputGroup>
          <InputGroup>
            <InputLabel>Shipping Address</InputLabel>
            <InputElement
              name="shippingAddress"
              value={formik.values.shippingAddress}
              onChange={formik.handleChange}
            />
            {formik.errors.shippingAddress && (
              <ErrorMessage>{formik.errors.shippingAddress}</ErrorMessage>
            )}
          </InputGroup>
          <ButtonWrapper>
            <Button type="button" className="hoverable" onClick={onBackClick}>
              <FaArrowLeft />
            </Button>
            {!hideSubmitButton && <Button type="submit" className="hoverable">Submit Order</Button>}
          </ButtonWrapper>
        </FormElement>
        {isModalOpen && <Modal onClose={()=>{}}>
            <h4>Are you sure you want to place this order?</h4>
            <Button onClick={onConfirmSubmit}  className='hoverable'>Submit</Button>
            <Button onClick={onCloseModal}  className='hoverable'>Cancel</Button>
          </Modal>}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Wrapper>}
    </>

  );
}
