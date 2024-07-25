'use client'
import Image from 'next/image'
import { GoogleSignIn } from './components/google-sign-in'
import { auth } from '@/auth'
import { Button, Input, Text } from '@nextui-org/react'

export default function Home () {
  //const session = await auth()

  return (
    <form>
      <Input type='email' placeholder='Email' label='Email' required />
      <Input type='password' placeholder='Password' label='Password' required />
      <Button type='submit'>Signin</Button>
    </form>
  )
}
