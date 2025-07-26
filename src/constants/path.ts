const PATH = {
  home: '',

  login: 'login',

  register: 'register',

  logout: 'logout',

  product: {
    detail: ':nameId'
  },

  cart: 'cart',

  user: {
    root: 'user',
    profile: 'profile',
    changePassword: 'change-password',
    purchaseHistory: 'purchase-history'
  },

  notFound: 'not-found/not-found'
} as const;

export default PATH;
