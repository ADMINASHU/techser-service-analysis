"use client";
import React, { useContext } from "react";
import { useState, useEffect } from "react";
import { regionList } from "@/lib/regions";
import axios from "axios";
import Swal from "sweetalert2";
import styles from "./Profile.module.css";
import Image from "next/image";
import DataContext from "@/context/DataContext";

const Profile = ({ LoggedUserID }) => {
  const [profile, setProfile] = useState({});
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [formData, setFormData] = useState({
    fName: "",
    eName: "",
    email: "",
    image: "",
    designation: "",
    region: "",
    branch: "",
    mobileNo: "",
    level: "",
    userID: "",
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
    const fetchProfile = async () => {
      try {
        const response = await axios.post("/api/profile", { userID: LoggedUserID });
        setProfile(response.data.user);
      } catch (error) {
        // console.error(error);
        Swal.fire({
          title: "Error!",
          text: error.response?.data.message || "Failed to fetch profile.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };
    fetchProfile();
  }, [image, LoggedUserID, setProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        fName: profile.fName || "",
        eName: profile.eName || "",
        email: profile.email || "",
        image: profile.image || "",
        designation: profile.designation || "",
        region: profile.region || "",
        branch: profile.branch || "",
        mobileNo: profile.mobileNo || "",
        level: profile.level || "",
        userID: profile.userID || "",
        verified: profile.verified || false,
      });
    }
  }, [profile, image]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = async () => {
    if (!image) return;
    setFormData({ ...formData, image: `${LoggedUserID}_${image.name}` });
    const form = new FormData();
    form.set("file", image);
    form.set("id", LoggedUserID);
    const res = await axios.post("/api/avatar", form);
    if (res.data.success) {
      Swal.fire({
        title: "Success!",
        text: "Image uploaded successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    }
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
      Swal.fire({
        title: "Error!",
        text: error.response?.data.message || "Failed to update profile.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw new Error(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword } = e.target.elements;
    try {
      const response = await axios.post("/api/change-password", {
        userID: formData.userID,
        currentPassword: currentPassword.value,
        newPassword: newPassword.value,
      });
      Swal.fire({
        title: "Success!",
        text: response.data.message || "Password update successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      e.target.reset();
      setResetMode(false);
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data.message || "Failed to update password.",
        icon: "error",
        confirmButtonText: "OK",
      });
      throw new Error(error.message);
    }
  };

  return (
    <div className={styles.profile}>
      <div className={styles.page}>
        {/* <h1 className={styles.title}>Profile Page</h1> */}
        <div className={styles.container}>
          <div className={styles.fContainer} style={editMode ? { marginTop: "15px" } : {}}>
            {editMode ? (
              <div className={styles.field}>
                <input
                  className={styles.input}
                  type="file"
                  name="file"
                  onChange={(e) => setImage(e.target.files?.[0])}
                  disabled={!editMode}
                />
                <button
                  className={styles.input}
                  style={{
                    backgroundColor: "#0070f3",
                    color: "white",
                    marginTop: "35px",
                    padding: "8px",

                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                  }}
                  onClick={handleUpload}
                  disabled={!editMode}
                >
                  Upload
                </button>
              </div>
            ) : profile.image ? (
              <Image
                height={163}
                width={140}
                src={`/${profile.image}`}
                alt="Profile Image"
                priority
              />
            ) : (
              <Image height={163} width={140} src="/user.png" alt="Default Image" priority />
            )}

            <div className={styles.field}>
              <div
                className={styles.input}
                style={
                  editMode
                    ? formData.verified
                      ? {
                          marginTop: "15px",
                          backgroundColor: "green",
                          color: "white",
                          textAlign: "center",
                        }
                      : {
                          marginTop: "15px",
                          backgroundColor: "red",
                          color: "white",
                          textAlign: "center",
                        }
                    : formData.verified
                    ? { backgroundColor: "green", color: "white", textAlign: "center" }
                    : { backgroundColor: "red", color: "white", textAlign: "center" }
                }
              >
                {formData.verified ? "Verified" : "Blocked"}
              </div>
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
              <select
                className={styles.input}
                name="region"
                value={formData.region}
                onChange={handleChange}
                disabled={!editMode}
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
              <select
                className={styles.input}
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                disabled={!editMode}
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
          {!editMode && !resetMode && (
            <button
              className={`${styles.button} ${styles.resetButton}`}
              onClick={() => setResetMode((prevMode) => !prevMode)} // Updated to use prevMode for toggling
            >
              Change Password
            </button>
          )}
          {editMode ? (
            <div className={styles.formButtonContainer}>
              <button
                className={`${styles.button} ${styles.cancelButton}`}
                onClick={() => {
                  setEditMode(false);
                }}
              >
                Close
              </button>
              <button
                className={`${styles.button} ${styles.saveButton}`}
                onClick={() => {
                  setEditMode(false);
                  handleSave();
                }}
              >
                Save
              </button>
            </div>
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
      {resetMode && (
        <div className={styles.page}>
          <div className={styles.resetPasswordContainer}>
            <div
              style={{
                color: " #dc3545",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "25px",
              }}
            >
              <h2>Change Password</h2>
            </div>
            <form onSubmit={handleResetPassword}>
              <div className={styles.field}>
                <label className={styles.label}>Current Password:</label>
                <input className={styles.input} type="password" name="currentPassword" required />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>New Password:</label>
                <input className={styles.input} type="password" name="newPassword" required />
              </div>
              <div className={styles.changePassButtonContainer}>
                <button
                  className={`${styles.button} ${styles.cancelButton}`}
                  onClick={() => setResetMode((prevMode) => !prevMode)}
                >
                  Close
                </button>
                <button className={`${styles.button} ${styles.saveButton}`} type="submit">
                  Save
                </button>
                
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
