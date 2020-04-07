export const BASE_API_URL =  process.env.NODE_ENV === 'production'
  ? 'https://tisn.herokuapp.com/api'
  : 'http://localhost:9000/api';
