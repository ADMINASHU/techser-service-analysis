import React from 'react';
import styles from "../../Dashboard.module.css";


const ProfileCard = ({ data, onClose, position }) => {
  if (!data) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.card} style={{ top: position.top, left: position.left }}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        <p className={styles.cardName}>Engineer: {data.engineer}</p>
        <p className={styles.cardRegion}>Region: {data.region}</p>
        <p className={styles.cardBranch}>Branch: {data.branch}</p>
        <p className={styles.cardEPoint}>E Point: {data.ePoint}</p>
        <p className={styles.cardScore}>Score: {data.index}</p>
        {/* Add more fields as needed */}
      </div>
    </div>
  );
};

export default ProfileCard;
