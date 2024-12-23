"use client";
import axios from "axios";
import React, { useState, useEffect } from "react";


const Seusers = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userResponse = await axios.get("/api/se-users");
        setUsers(userResponse.data.users);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>{users && JSON.stringify(users)}</div>
  )
}

export default Seusers

