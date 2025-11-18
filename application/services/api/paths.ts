type QueryParams = Record<string, string | number | boolean>;

const buildQueryString = (params: QueryParams | undefined): string => {
  if (!params) {
    return '';
  }

  const queryString = Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(`${value}`)}`)
    .join('&');
  return queryString ? `?${queryString}` : '';
};

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
    createSavings: '/api/accounts/savings',
    detail: (id?: number | string | null) => `/api/accounts/${id || ':id'}`,
    update: (id?: number | string | null) => `/api/accounts/${id || ':id'}`,
    delete: (id?: number | string | null) => `/api/accounts/${id || ':id'}`,
    operations: (id?: number | string | null) => `/api/accounts/${id || ':id'}/operations`,
  },
  operation: {
    create: '/api/operations',
  },
  setting: {
    list: '/api/settings',
    upsert: '/api/settings',
  },
  stock: {
    list: (params: QueryParams | undefined = undefined) => `/api/stocks${buildQueryString(params)}`,
    create: '/api/stocks',
    update: (id?: number | string | null) => `/api/stocks/${id || ':id'}`,
  },
};

