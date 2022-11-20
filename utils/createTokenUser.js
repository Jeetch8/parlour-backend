const createTokenUser = (user) => {
  return {
    name: user.name,
    userId: user._id,
    authorization: user.authorization,
  };
};

module.exports = createTokenUser;
