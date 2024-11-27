"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Profile.module.css";

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
      // console.log(response.data.user);
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
    <div className={styles.container}>
      <div className={styles.fContainer}>
        <div className={styles.field}>
          <label className={styles.label}>Image:</label>
          <input
            className={styles.input}
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Verified:</label>
          <input
            className={styles.input}
            type="checkbox"
            name="verified"
            checked={formData.verified}
            disabled
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
            name="fname"
            value={formData.fname}
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
      {/* <div className={styles.tcontainer}>
        <h1 className={styles.title}>Profile Page</h1>
        {editMode ? (
          <button
            className={`${styles.button} ${styles.cancelButton}`}
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>
        ) : (
          <button
            className={`${styles.button} ${styles.editButton}`}
            onClick={() => setEditMode(true)}
          >
            Edit
          </button>
        )}
        <div className={styles.field}>
          <label className={styles.label}>Image:</label>
          <input
            className={styles.input}
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            disabled={!editMode}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Name:</label>
          <input
            className={styles.input}
            type="text"
            name="name"
            value={formData.name}
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
        <div className={styles.field}>
          <label className={styles.label}>Verified:</label>
          <input
            className={styles.input}
            type="checkbox"
            name="verified"
            checked={formData.verified}
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
        {editMode && (
          <div className={styles.buttonContainer}>
            <button className={`${styles.button} ${styles.saveButton}`} onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Profile;
