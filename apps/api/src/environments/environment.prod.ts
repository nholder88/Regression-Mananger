export const environment = {
  production: true,
  jwtConstants: { key: process.env.JWT_CONSTANTS_KEY },
  admin: {
    username: process.env.ADMIN_TEST_USER,
    password: process.env.ADMIN_TEST_USERPASS,
  },
};
