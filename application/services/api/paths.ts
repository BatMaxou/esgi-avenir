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
    ban: (id?: number | string | null) => `/api/users/${id || ':id'}/ban`,
    unban: (id?: number | string | null) => `/api/users/${id || ':id'}/unban`,
  },
  account: {
    list: '/api/accounts',
    create: '/api/accounts',
    detail: (id?: number | string | null) => `/api/accounts/${id || ':id'}`,
    update: (id?: number | string | null) => `/api/accounts/${id || ':id'}`,
    delete: (id?: number | string | null) => `/api/accounts/${id || ':id'}`,
    operations: (id?: number | string | null) => `/api/accounts/${id || ':id'}/operations`,
  },
  operation: {
    create: '/api/operations',
  },
};
