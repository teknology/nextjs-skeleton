import * as actions from '@/actions'

export default async function SignOutButton () {
  return (
    <form action={actions.signOut}>
      <button type='submit'>Sign Out</button>
    </form>
  )
}
