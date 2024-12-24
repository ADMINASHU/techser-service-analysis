
import React, { useState } from "react";
import Image from "next/image";
import styles from "../../Dashboard.module.css";

const ProfileCard = ({ data, onClose, position }) => {
  const [expanded, setExpanded] = useState(false);
// console.log(data);

  if (!data || !data.account ) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ top: position.top, left: position.left }}>
        <button className={styles.closeButton} onClick={onClose}>
          X
        </button>
        <div className={styles.cardContent}>
          <div className={styles.cardHeader}>
              <Image
                src={`/${data.account.image}`} // Replace with actual image path
                alt="Profile Image"
                priority
                width={140}
                height={140} // Maintain a 4:3 ratio
                className={styles.profileImage}
              />
       
            <div className={styles.cardHeaderText}>
              <h2>{data.account.erName}</h2>
              <span>{data.account.erDesignation}</span>
              <div className={styles.cardLocation}>
                <span>{data.account.erBranch}</span>
                <span>{data.account.erRegion}</span>
              </div>
            </div>
          </div>
          <div className={styles.cardDetails}>
            <div className={styles.cardDetail}>
              <span className={styles.label}>Engineer ID:</span>
              <span className={styles.value}>{data.account.erID}</span>
            </div>
            <div className={styles.cardDetail}>
              <span className={styles.label}>Mobile:</span>
              <span className={styles.value}>{data.account.erMob}</span>
            </div>
            <div className={styles.cardDetail}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{data.account.erEmail}</span>
            </div>
            <div className={styles.cardDetail}>
              <span className={styles.label}>Work Location:</span>
              <span className={styles.value}>{data.account.erWorkLocation}</span>
            </div>
            {expanded && (
              <>
                <div className={styles.cardDetail}>
                  <span className={styles.label}>Address:</span>
                  <span className={styles.value}>{data.account.erAddress}</span>
                </div>
                <div className={styles.cardDetail}>
                  <span className={styles.label}>District:</span>
                  <span className={styles.value}>{data.account.erDistrict}</span>
                </div>
                <div className={styles.cardDetail}>
                  <span className={styles.label}>State:</span>
                  <span className={styles.value}>{data.account.erState}</span>
                </div>
                <div className={styles.cardDetail}>
                  <span className={styles.label}>Pincode:</span>
                  <span className={styles.value}>{data.account.erPincode}</span>
                </div>
              </>
            )}
          </div>
          <button className={styles.showMoreButton} onClick={() => setExpanded(!expanded)}>
            {expanded ? "Show Less" : "Show More"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
