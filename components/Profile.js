"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Profile.module.css";
import Image from "next/image";

const Profile = ({ LoggedUserID }) => {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  useEffect(() => {
    fetchProfile();
  }, []);
  useEffect(() => {
    if (profile) {
      setFormData({
        ...formData,
        fName: profile.fName,
        eName: profile.eName,
        email: profile.email,
        image: profile.image,
        designation: profile.designation,
        region: profile.region,
        branch: profile.branch,
        mobileNo: profile.mobileNo,
        level: profile.level,
        userID: profile.userID,
        verified: profile.verified,
      });
    }
  }, [profile]);

  const fetchProfile = async () => {
    try {
      const response = await axios.post("/api/profile", { userID: LoggedUserID });
      console.log(response.data.user);
      setProfile(response.data.user);
    } catch (error) {
      console.error(error);
    }
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
      setEditMode(false);
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data.message || "Failed to update profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Profile Page</h1>
      <div className={styles.container}>
        <div className={styles.fContainer}>
          {editMode ? (
            <div className={styles.field}>
              <input
                className={styles.input}
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                disabled={!editMode}
              />
            </div>
          ) : (
            <Image height={170} width={170} src="/user.png" alt="/user.png" />
          )}

          <div className={styles.field}>
            <input
              className={styles.input}
              value={formData.verified ? "Verified" : "Not Verified"}
              disabled
              readOnly
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Designation:</label>
            <input
              className={styles.input}
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              disabled={!editMode}
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
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>UserID:</label>
            <input
              className={styles.input}
              type="text"
              name="userID"
              value={formData.userID}
              disabled
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Mobile No:</label>
            <input
              className={styles.input}
              type="text"
              name="mobileNo"
              value={formData.mobileNo}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Region:</label>
            <input
              className={styles.input}
              type="text"
              name="region"
              value={formData.region}
              onChange={handleChange}
              disabled={!editMode}
            />
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
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Level:</label>
            <input
              className={styles.input}
              type="number"
              name="level"
              value={formData.level}
              disabled
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Email:</label>
            <input
              className={styles.input}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Branch:</label>
            <input
              className={styles.input}
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              disabled={!editMode}
            />
          </div>
        </div>
      </div>
      <div className={styles.buttonContainer}>
        {editMode ? (
          <button
            className={`${styles.button} ${styles.saveButton}`}
            onClick={() => {
              setEditMode(false);
              handleSave();
            }}
          >
            Save
          </button>
        ) : (
          <button
            className={`${styles.button} ${styles.editButton}`}
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
