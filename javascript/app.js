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

let totalCost = [];
let orderArr = [];
let taxableArr = [];

$("#new-order-btn").on("click", function (event) {
  let vendor = $("#vendor").val().trim();
  let cost = $("#cost").val().trim();
  let date = $("#datepicker").val().trim();
  let tax = $("#taxOption").val().trim();

  event.preventDefault();
  if (vendor === "") {
    alert("please enter the vendor");
  } else if (cost === "") {
    alert("Please enter the cost");
  } else if (isNaN(cost)) {
    alert("Cost must be a number");
  } else if (date === "") {
    alert("Please enter a date");
  } else {

    let newOrder = {
      vendor,
      cost,
      date,
      complete: false,
      tax,
    };

    database.ref().push(newOrder);

    window.location.reload();
  }
});

// Date Picker
$(function () {
  $("#datepicker").datepicker().attr("autocomplete", "off");
  $("#anim").on("change", function () {
    $("#datepicker").datepicker("option", "showAnim", $(this).val());
  });
});

let addCost = (array) => {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  $("#totalCostDisp").text("$" + sum);
};

let calcTax = (array) => {
  let sum = 0;
  let taxPer = 0.56;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let taxAmount = (sum * taxPer).toFixed(2);
  $("#totalTaxDisp").text("$" + taxAmount);
};

let completeBtn = (id) => {
  $("#" + id + "").on("click", function () {
    database.ref(id).update({
      complete: true,
    });
    window.location.reload();
  });
};

let removeBtn = (id) => {
  $("#" + id + "").on("click", function () {
    database.ref(id).remove()
    window.location.reload();
  });
};

let deleteBtn = (id) => {
  $("#" + id + "").on("click", function () {
    database.ref(id).update({
      complete: false,
    });
    window.location.reload();
  });
};

let retreive = () => {
  database.ref().on("child_added", function (childSnapshot) {
    orderArr.push(childSnapshot.val());

    let vendor = childSnapshot.val().vendor;
    let cost = childSnapshot.val().cost;
    let orderDate = childSnapshot.val().date;
    let itemKey = childSnapshot.key;
    let taxStat = childSnapshot.val().tax;

    if (childSnapshot.val().complete === false) {
      totalCost.push(parseInt(cost));
      }
   
    addCost(totalCost);

    if (childSnapshot.val().tax === "Taxable" && childSnapshot.val().complete === false) {
      taxableArr.push(parseInt(cost));
    }
   
    if (childSnapshot.val().complete == false) {

      let newOrderInfo = $("<tr>").append(
        $("<td>").text(vendor),
        $("<td>").text("$" + cost),
        $("<td>").text(orderDate),
        $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow('d')),
        $("<td>").text(taxStat),
        $(
          '<button key="' +
            itemKey +
            '" id="' +
            itemKey +
            '" class="btn btn-primary delete-btn">'
        ).text("Complete")
      );

      $("#open-orders > tbody").append(newOrderInfo);

      completeBtn(itemKey);
    } else if (childSnapshot.val().complete == true) {
      let closedOrderInfo = $("<tr>").append(
        $("<td>").text(vendor),
        $("<td>").text("$" + cost),
        $("<td>").text(orderDate),
        $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow()),
        $("<td>").text(taxStat),
        $(
          '<button key="' +
            orderDate +
            '" id="' +
            itemKey +
            '" class="btn btn-primary delete-btn">'
        ).text("delete")
      );
      $("#closed-orders > tbody").append(closedOrderInfo);

      deleteBtn(itemKey);
    }
    calcTax(taxableArr);
  });
};

retreive();

