export default {
  port: 3000,
  dbUri: 'mongodb://localhost:27017/biblioteka',
  JWT_ACCESS_SECRET: 'jwt_secret_1',
  JWT_ACCESS_EXPIRY: '1h',
  JWT_REFRESH_SECRET: 'jwt_secret_2',
  JWT_REFRESH_EXPIRY: '7d',
  page_limit: 10,
};
