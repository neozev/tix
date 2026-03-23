export const dbConf = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'tix_db',
  user: process.env.DB_USER || 'tix_user',
  password: process.env.DB_PASSWORD || 'tix_password'
};
