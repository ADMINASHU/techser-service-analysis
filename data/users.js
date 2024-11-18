const users = [
  {
    userID: "ADMINASHU",
    password: "a1234u",
  },
  {
    UserID: "user2",
    password: "4321",
  },
];
export const getUserByID = (id) => {
  const found = users.find((user) => user.userID === id);
  return found;
};
