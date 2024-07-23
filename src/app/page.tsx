'use client'
import Image from 'next/image'
import { GoogleSignIn } from './components/google-sign-in'
import { auth } from '@/auth'
import * as actions from '@/actions'
import { useFormState } from 'react-dom'
import { Button, Input } from '@nextui-org/react'

export default function Home () {
  //const session = await auth()

  const [formState, action] = useFormState(actions.signUp, {
    errors: {}
  })
  return (
    <form>
      <Input type='email' name='email' placeholder='Email' />
      <Input type='password' name='password' placeholder='Password' />
      <Button type='submit'>Sign In</Button>
    </form>
  )
}
