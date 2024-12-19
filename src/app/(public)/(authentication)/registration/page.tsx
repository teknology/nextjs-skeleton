'use client'
import * as actions from '@/actions'
import { useFormState } from 'react-dom'
import FormButton from '@/app/components/common/form-button'
import React from 'react'
import { Input, Checkbox, Link } from '@nextui-org/react'
import { Icon } from '@iconify/react'

export default function Registration() {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isConfirmVisible, setIsConfirmVisible] = React.useState(false)

  const toggleVisibility = () => setIsVisible(!isVisible)
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible)
  const [formState, action] = useFormState(actions.signUpPassword, {
    errors: {}
  })

  return (
    <div className='flex h-full w-full items-center justify-center'>
      <div className='flex w-full max-w-sm flex-col gap-4 rounded-large px-8 pb-10 pt-6'>
        <p className='pb-4 text-left text-3xl font-semibold'>
          Sign Up
          <span aria-label='emoji' className='ml-2' role='img'>
            👋
          </span>
        </p>
        <form className='flex flex-col gap-4' action={action}>
          <Input
            isRequired
            label='Email'
            labelPlacement='outside'
            name='email'
            placeholder='Enter your email'
            type='email'
            variant='bordered'
            isInvalid={!!formState.errors?.email}
            errorMessage={formState.errors.email?.join(', ')}
          />
          <Input
            isRequired
            label='Password'
            labelPlacement='outside'
            name='password'
            placeholder='Enter your password'
            variant='bordered'
            isInvalid={!!formState.errors?.password}
            errorMessage={formState.errors.password?.join(', ')}
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
            type={isVisible ? 'text' : 'password'}
          />
          <Input
            isRequired
            label='Confirm Password'
            labelPlacement='outside'
            name='confirmPassword'
            placeholder='Confirm your password'
            variant='bordered'
            isInvalid={!!formState.errors?.confirmPassword}
            errorMessage={formState.errors.confirmPassword?.join(', ')}
            endContent={
              <button type='button' onClick={toggleConfirmVisibility}>
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
            type={isVisible ? 'text' : 'password'}
          />
          <Checkbox isRequired name='agreeTerms' className='py-4' size='sm'>
            I agree with the&nbsp;
            <Link href='#' size='sm'>
              Terms
            </Link>
            &nbsp; and&nbsp;
            <Link href='#' size='sm'>
              Privacy Policy
            </Link>
          </Checkbox>
          <FormButton>Sign Up</FormButton>
          {formState.errors._form ? (
            <div className='p-2 bg-red-200 border rounded border-red-400'>
              {formState.errors?._form?.join(', ')}
            </div>
          ) : null}
        </form>
        <p className='text-center text-small'>
          <Link href='/login' size='sm'>
            Already have an account? Log In
          </Link>
        </p>
      </div>
    </div>
  )
}
