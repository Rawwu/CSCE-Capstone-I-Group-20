const awsExports = {
  Auth: {
    region: 'us-east-2',
    userPoolId: 'us-east-2_U0diJv929',
    userPoolWebClientId: '69g0o5hvmc78i0olmmktooho42',
    mandatorySignIn: false, // This is optional, depending on app's needs
    authenticationFlowType: 'USER_SRP_AUTH', // If using standard authentication with Cognito
  },
  oauth: {
    domain: '', // Leave it empty if not using OAuth
    scope: [],
    redirectSignIn: '',
    redirectSignOut: '',
    responseType: 'code', // Optional, but set to 'code' if using Authorization Code Flow
  }
};

export default awsExports;
