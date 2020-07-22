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
  let cost = $("#cost").val().trim();
  let date = $("#datepicker").val().trim();

  event.preventDefault();
  if (vendor === "") {
    alert("please enter the vendor");
  } else if (cost === "")  {
    alert("Please enter the cost");
  } else if (isNaN(cost)){
    alert('Cost must be a number')
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
    $("#datepicker").val("");
  }
});



$( function() {
    $( "#datepicker" ).datepicker().attr("autocomplete", "off");
    $( "#anim" ).on( "change", function() {
      $( "#datepicker" ).datepicker( "option", "showAnim", $( this ).val() );
    });
  } );

window.onload = function() {
    $("#delete-btn").on("click", function () {
        // event.preventDefault();
        console.log("delete-btn was pressed");
        alert("Way to go!");
      });
  };
// $(document).ready(function() {
//     $("#delete-btn").on("click", function () {
//         // event.preventDefault();
//         console.log("delete-btn was pressed");
//         alert("Way to go!");
//       });
// })

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
      console.log('childSnapshot.val: ', childSnapshot.val());

    orderArr.push(childSnapshot.val());
      console.log("orderArr: ", orderArr);

    let vendor = childSnapshot.val().vendor;
    let cost = childSnapshot.val().cost;
    let orderDate = childSnapshot.val().date;
    totalCost.push(parseInt(cost));
    // console.log('retreive "Cost:" ',typeof parseInt(cost))
    
    addCost(totalCost)

    let orderAge = moment("20200628", "MM/DD/YYYY").fromNow()
    // let orderAge = moment().diff(orderDate)
    console.log('orderAge: ', orderAge)

    let newOrderInfo = $("<tr>").append(
      $("<td>").text(vendor),
      $("<td>").text(cost),
      $("<td>").text(orderDate),
      $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow()),
    //   console.log('orderDate:', orderDate),
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

let counterFunc = () => {
    let days = 0
    setInterval(function () {
        // days++;
        // console.log('days: ', days)
        $("#timeCount").html(days++)
    }, 1000)
}
