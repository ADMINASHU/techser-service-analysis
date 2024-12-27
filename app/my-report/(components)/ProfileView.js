import React from "react";
import style from "../report.module.css";
import Image from "next/image";

const ProfileView = ({ userProfile, loggedUser }) => {
  return (
    <div className={style.profileViewCard}>
      <div className={`${style.part} ${style.part1}`}>
        <Image
          src={`/${loggedUser.picture}`}
          alt="profile"
          width={150}
          height={150}
          className={style.profileImage}
        />
        <div className={style.profileDetails}>
          <h2>
            {loggedUser.fName && loggedUser.eName
              ? `${loggedUser.fName} ${loggedUser.eName}`
              : userProfile?.NAME}
          </h2>
          <h4>{loggedUser.designation || userProfile?.DESIGNATION}</h4>
        </div>
      </div>
      <div className={`${style.part} ${style.part2}`}>
        <div className={style.profileDetail}>
          <span className={style.label}>User ID:</span>
          <span className={style.value}>{loggedUser.userID}</span>
        </div>
        <div className={style.profileDetail}>
          <span className={style.label}>Role:</span>
          <span className={style.value}>{loggedUser.isAdmin ? "Admin" : "User"}</span>
        </div>
        <div className={style.profileDetail}>
          <span className={style.label}>Account Type:</span>
          <span className={style.value}>{`Level ${loggedUser.level}`}</span>
        </div>
        <div className={style.profileDetail}>
          <span className={style.label}>Phone:</span>
          <span className={style.value}>{loggedUser.phone || userProfile?.PHONENO}</span>
        </div>
        <div className={style.profileDetail}>
          <span className={style.label}>Email:</span>
          <span className={style.value}>{loggedUser.email || userProfile?.EMAIL}</span>
        </div>

        <div className={style.profileDetail}>
          <span className={style.label}>Branch:</span>
          <span className={style.value}>{userProfile?.BRANCH}</span>
        </div>
        <div className={style.profileDetail}>
          <span className={style.label}>Region:</span>
          <span className={style.value}>{userProfile?.REGION}</span>
        </div>
      </div>
      {userProfile && (
        <div className={`${style.part} ${style.part3}`}>
          <div className={style.profileDetail}>
            <span className={style.label}>Work Location:</span>
            <span className={style.value}>{userProfile?.WORKLOCATION}</span>
          </div>
          <div className={style.profileDetail}>
            <span className={style.label}>Address:</span>
            <span className={style.value}>{userProfile?.ADDRESS}</span>
          </div>
          <div className={style.profileDetail}>
            <span className={style.label}>District:</span>
            <span className={style.value}>{userProfile?.DISTRICT}</span>
          </div>
          <div className={style.profileDetail}>
            <span className={style.label}>State:</span>
            <span className={style.value}>{userProfile?.STATE}</span>
          </div>
          <div className={style.profileDetail}>
            <span className={style.label}>Pin Code:</span>
            <span className={style.value}>{userProfile?.PINCODE}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
