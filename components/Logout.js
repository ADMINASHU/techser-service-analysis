
import { doLogout } from '@/app/action'
const Logout = () => {

  return (
    <form action={doLogout}>
        <button type="submit">Logout</button>
    </form>
  )
}

export default Logout