import { useFormik } from 'formik'
import { z } from 'zod'
import styled from 'styled-components'
import { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { IoTrashOutline } from 'react-icons/io5'
import { useRouter } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify'

import { redError, white } from '../util/styles'
import { Product } from '../types'
import Modal from './Modal'
import { createProduct, deleteProduct, updateProductById } from '../util/api'
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

const DeleteButton = styled(Button)`
  background-color: ${redError};
  color: ${white};
  margin-left: 1rem;
`

const ProductSchema = z.object({
  name: z
    .string()
    .min(8, 'Name should be at least 8 characters long')
    .max(32, 'Name should be at most 32 characters long'),
  unitPrice: z.number().positive('Must be a positive number'),
  quantity: z.number().positive('Must be a positive number'),
});

const validate = (rawValues: RawProduct) => {
  try {
    const values: Product = {
      name: rawValues.name,
      unitPrice: rawValues.unitPrice !== '' ? Number(rawValues.unitPrice) : 0,
      quantity: rawValues.quantity !== '' ? Number(rawValues.quantity) : 0,
    }
    ProductSchema.parse(values)
    return {};
  } catch (error: any) {
    return error.formErrors.fieldErrors
  }
};

type Props = {
  action: 'create' | 'update',
  product?: Product
}

type RawProduct = {
  name: string;
  unitPrice: number | '';
  quantity: number | '';
}

export default function ProductForm(props: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleted, setIsDeleted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hideCreateButton, setHideCreateButton] = useState(false)
  const [formValues, setFormValues] = useState<RawProduct>()

  const formik = useFormik<RawProduct>({
    initialValues: {
      name: props.product ? props.product.name : '',
      unitPrice: props.product ? props.product.unitPrice : '',
      quantity: props.product ? props.product.quantity : '',
    },
    validate,
    onSubmit: async (rawValues: RawProduct) => {
      setFormValues(rawValues)
      if(props.action === 'create') setIsCreateModalOpen(true)
      if(props.action === 'update') setIsUpdateModalOpen(true)
    },
  })

  const router = useRouter()

  useEffect(() => {
    if (props.product) {
      formik.setValues({
        name: props.product.name,
        unitPrice: props.product.unitPrice,
        quantity: props.product.quantity,
      })
    }
  }, [props.product])

  const onBackClick = () => {
    router.push(`/`)
  }

  const onDeleteClick = () => {
    setIsDeleteModalOpen(true)
  }

  const onConfirmDelete = async() => {
    setIsDeleteModalOpen(false)
    setIsLoading(true)
    if(props.product?.id) {
      const res = await deleteProduct(props.product.id)
      setIsLoading(false)
      if(res?.status === 200) {
        setIsDeleted(true)
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
  }

  const onConfirmAction = async () => {
    if(!formValues) return
    setIsLoading(true)
    const values: Product = {
      name: formValues.name,
      unitPrice: Number(formValues.unitPrice),
      quantity: Number(formValues.quantity)
    }

    try {
      let res
      if(props.action === 'create') {
        setIsCreateModalOpen(false)
        res = await createProduct(values)
        setHideCreateButton(true)
      } else if(props.product?.id) {
        setIsUpdateModalOpen(false)
        res = await updateProductById(props.product.id, values)
      }
      setIsLoading(false)
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
    setIsDeleteModalOpen(false)
    setIsCreateModalOpen(false)
    setIsUpdateModalOpen(false)
  }

  return (
    <>
      {isLoading && <Spinner />}
      {isDeleted && !isLoading && <Title>Product Deleted!</Title>}
      {!isDeleted && !isLoading && <Wrapper>
        {props.action === 'create' ? <Title>Create a New Product</Title> : <Title>Update Product</Title>}
        <FormElement onSubmit={formik.handleSubmit}>
          <InputGroup>
            <InputLabel>Product Name</InputLabel>
            <InputElement name="name" value={formik.values.name} onChange={formik.handleChange} />
            {formik.errors.name && <ErrorMessage>{formik.errors.name}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <InputLabel>Product Price</InputLabel>
            <InputElement name="unitPrice" value={formik.values.unitPrice} onChange={formik.handleChange} type="number" />
            {formik.errors.unitPrice && <ErrorMessage>{formik.errors.unitPrice}</ErrorMessage>}
          </InputGroup>
          <InputGroup>
            <InputLabel>Available Quantity</InputLabel>
            <InputElement name="quantity" value={formik.values.quantity} onChange={formik.handleChange} type="number" />
            {formik.errors.quantity && <ErrorMessage>{formik.errors.quantity}</ErrorMessage>}
          </InputGroup>
          <ButtonWrapper>
            <Button type="button" className="hoverable" onClick={onBackClick}>
              <FaArrowLeft />
            </Button>
            {props.action === 'update' && <DeleteButton type="button" onClick={onDeleteClick} className = "hoverable">
              <IoTrashOutline size={20} />
            </DeleteButton>}
            {!hideCreateButton && <Button type="submit" className="hoverable">
              {props.action === 'create' ? 'Create' : 'Update'}
            </Button>}
          </ButtonWrapper>
        </FormElement>
      </Wrapper>}
      {isDeleteModalOpen && <Modal onClose={()=>{}}>
          <h4>Are you sure you want to delete the product: {props.product?.name}?</h4>
          <Button onClick={onConfirmDelete}  className='hoverable'>Delete</Button>
          <Button onClick={onCloseModal}  className='hoverable'>Cancel</Button>
        </Modal>}
      {isCreateModalOpen && <Modal onClose={()=>{}}>
        <h4>Are you sure you want to create this new product?</h4>
        <Button onClick={onConfirmAction}  className='hoverable'>Create</Button>
        <Button onClick={onCloseModal}  className='hoverable'>Cancel</Button>
      </Modal>}
      {isUpdateModalOpen && <Modal onClose={()=>{}}>
        <h4>Are you sure you want to update the product: {props.product?.name}?</h4>
        <Button onClick={onConfirmAction} className='hoverable'>Update</Button>
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
    </>
     );
}
