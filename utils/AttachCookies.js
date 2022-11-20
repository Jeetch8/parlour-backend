exports.attachCookiesToResp = (res, key, value) => {
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie(key, value, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    sameSite: "none",
    secure: true,
  });
};

exports.logoutClearCookie = (res, value) => {
  res.cookie(value, "logout", {
    expires: new Date(Date.now()),
    sameSite: "none",
    secure: true,
    httpOnly: true,
  });
};
