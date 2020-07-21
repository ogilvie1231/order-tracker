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
  
    database.ref().push(newOrder);

    // window.location.reload();
    $("#vendor").val("");
    $("#cost").val("");
    $("#date-placed").val("");
  }
});

$(document).ready(function() {
    $("#delete-btn").on("click", function () {
        // event.preventDefault();
        console.log("delete-btn was pressed");
        alert("Way to go!");
      });
})

let totalCost = [];

let orderArr = [];

let addCost = (array) => {
let sum = 0;
for (let i = 0; i < array.length; i++) {
    sum += array[i];
}
console.log('addCost sum: ', sum)
$('#totalCostDisp').text("$" + sum)
};

let totalCostFun = () => {
  console.log("totalCost: ", totalCost);
};

let retreive = (cb) => {
  database.ref().on("child_added", function (childSnapshot) {
    //   console.log('childSnapshot: ', childSnapshot);

    orderArr.push(childSnapshot.val());
    //   console.log("orderArr: ", orderArr);

    let vendor = childSnapshot.val().vendor;
    let cost = childSnapshot.val().cost;
    let orderDate = childSnapshot.val().date;
    totalCost.push(parseInt(cost));
    // console.log('retreive "Cost:" ',typeof parseInt(cost))
    
    addCost(totalCost)

    let newOrderInfo = $("<tr>").append(
      $("<td>").text(vendor),
      $("<td>").text(cost),
      $("<td>").text(orderDate),
      $(
        '<button key="' +
          orderDate +
          '" id="delete-btn" class="btn btn-primary">'
      ).text("delete")
    );
    // console.log("newOrderInfo:", newOrderInfo);
    $("#open-orders > tbody").append(newOrderInfo);
    // addCost(totalCost);
    cb;
  });
};

retreive(totalCostFun());

// console.log('totalCost: ', totalCost)
