export const setAccessTokenCookie = (res, accessToken) => {
  res.cookie("access-token", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15m
  });
};

export const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000 * 24 * 7, // 7 days
  });
};
