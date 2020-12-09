module.exports = {
  azure: {
    endpoint: 'https://tweeeri.documents.azure.com:443/',
    key:
      'RkOrXapeXNN9YOG3Cpkhmo4c3rpbxnkBMYXWaaQx3ZabQfnjYxvEGmaWXrGJhOSX1zItUm7j56T6PfLdGnQXPA==',
    database: {
      id: 'Wishlist'
    },
    containers: [
      {
        id: 'USERS',
        path: '/User'
      },
      {
        id: 'GROUPS',
        path: '/Group'
      },
      {
        id: 'WISHLISTS',
        path: '/Wishlist'
      },
      {
        id: 'NOTIFICATIONS',
        path: '/Notification'
      }
    ]
  }
};
