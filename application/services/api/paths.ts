export const paths = {
  register: '/api/register',
  confirm: '/api/confirm',
  login: '/api/login',
  me: '/api/me',
  user: {
    list: '/api/users',
    create: '/api/users',
    detail: (id?: number | string | null) => `/api/users/${id || ':id'}`,
    update: (id?: number | string | null) => `/api/users/${id || ':id'}`,
    delete: (id?: number | string | null) => `/api/users/${id || ':id'}`,
  }
};
