import { signOut } from "@/auth";
import styles from "./Logout.module.css";
const Logout = () => {
  return (
    <form action={signOut()}>
      <button className={styles.logoutButton} type="submit">
        Logout
      </button>
    </form>
  );
};

export default Logout;
