const users = [
  {
    userID: "user1",
    password: "asdf",
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
