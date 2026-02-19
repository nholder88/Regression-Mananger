export const environment = {
  production: false,
  jwtConstants: { key: process.env.JWT_SECRET ?? 'devTesting' },
  admin: {
    username: process.env.ADMIN_USER ?? 'testUser',
    password: process.env.ADMIN_PASSWORD ?? 'SuperSecret!',
  },
};
