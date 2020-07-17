var firebaseConfig = {
  apiKey: "AIzaSyBr3yOu5VDq0OIQz1_hHK_xfwBCYB243q8",
  authDomain: "order-tracker-a1c7e.firebaseapp.com",
  databaseURL: "https://order-tracker-a1c7e.firebaseio.com",
  projectId: "order-tracker-a1c7e",
  storageBucket: "order-tracker-a1c7e.appspot.com",
  messagingSenderId: "886530519607",
  appId: "1:886530519607:web:7a4456301e2de1934085b2",
  measurementId: "G-5GDXKM29FR",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
//   firebase.analytics();

$("#new-order-btn").on("click", function (event) {
  let vendor = $("#vendor").val().trim();
  //   if ($("#cost").val().trim() === )
  let cost = $("#cost").val().trim();
  let date = $("#date-placed").val().trim();

  event.preventDefault();
  if (vendor === "") {
    alert("please enter the Vendor");
  } else if (isNaN(cost)) {
    alert("Cost must be a number");
  } else if (date === "") {
    alert("Please enter a date");
  } else {
    // console.log('vendor: ', vendor + '\n' + 'cost: ', cost + '\n' + 'date: ', date)

    let newOrder = {
      vendor,
      cost,
      date,
      complete: false,
    };
    console.log("newOrder: ", newOrder);
    database.ref().push(newOrder);

    //Eventually add 'window.location.reload();'
    $("#vendor").val("");
    $("#cost").val("");
    $("#date-placed").val("");
  }
});

$("#delete-btn").on("click", function () {
  // event.preventDefault();
  console.log("delete-btn was pressed");
  alert("Way to go!");
});

let orderArr = [];

window.addEventListener("load", function(){
    // addCost()
    
});

let addCost = () => {
    console.log('addCost orderArr: ', orderArr)
console.log(orderArr.length)
    
    // for (let i = 0; i < orderArr.length; i++) {
    //     const element = orderArr[i];
    //     console.log('element: ', element)
    // }
}



let retreive = () => {database.ref().on("child_added", function (childSnapshot,) {
  //   console.log('childSnapshot: ', childSnapshot);



  orderArr.push(childSnapshot.val());
//   console.log("orderArr: ", orderArr);

  let vendor = childSnapshot.val().vendor;
  let cost = childSnapshot.val().cost;
  let orderDate = childSnapshot.val().date;

  let newOrderInfo = $("<tr>").append(
    $("<td>").text(vendor),
    $("<td>").text(cost),
    $("<td>").text(orderDate),
    $(
      '<button key="' + orderDate + '" id="delete-btn" class="btn btn-primary">'
    ).text("delete")
  );
  console.log("newOrderInfo:", newOrderInfo);
  $("#open-orders > tbody").append(newOrderInfo);
  addCost()
})};

retreive()