import { Button } from '@nextui-org/react'
import * as actions from '@/actions'
import { Icon } from '@iconify/react'

export async function GoogleSignIn () {
  return (
    <form action={actions.signInGoogle}>
      <Button
        color='primary'
        type='submit'
        fullWidth
        variant='flat'
        className='max-w-52'
      >
        <Icon icon='flat-color-icons:google' width={24} />
        Signin with Google
      </Button>
    </form>
  )
}
