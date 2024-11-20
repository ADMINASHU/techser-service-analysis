
import { doLogout } from '@/app/action'
import styles from "./Logout.module.css";
const Logout = () => {

  return (
    <form action={doLogout}>
        <button className={styles.logoutButton} type="submit">Logout</button>
    </form>
  )
}

export default Logout