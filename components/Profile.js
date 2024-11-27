'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import styles from './Profile.module.css';

const Profile = ({user}) => {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: '',
    designation: '',
    region: '',
    branch: '',
    mobileNo: '',
    level: 4,
    userID: '',
    verified: false
  });

  useEffect(() => {
    if (user) {
      setFormData({
        ...formData,
        name: user.name,
        email: user.email,
        image: user.image,
        designation: user.designation,
        region: user.region,
        branch: user.branch,
        mobileNo: user.mobileNo,
        level: user.level,
        userID: user.userID,
        verified: user.verified
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put('/api/profile', formData);
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
      <h1 className={styles.title}>Profile Page</h1>
      {editMode ? (
        <button className={`${styles.button} ${styles.cancelButton}`} onClick={() => setEditMode(false)}>Cancel</button>
      ) : (
        <button className={`${styles.button} ${styles.editButton}`} onClick={() => setEditMode(true)}>Edit</button>
      )}
      <div className={styles.field}>
        <label className={styles.label}>Image:</label>
        <input className={styles.input} type="text" name="image" value={formData.image} onChange={handleChange} disabled={!editMode} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Name:</label>
        <input className={styles.input} type="text" name="name" value={formData.name} onChange={handleChange} disabled={!editMode} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>UserID:</label>
        <input className={styles.input} type="text" name="userID" value={formData.userID} disabled />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Email:</label>
        <input className={styles.input} type="email" name="email" value={formData.email} onChange={handleChange} disabled={!editMode} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Level:</label>
        <input className={styles.input} type="number" name="level" value={formData.level} disabled />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Designation:</label>
        <input className={styles.input} type="text" name="designation" value={formData.designation} onChange={handleChange} disabled={!editMode} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Region:</label>
        <input className={styles.input} type="text" name="region" value={formData.region} onChange={handleChange} disabled={!editMode} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Branch:</label>
        <input className={styles.input} type="text" name="branch" value={formData.branch} onChange={handleChange} disabled={!editMode} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Verified:</label>
        <input className={styles.input} type="checkbox" name="verified" checked={formData.verified} disabled />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Mobile No:</label>
        <input className={styles.input} type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} disabled={!editMode} />
      </div>
      {editMode && (
        <div className={styles.buttonContainer}>
          <button className={`${styles.button} ${styles.saveButton}`} onClick={handleSave}>Save</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
