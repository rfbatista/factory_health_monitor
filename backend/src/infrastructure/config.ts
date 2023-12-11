export const appConfig = {
  env: process.env.NODE_ENV,
  auth: {
    passwordSalt: process.env.PASSWORD_SALT || "",
    accessTokenKey: process.env.ACCESS_TOKEN_KEY || "",
    refreshTokenKey: process.env.REFRESH_TOKEN_KEY || "",
    identityTokenKey: process.env.IDENTITY_TOKEN_KEY || "",
    accessTokenExpiration: "2h",
    refreshTokenExpiration: "3h",
    identityTokenExpiration: "2h",
  },
};
