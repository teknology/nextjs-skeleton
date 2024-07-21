import * as actions from '@/actions'

export async function SignOut () {
  return (
    <form action={actions.signOut}>
      <button type='submit'>Sign Out</button>
    </form>
  )
}
