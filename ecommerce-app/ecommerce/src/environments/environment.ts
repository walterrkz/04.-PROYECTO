declare const NG_APP_API_URL: string | undefined;

export const environment = {
  apiUrl: typeof NG_APP_API_URL !== 'undefined'
    ? NG_APP_API_URL
    : 'http://localhost:3000/api' // fallback para tests
};
