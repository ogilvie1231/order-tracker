(function () {
  let redirectLocal =
    "file:///Users/alexogilvie/Desktop/order-tracker/index.html";
  let redirectNetwork = "file:///Volumes/order-tracker/index.html";
  let redirectlive = "https://ogilvie1231.github.io/order-tracker/index.html";
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
      //   var token = auth;
      console.log("uid: ", uid, "\n", "token: ");
      $("#login").hide();
      console.log("user: ", displayName);
    } else if (
      window.location.href === redirectLocal ||
      window.location.href === redirectNetwork ||
      window.location.href === redirectlive
    ) {
      console.log("user: ", displayName);
      window.location.replace("login.html");
    }
    //  else if (window.location.href !== redirectNetwork ) {
    //   window.location.replace("login.html");
    // }
    else {
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
