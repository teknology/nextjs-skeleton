import Image from 'next/image'
import { GoogleSignIn } from './components/google-sign-in'
import { auth } from '@/auth'

export default async function Home () {
  const session = await auth()

  return (
    <>
      <pre>
        <div>{JSON.stringify(session)}</div>{' '}
      </pre>

      <GoogleSignIn />
    </>
  )
}
