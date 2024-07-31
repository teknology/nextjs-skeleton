import { Button } from '@nextui-org/react'
import * as actions from '@/actions'
import { Icon } from '@iconify/react'

export function GoogleSignIn() {
  return (
    <form action={actions.signInGoogle}>
      <Button
        className='w-full'
        startContent={<Icon icon='flat-color-icons:google' width={24} />}
        variant='bordered'
        type='submit'
      >
        Signin with Google
      </Button>
    </form>
  )
}
