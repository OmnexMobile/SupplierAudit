export default {
  oidc: {
    issuer: 'https://dev-32580895.okta.com/oauth2/default',
    clientId: '0oa8z8snh5jZs4NYd5d7',
    redirectUri: 'com.okta.dev-32580895:/callback',
    endSessionRedirectUri: 'com.okta.dev-32580895:/callback',
    discoveryUri: 'https://dev-32580895.okta.com',
    scopes: ['openid', 'profile', 'offline_access'],
    requireHardwareBackedKeyStore: false,
    httpReadTimeout: 10,
    customUriScheme: 'com.okta.dev-32580895',
  },
};
