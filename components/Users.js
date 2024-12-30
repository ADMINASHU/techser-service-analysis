"use client";
import React, { useContext } from "react";
import { useEffect, useState } from "react";
import { regionList } from "@/lib/regions";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Users.module.css";
import Image from "next/image";
import DataContext from "@/context/DataContext";

const Users = ({ LoggedUserLevel, LoggedUser }) => {
  const [users, setUsers] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editFormVisible, setEditFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    userID: "",
    fName: "",
    eName: "",
    email: "",
    image: "",
    mobileNo: "",
    designation: "",
    branch: "",
    region: "",
    level: "",
    verified: false,
  });

  const { processedData } = useContext(DataContext);

  const filteredBranches = !formData.region
    ? Array.from(new Set(processedData.map((row) => row.branch)))
    : Array.from(
        new Set(
          processedData.filter((row) => row.region === formData.region).map((row) => row.branch)
        )
      );
      
  useEffect(() => {
    const newLevels = Array.from({ length: 4 }, (_, i) => i + 1).filter(
      (level) => level >= LoggedUserLevel
    );
    setLevels(newLevels);
    fetchUsers();
  }, [LoggedUserLevel]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data.users);
    } catch (error) {
      // console.error(error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data.message || "Failed to fetch user.",
        icon: "error",
        confirmButtonText: "OK",
      });
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

  const handleEdit = (user) => {
    setFormData(user);
    setEditFormVisible(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put("/api/profile", formData);
      Swal.fire({
        title: "Success!",
        text: response.data.message || "Profile updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setEditFormVisible(false);
      fetchUsers();
    } catch (error) {
      // console.error(error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data.message || "Failed to update profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const handleClose = () => {
    setEditFormVisible(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>Users</h1> */}
      {editFormVisible && (
        <div className={styles.modalOverlay}>
          <div className={styles.page}>
            <div className={styles.eContainer}>
              <div className={styles.fContainer}>
                {formData.image ? (
                  <Image
                    height={170}
                    width={140}
                    src={`/${formData.image}`}
                    alt="/user.png"
                    priority
                  />
                ) : (
                  <Image
                    height={170}
                    width={140}
                    src="/user.png"
                    alt="Default Image"
                    priority
                  />
                )}

                <div className={styles.field}>
                  <button
                    className={styles.input}
                    style={
                      formData.verified
                        ? {
                            cursor: "pointer",
                            backgroundColor: "green",
                            color: "white",
                            textAlign: "center",
                          }
                        : {
                            cursor: "pointer",
                            backgroundColor: "red",
                            color: "white",
                            textAlign: "center",
                          }
                    }
                    onClick={() => setFormData({ ...formData, verified: !formData.verified })}
                  >
                    {formData.verified ? "Verified" : " Blocked"}
                  </button>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Designation:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className={styles.sContainer}>
                <div className={styles.field}>
                  <label className={styles.label}>First Name:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="fName"
                    value={formData.fName}
                    readOnly
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>UserID:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="userID"
                    value={formData.userID}
                    readOnly
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Mobile No:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="mobileNo"
                    value={formData.mobileNo}
                    readOnly
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Region:</label>
                  <select
                    className={styles.input}
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                  >
                    <option value="">Select Region</option>
                    {regionList.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.tContainer}>
                <div className={styles.field}>
                  <label className={styles.label}>Last Name:</label>
                  <input
                    className={styles.input}
                    type="text"
                    name="eName"
                    value={formData.eName}
                    readOnly
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Level:</label>

                  <select
                    className={styles.input}
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                  >
                    {levels.map((level) => (
                      <option key={level} value={level}>
                        Level {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Email:</label>
                  <input
                    className={styles.input}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Branch:</label>
                  <select
                    className={styles.input}
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                  >
                    <option value="">Select Branch</option>
                    {filteredBranches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.buttonContainer}>
              <button onClick={handleClose} className={`${styles.button} ${styles.cancelButton}`}>
                Close
              </button>
              <button onClick={handleSave} className={`${styles.button} ${styles.saveButton}`}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={styles.tableWrapper}>
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
            {users?.map((user, index) => (
              <tr key={user.userID}>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {index + 1}
                </td>
                <td>{user.userID}</td>
                <td>{`${user?.fName || ""} ${user?.eName || ""}`}</td>
                <td>{user.email}</td>
                <td>{user.mobileNo}</td>
                <td>{user.designation}</td>
                <td>{user.branch}</td>
                <td>{user.region}</td>
                <td>Level {user.level}</td>
                <td
                  style={
                    user.verified
                      ? {
                          color: "green",
                          textAlign: "center",
                        }
                      : {
                          color: "red",
                          textAlign: "center",
                        }
                  }
                >
                  {user.verified ? "Verified" : "Blocked"}
                </td>
                <td>
                  {user.level >= LoggedUserLevel && user._id !== LoggedUser.sub && (
                    <div className={styles.button}>
                      <button className={styles.editButton} onClick={() => handleEdit(user)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="purple"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 20h9"></path>
                          <path d="M14.5 4.5a2.12 2.12 0 0 1 3 0l1.5 1.5a2.12 2.12 0 0 1 0 3L7 19l-4 4-1-4L14.5 4.5z"></path>
                          <path d="M18 2l4 4"></path>
                          <path d="M2 21l1 1"></path>
                        </svg>
                      </button>

                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(user.userID)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="24"
                          height="24"
                          fill="none"
                          stroke="red"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6l-2 14H7L5 6"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                          <path d="M15 4l-1-1H10L9 4H4v2h16V4h-5z"></path>
                        </svg>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
