'use client';
import Image from 'next/image'
import * as actions from '@/actions'
import { useFormState } from 'react-dom'
import { Button, Input } from '@nextui-org/react'
import { error } from 'console'
import FormButton from '@/app/components/common/form-button'
import { getUserByEmail } from '@/db/queries/user'
import { useSession, getSession } from 'next-auth/react'

export default function Home() {
  const { data: session, status, update } = useSession()


  const updateSession = async () => {
    await update({ image: '/test.jpg' });

  };



  //const user = getUserByEmail('gary@magehd.com');
  //  console.log(user);
  /*
    const [formState, action] = useFormState(actions.signUpPassword, {
      errors: {}
    })
  */
  return (
    <div className='container mx-auto space-y-1'>

      <Button onClick={() => updateSession()}>Update image</Button>

      <Button onClick={() => update()}>Edit name</Button>

      <pre>{JSON.stringify(session)}</pre>

      <div>
        <p>The user image is {session?.user?.image}</p>
      </div>
      <div className='flex justify-center w-100 py-100'>
        <form>
          <Input
            type='email'
            name='email'
            placeholder='Email'
            className='p-5'

          />
          <Input
            className='p-5'
            type='password'
            name='password'
            placeholder='Password'
          />

          <Input
            className='p-5'
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
          />

          <FormButton> Submit </FormButton>
        </form>
      </div>
    </div>
  )
}
