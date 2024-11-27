"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Users.module.css";

const Users = ({ LoggedUserLevel }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (userID) => {
    try {
      const response = await axios.delete(`/api/users/${userID}`);
      Swal.fire({
        title: "Success!",
        text: response.data.message,
        icon: "success",
        confirmButtonText: "OK",
      });
      setUsers(users.filter((user) => user.userID !== userID));
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data.message || "Failed to delete user.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleEdit = (userID) => {
    // Redirect or show edit modal
  };

  // if (status === 'loading' || loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Users</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>S No</th>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile No</th>
            <th>Designation</th>
            <th>Branch</th>
            <th>Region</th>
            <th>Level</th>
            <th>Verified</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.userID}>
              <td>{index + 1}</td>
              <td>{user.userID}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobileNo}</td>
              <td>{user.designation}</td>
              <td>{user.branch}</td>
              <td>{user.region}</td>
              <td>{user.level}</td>
              <td>{user.verified ? "Yes" : "No"}</td>
              <td>
                {user.level > LoggedUserLevel && (
                  <div className={styles.button}>
                    <button className={styles.editButton} onClick={() => handleEdit(user.userID)}>
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => handleDelete(user.userID)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
