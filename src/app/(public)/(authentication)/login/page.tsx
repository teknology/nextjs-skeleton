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

export default function Login() {
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
        <p className='text-xl font-medium'>Welcome Back</p>
        <p className='text-small text-default-500'>
          Log in to your account to continue
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
          <Input
            endContent={
              <button type='button' onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon
                    className='pointer-events-none text-2xl text-default-400'
                    icon='solar:eye-closed-linear'
                  />
                ) : (
                  <Icon
                    className='pointer-events-none text-2xl text-default-400'
                    icon='solar:eye-bold'
                  />
                )}
              </button>
            }
            label='Password'
            name='password'
            placeholder='Enter your password'
            type={isVisible ? 'text' : 'password'}
            variant='bordered'
            isInvalid={!!formState.errors?.password}
            errorMessage={formState.errors.password?.join(',')}
          />
          <div className='flex items-center justify-between px-1 py-2'>
            <Checkbox name='remember' size='sm'>
              Remember me
            </Checkbox>
            <Link className='text-default-500' href='#' size='sm'>
              Forgot password?
            </Link>
          </div>
          <FormButton>
            Log In
          </FormButton>
          <div
            className='flex h-8 items-end space-x-1'
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
        <div className='flex flex-col gap-2'>
          <GoogleSignIn />
        </div>
        <p className='text-center text-small'>
          Need to create an account?&nbsp;
          <Link href='/registration' size='sm'>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}
