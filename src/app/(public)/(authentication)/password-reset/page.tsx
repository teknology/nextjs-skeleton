'use client'

import React from 'react'
import { Button, Input, Checkbox, Link, Divider } from '@nextui-org/react'
import { Icon } from '@iconify/react'
import { useFormState } from 'react-dom'
import * as actions from '@/actions';

import { AcmeIcon } from '@/app/components/icons'
import { GoogleSignIn } from '@/app/components/google-sign-in'
import FormButton from '@/app/components/common/form-button'
import { useRouter } from 'next/router'
import { redirect } from 'next/navigation'

export default function PasswordReset() {
  const [isVisible, setIsVisible] = React.useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)
  const [formState, action] = useFormState(actions.signInPassword, {
    errors: {}
  });

  if (formState.errors?._form?.includes('NEXT_REDIRECT')) {

    //TODO: Find a more elegant way to handle redirecting to the account page after Authjs login.
    redirect('/my-account');

  }
  return (
    <div className='flex h-full  w-full flex-col items-center justify-center'>
      <div className='flex flex-col items-center pb-6'>
        <p className='text-xl font-medium'>Forgot your password?</p>
        <p className='text-small text-default-500'>
          Enter your email below and We’ll email instructions on how to reset your password.
        </p>
      </div>
      <div className='mt-2 flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 py-6 shadow-small'>
        <form
          action={action}
          className='flex flex-col gap-3'
        // onSubmit={e => e.preventDefault()}
        >
          <Input
            label='Email Address'
            name='email'
            placeholder='Enter your email'
            type='email'
            variant='bordered'
            isInvalid={!!formState.errors?.email}
            errorMessage={formState.errors.email?.join(', ')}
          />
          <FormButton>
            Log In
          </FormButton>
          <div
            className='flex items-end space-x-1'
            aria-live='polite'
            aria-atomic='true'
          >
            {formState.errors._form ? (
              <div className='p-2 bg-red-200 border rounded border-red-400'>
                {formState.errors?._form?.join(', ')}
              </div>
            ) : null}
          </div>
        </form>
        <div className='flex items-center gap-4'>
          <Divider className='flex-1' />
          <p className='shrink-0 text-tiny text-default-500'>OR</p>
          <Divider className='flex-1' />
        </div>
        <p className='text-center text-small'>
          Return back to login&nbsp;
          <Link href='/login' size='sm'>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
