(function () {
    let redirect = "file:///Users/alexogilvie/Desktop/order-tracker/login.html"
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      var token = user.token;
      console.log('user: ', user)
      $("#login").hide();
      console.log("user: ", displayName);
    } else if (window.location.href !== redirect) {
      
      
    //   window.location="Login.html";
      console.log("user: ", displayName);
      window.location.replace("login.html");
    } else {

        $("#login").hide();
    }
  });
})();

const logoutBtn = () => {
  $("#logout").on("click", function (event) {
    firebase.auth().signOut();
    console.log("logout Button");
  });
};
logoutBtn();
