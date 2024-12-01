export const PAYMENT = {
  API_PROPERTY: {
    CREATE: {
      SUMMARY: 'Creates a checkout payment register',
      DESC: 'Creates a checkout payment register attached to an order in database',
    },
    GET_BY_ID: {
      SUMMARY: 'Gets payment status by identifier',
      DESC: 'Fetches payment status from database register by identifier',
    },
    UPDATE_BY_ID: {
      SUMMARY: 'Updates payment register by identifier',
      DESC: 'Fetches updated data from third party API and updates existing payment register by identifier',
    },
    PAYMENT: {
      ID: {
        DESC: 'Payment identifier in database',
        EXAMPLE: '5671843b-324b-40ae-aaa8-a3b404013703',
      },
      VALUE: {
        DESC: 'Order value',
        EXAMPLE: 39.99,
      },
      METHOD: {
        DESC: 'Category in which the payment is registered',
        EXAMPLE: 'Pix',
      },
      STATUS: {
        DESC: 'Status in which the payment is',
        EXAMPLE: 'APROVADO',
      },
    },
  },
};
