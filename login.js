// var firebaseConfig = {
//     apiKey: "AIzaSyBr3yOu5VDq0OIQz1_hHK_xfwBCYB243q8",
//     authDomain: "order-tracker-a1c7e.firebaseapp.com",
//     databaseURL: "https://order-tracker-a1c7e.firebaseio.com",
//     projectId: "order-tracker-a1c7e",
//     storageBucket: "order-tracker-a1c7e.appspot.com",
//     messagingSenderId: "886530519607",
//     appId: "1:886530519607:web:7a4456301e2de1934085b2",
//     measurementId: "G-5GDXKM29FR",
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);

  
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
          }
    ],
    // Other config options...
  });

  var uiConfig = {
    callbacks: {
      signInSuccessWithAuthResult: function(authResult, redirectUrl) {
        // User successfully signed in.
        // Return type determines whether we continue the redirect automatically
        // or whether we leave that to developer to handle.
        return true;
      },
      uiShown: function() {
        // The widget is rendered.
        // Hide the loader.
        document.getElementById('loader').style.display = 'none';
      }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    signInSuccessUrl: 'index.html',
    signInOptions: [
      // Leave the lines as is for the providers you want to offer your users.
    //   firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    //   firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    //   firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    //   firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //   firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ],
    // Terms of service url.
    tosUrl: 'index.html',
    // Privacy policy url.
    privacyPolicyUrl: 'index.html'
  };

  ui.start('#firebaseui-auth-container', uiConfig);


//   if (ui.isPendingRedirect()) {
//     ui.start('#firebaseui-auth-container', uiConfig);
//   }
//   // This can also be done via:
//   if ((firebase.auth().isSignInWithEmailLink(window.location.href)) {
//     ui.start('#firebaseui-auth-container', uiConfig);
//   }