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
    detail: (id?: number | string | null) => `/api/users/${id || ':id'}`,
    update: (id?: number | string | null) => `/api/users/${id || ':id'}`,
    delete: (id?: number | string | null) => `/api/users/${id || ':id'}`,
    ban: (id?: number | string | null) => `/api/users/${id || ':id'}/ban`,
    unban: (id?: number | string | null) => `/api/users/${id || ':id'}/unban`,
  },
  account: {
    list: '/api/accounts',
    create: '/api/accounts',
    createSavings: '/api/accounts/savings',
    detail: (id?: number | string | null) => `/api/accounts/${id || ':id'}`,
    update: (id?: number | string | null) => `/api/accounts/${id || ':id'}`,
    delete: (id?: number | string | null) => `/api/accounts/${id || ':id'}`,
    operations: (id?: number | string | null) => `/api/accounts/${id || ':id'}/operations`,
  },
  operation: {
    create: '/api/operations',
  },
  setting: {
    list: '/api/settings',
    upsert: '/api/settings',
  },
  stock: {
    create: '/api/stocks',
    list: (params: QueryParams | undefined = undefined) => `/api/stocks${buildQueryString(params)}`,
    update: (id?: number | string | null) => `/api/stocks/${id || ':id'}`,
    purchaseBaseStock: (id?: number | string | null) => `/api/stocks/${id || ':id'}/purchase`,
  },
  stockOrder: {
    create: '/api/stock-orders',
    list: '/api/stock-orders',
    match: (id?: number | string | null) => `/api/stock-orders/${id || ':id'}/match`,
    accept: (id?: number | string | null) => `/api/stock-orders/${id || ':id'}/accept`,
    delete: (id?: number | string | null) => `/api/stock-orders/${id || ':id'}`,
  },
  financialSecurity: {
    list: '/api/financial-securities',
  },
  beneficiary: {
    create: '/api/beneficiaries',
    list: (params: QueryParams | undefined = undefined) => `/api/beneficiaries${buildQueryString(params)}`,
    update: (id?: number | string | null) => `/api/beneficiaries/${id || ':id'}`,
    delete: (id?: number | string | null) => `/api/beneficiaries/${id || ':id'}`,
  },
  bankCredit: {
    create: '/api/bank-credits',
    list: '/api/bank-credits',
    payments: (id?: number | string | null) => `/api/bank-credits/${id || ':id'}/payments`,
  },
  news: {
    create: '/api/news',
    list: (params: QueryParams | undefined = undefined) => `/api/news${buildQueryString(params)}`,
    detail: (id?: number | string | null) => `/api/news/${id || ':id'}`,
    update: (id?: number | string | null) => `/api/news/${id || ':id'}`,
    delete: (id?: number | string | null) => `/api/news/${id || ':id'}`,
  },
};

