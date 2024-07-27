'use client'

import { useFormStatus } from 'react-dom'
import { Button } from '@nextui-org/react'
import { color } from 'framer-motion'

interface FormButtonProps {
  //color?: any
  children: React.ReactNode
}
export default function FormButton (
  //color: FormButtonProps,
  { children }: FormButtonProps
) {
  const { pending } = useFormStatus()

  return (
    <Button color='primary' type='submit' isLoading={pending}>
      {children}
    </Button>
  )
}
