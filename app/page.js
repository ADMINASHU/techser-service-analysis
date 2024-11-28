"use client";

import React, { useRef } from "react";
import styles from "./page.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";

const WelcomePage = () => {
  const swiperRef = useRef(null);

  const handleSlideClick = () => {
    swiperRef.current.swiper.slideNext();
  };

  return (
    <div className={styles.container}>
      <h1>Welcome to Our Application!</h1>
      <p>We&apos;re excited to have you here. Let&apos;s get you started with a quick overview.</p>

      <div className={styles.sliderContainer}>
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          modules={[Navigation, Pagination]}
          ref={swiperRef}
        >
          <SwiperSlide>
            <div className={styles.slide} onClick={() => handleSlideClick()}>
              <h2>Introduction</h2>
              <p>
                Welcome to our app! We&apos;re thrilled to have you here. Our features provide
                insights, dashboard view, user management, and control options to optimize your operations. Ready to
                start? Dive in and explore! 😊✨
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.slide} onClick={() => handleSlideClick()}>
              <h2>Dashboard Page</h2>
              <p>
                Our application offers a powerful dashboard system with four key types: Engineer,
                Branch, Region, and Customer. Each dashboard provides insights into various metrics,
                including Entry Call, New Call, Pending Call, Closed Call, Index, Accuracy, Visits
                Counts, Engineer&apos;s Point, Branch&apos;s Point, and Region&apos;s Point. These
                dashboards offer a clear and concise view of performance metrics, helping you manage
                and optimize operations effectively.
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.slide} onClick={() => handleSlideClick()}>
              <h2>Data Page</h2>
              <p>
                Our application includes a comprehensive score page that displays key information
                such as Complaint ID, Nature of Complaint, Register Date, Closed Date, Duration,
                Status, Engineer, Region, Branch, Month, Year, Is Pending, Engineer Point, Branch
                Point, and Region Point. This page is equipped with powerful filter options,
                allowing users to refine their views by year, month, region, branch, and more. These
                features ensure that users can easily track and analyze their performance metrics
                with precision.
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.slide} onClick={() => handleSlideClick()}>
              <h2>Users Page</h2>
              <p>
                Our application includes a robust user management page where authorized users can
                view, edit, and delete user details, as well as block and verify user profiles.
                Authorized users have comprehensive control over user profiles, which include
                information like user id, contact details, designation, profile status and access
                level. This functionality ensures efficient and secure management of user profiles
                across the organization.
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.slide} onClick={() => handleSlideClick()}>
              <h2>Control Page</h2>
              <p>
                Our application features a control page where authorized users can adjust point
                values based on the nature of calls—breakdown, installation, and preventive
                maintenance. Adjustments can be made for closed, pending, and new calls. This
                ensures the system remains adaptable and provides accurate performance tracking.
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.slide} onClick={() => handleSlideClick()}>
              <h2>Profile Page</h2>
              <p>
                Our application features a profile page where users can easily update their personal
                details such as image, name, email, mobile number, designation, branch, and region.
                This ensures accurate and relevant information within the system.
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className={styles.slide} onClick={() => handleSlideClick()}>
              <h2>Get Started</h2>
              <p>
                Ready to dive in? Let&apos;s get you started on your journey with our app. Explore
                dashboards, review performance metrics, manage user profiles, and adjust point
                values as needed. Happy exploring! 😊✨
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
};

export default WelcomePage;
