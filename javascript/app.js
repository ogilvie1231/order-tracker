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
    // console.log('vendor: ', vendor + '\n' + 'cost: ', cost + '\n' + 'date: ', date)

    let newOrder = {
      vendor,
      cost,
      date,
      complete: false,
      tax,
    };

    database.ref().push(newOrder);

    window.location.reload();
    // $("#vendor").val("");
    // $("#cost").val("");
    // $("#datepicker").val("");
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
  // console.log("addCost sum: ", sum);
  $("#totalCostDisp").text("$" + sum);
};

let calcTax = (array) => {
  let sum = 0;
  let taxPer = 0.56;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let taxAmount = (sum * taxPer).toFixed(2);
  console.log('sum: ', sum)
  console.log("calcTax tax amount: ", taxAmount);
  $("#totalTaxDisp").text("$" + taxAmount);
};

let completeBtn = (id) => {
  $("#" + id + "").on("click", function () {
    // database.ref(id).remove()
    database.ref(id).update({
      complete: true,
    });

    console.log("delete-btn was pressed");
    // alert("Way to go! finalId: " + id + " was pressed");
    window.location.reload();
  });
};

let deleteBtn = (id) => {
  $("#" + id + "").on("click", function () {
    // database.ref(id).remove()
    database.ref(id).update({
      complete: false,
    });

    console.log("delete-btn was pressed");
    // alert("Way to go! finalId: " + id + " was pressed");
    window.location.reload();
  });
};

let retreive = (cb) => {
  database.ref().on("child_added", function (childSnapshot) {
    console.log("childSnapshot.val(): ", childSnapshot.key);
    orderArr.push(childSnapshot.val());
    // console.log("orderArr: ", orderArr);

    let vendor = childSnapshot.val().vendor;
    let cost = childSnapshot.val().cost;
    let orderDate = childSnapshot.val().date;
    let itemKey = childSnapshot.key;
    let taxStat = childSnapshot.val().tax;

    if (childSnapshot.val().tax === "Taxable") {
      let cost = childSnapshot.val().cost
      let taxStat = (cost * .56).toFixed(2);
      // console.log('taxAmt: ', taxAmt)
    }
    
    
    if (childSnapshot.val().complete === false) {
      totalCost.push(parseInt(cost));
      }
   
    addCost(totalCost);

    // calcTax(taxableArr);

    if (childSnapshot.val().tax === "Taxable" && childSnapshot.val().complete === false) {
      taxableArr.push(parseInt(cost));
      console.log("taxableArr: ", taxableArr);
    }
   
    if (childSnapshot.val().complete == false) {
      // alert(childSnapshot.val().vendor + ' is false')

      let newOrderInfo = $("<tr>").append(
        $("<td>").text(vendor),
        $("<td>").text("$" + cost),
        $("<td>").text(orderDate),
        $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow()),
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
      // addCost(totalCost);
      cb;

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
      // console.log("closedOrderInfo:", closedOrderInfo);
      $("#closed-orders > tbody").append(closedOrderInfo);
      // addCost(totalCost);
      cb;

      deleteBtn(itemKey);
    }
    calcTax(taxableArr);
  });
  // deleteBtn(orderDate)
};

retreive();

let counterFunc = () => {
  let days = 0;
  setInterval(function () {
    // days++;
    // console.log('days: ', days)
    $("#timeCount").html(days++);
  }, 1000);
};
