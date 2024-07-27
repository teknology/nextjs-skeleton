'use client'
import Image from 'next/image'
import { GoogleSignIn } from './components/google-sign-in'
import { auth } from '@/auth'
import * as actions from '@/actions'
import { useFormState } from 'react-dom'
import { Button, Input } from '@nextui-org/react'
import { error } from 'console'
import FormButton from './components/common/form-button'

export default function Home () {
  //const session = await auth()

  const [formState, action] = useFormState(actions.signUpPassword, {
    errors: {}
  })

  return (
    <div className='container mx-auto space-y-1'>
      <div className='flex justify-center w-100 py-100'>
        <form action={action}>
          <Input
            type='email'
            name='email'
            placeholder='Email'
            className='p-5'
            isInvalid={!!formState.errors?.email}
            errorMessage={formState.errors.email?.join(', ')}
          />
          <Input
            className='p-5'
            type='password'
            name='password'
            placeholder='Password'
          />
          {formState.errors.password && (
            <div className='p-2 bg-red-200 border rounded border-red-400'>
              {formState.errors?.password}
            </div>
          )}
          <Input
            className='p-5'
            type='password'
            name='confirmPassword'
            placeholder='Confirm Password'
          />
          {formState.errors.confirmPassword && (
            <p>
              <div className='p-2 bg-red-200 border rounded border-red-400'>
                {formState.errors?.confirmPassword}
              </div>
            </p>
          )}
          {formState.errors._form ? (
            <div className='p-2 bg-red-200 border rounded border-red-400'>
              {formState.errors?._form?.join(', ')}
            </div>
          ) : null}
          <FormButton> Submit </FormButton>
        </form>
      </div>
    </div>
  )
}
