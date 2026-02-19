export const environment = {
  production: true,
  jwtConstants: { key: process.env.JWT_SECRET },
  admin: {
    username: process.env.ADMIN_USER,
    password: process.env.ADMIN_PASSWORD,
  },
};
