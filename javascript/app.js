var database = firebase.database();

let totalCost = [];
let taxPeriod = [];
let orderArr = [];
let openCostArr = [];
let completeCostArr = [];
let taxableArr = [];
let taxBatch = 0;
let fileUpload = {};
let orderUpload = {};
let url = "";
var storageRef = firebase.storage().ref();
var selectedFile;

$("#updateDiv").hide();
$("#eLoading").hide();
$("#eIsLoaded").hide();
$("#loading").hide();
$("#isLoaded").hide();
$("#closeAllButton").hide();
$("#selectAllBox").hide();

// $("#openSelect").hide();
// $(".checkBox").hide();
// $("#new-order-btn").hide();

$("#new-order-btn").on("click", function (event) {
  event.preventDefault();
  let vendor = $("#vendor").val().trim();
  let cost = $("#cost").val().trim();
  let date = $("#datepicker").val().trim();
  let tax = $("#taxOption").val().trim();

  if (vendor === "") {
    alert("please enter the vendor");
  } else if (cost === "") {
    alert("Please enter the cost");
  } else if (isNaN(cost)) {
    alert("Cost must be a number");
  } else if (date === "") {
    alert("Please enter a date");
  } 
  // else if (url === "") {
  //   alert("Wait for upload to complete");
  // }
   else {
    let newOrder = {
      vendor,
      cost,
      date,
      complete: "open",
      tax,
      url,
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

// Date Picker for updates
$(function () {
  $("#eDatepicker").datepicker().attr("autocomplete", "off");
  $("#anim").on("change", function () {
    $("#eDatepicker").datepicker("option", "showAnim", $(this).val());
  });
});

let addCost = (costArray) => {
  let sum = 0;
  for (let i = 0; i < costArray.length; i++) {
    sum += costArray[i];
  }
  let formatSum = sum.toLocaleString(undefined, { minimumFractionDigits: 2 });

  $("#totalCostDisp").text("$" + formatSum);
};
let addCost2 = (costArray, display) => {
  let sum = 0;
  for (let i = 0; i < costArray.length; i++) {
    sum += costArray[i];
  }
  let formatSum = sum.toLocaleString(undefined, { minimumFractionDigits: 2 });

  $("#" + display).text("$" + formatSum);
};

let addCostOpen = (array) => {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let formatSum = sum.toLocaleString(undefined, { minimumFractionDigits: 2 });

  $("#openCostDisp").text("$" + formatSum);
};

let addCostComplete = (array) => {
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let formatSum = sum.toLocaleString(undefined, { minimumFractionDigits: 2 });

  $("#completeCostDisp").text("$" + formatSum);
};

let calcTax = (array) => {
  let sum = 0;
  let taxPer = 0.56;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let taxAmount = sum * taxPer;
  let formatTax = taxAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
  $("#totalTaxDisp").text("      $" + formatTax + " ");
  taxBatch = taxAmount;
};

let updateBtn = (id) => {
  $("#updateBtn").on("click", function (event) {
    let vendor = $("#eVendor").val().trim();
    let cost = $("#eCost").val().trim();
    let date = $("#eDatepicker").val().trim();
    let tax = $("#eTaxOption").val().trim();
    $("#openHide").show();
    $("#completeHide").show();
    $("#taxHide").show();
    $("#closeHide").show();
    if (url) {
      database.ref(id).update({
        vendor,
        cost,
        date,
        tax,
        url,
      });
    } else {
      database.ref(id).update({
        vendor,
        cost,
        date,
        tax,
      });
    }
  });
};

let editBtn = (id, curVendor, curCost, curOrderDate, curTaxStat) => {
  $("#" + id + "e" + "").on("click", function () {
    $("#updateDiv").show();
    $("#eVendor").val(curVendor);
    $("#eCost").val(curCost);
    $("#eDatepicker").val(curOrderDate);
    $("#eTaxOption").val(curTaxStat);
    $("#openHide").hide();
    $("#completeHide").hide();
    $("#taxHide").hide();
    $("#closeHide").hide();

    updateBtn(id);
  });
};

let completeBtn = (id) => {
  $("#" + id + "c" + "").on("click", function () {
    database.ref(id).update({
      complete: "complete",
    });
    window.location.reload();
  });
};

let deleteBtn = (id) => {
  $("#" + id + "d" + "").on("click", function () {
    database.ref(id).remove();
    window.location.reload();
  });
};

let openBtn = (id) => {
  $("#" + id + "o" + "").on("click", function () {
    database.ref(id).update({
      complete: "open",
    });
    window.location.reload();
  });
};

let closeBtn = (id) => {
  $("#" + id + "f" + "").on("click", function () {
    database.ref(id).update({
      complete: "closed",
    });
    console.log("you did it");
    window.location.reload();
  });
};

let showBtn = () => {
  $("#editAllBtn").hide();
  $("#closeAllButton").show();
  $("#selectAllBox").show();
};

let taxBtn = (id) => {
  $("#" + id + "t" + "").on("click", function () {
    database.ref(id).update({
      complete: "tax",
    });
    window.location.reload();
  });
};

let batchOut = (array) => {
  let sum = 0;
  let taxPer = 0.56;
  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }
  let taxAmount = (sum * taxPer).toFixed(2);
  $("#totalTaxDisp").text("$" + taxAmount);

  $("#batchBtn").on("click", function (event) {
    event.preventDefault();
  });
};

let handleFileSelect = (event) => {
  selectedFile = event.target.files[0];

  fileUpload = selectedFile;

  var uploadTask = storageRef
    .child("orders/" + fileUpload.name)
    .put(fileUpload);
  uploadTask.on(
    firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
    function (snapshot) {
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log("Upload is paused");
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log("Upload is running");
          $("#eLoading").show();
          $("#loading").show();
          $("#new-order-btn").hide();
          break;
      }
    },
    function (error) {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;

        case "storage/canceled":
          // User canceled the upload
          break;

        case "storage/unknown":
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    },
    function () {
      // Upload completed successfully, now we can get the download URL
      uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
        console.log("File available at", downloadURL);
        url = downloadURL;
        // $("#new-order-btn").show();
        $("#eLoading").hide();
        $("#eIsLoaded").show();
        $("#loading").hide();
        // $("#isLoaded").show();
        $("#new-order-btn").show();
      });
    }
  );
};

let selectOne = (id) => {
  checkAll = document.getElementById('"#' + id + '"');
  console.log('checkAll: ', checkAll)
};

// let handleCheckbox = (event) => {
//   selectedFile = event.target.files[0];
//   console.log('event: ')
// }

let selectAll = () => {
  checkAll = document.getElementsByName("openCheck");
  let idArr = [];
  for (let i = 0; i < checkAll.length; i++) {
    const elem = checkAll[i];
    let id = elem.id;
    idArr.push(id);
    console.log("elem.id: ", id);
    // closeBtn(id)
  }
  $("#closeAllButton").on("click", function () {
    for (let j = 0; j < idArr.length; j++) {
      const elem2 = idArr[j];
      database.ref(elem2).update({
        complete: "closed",
      });
      // console.log('elem2: ', elem2)
    }
    window.location.reload();
  });
  // console.log('idArr: ', idArr)
};

let retreive = () => {
  database
    .ref()
    .orderByChild("vendor")
    .on("child_added", function (childSnapshot) {
      orderArr.push(childSnapshot.val());

      let vendor = childSnapshot.val().vendor;
      let cost = childSnapshot.val().cost;
      let orderDate = childSnapshot.val().date;
      let itemKey = childSnapshot.key;
      let taxStat = childSnapshot.val().tax;
      let orderUrl = childSnapshot.val().url;
      let status = childSnapshot.val().complete;

      if (childSnapshot.val().complete === "open") {
        openCostArr.push(parseInt(cost));
      }

      addCostOpen(openCostArr);

      if (childSnapshot.val().complete === "complete") {
        completeCostArr.push(parseInt(cost));
      }
      addCostComplete(completeCostArr);

      if (
        childSnapshot.val().complete === "open" ||
        childSnapshot.val().complete === "complete"
      ) {
        totalCost.push(parseInt(cost));
      }
      if (status === "tax") {
        taxPeriod.push(parseInt(cost));
      }

      addCost(totalCost);
      addCost2(taxPeriod, "totalTaxPeriodDisp");

      if (
        childSnapshot.val().tax === "Taxable" &&
        childSnapshot.val().complete === "tax"
      ) {
        taxableArr.push(parseInt(cost));
      }
      if (childSnapshot.val().complete == "open") {
        let newOrderInfo = $("<tr>").append(
          $("<td>").text(vendor),
          $("<td>").text("$" + cost),
          $("<td>").text(orderDate),
          $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow("d")),
          $("<td>").text(taxStat),
          $("<td>").html(
            '<a class="viewLink" target="_blank" href="' +
              orderUrl +
              '">View</a>'
          ),
          $("<td>").html(
            '<div class="dropdown">' +
              "<button" +
              'class="btn btn-primary dropdown-toggle"' +
              'type="button"' +
              'data-toggle="dropdown">' +
              "Action" +
              '<span class="caret"></span>' +
              "</button>" +
              '<ul class="dropdown-menu">' +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "d" +
              '" class="btn btn-primary delete-btn">Delete</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              itemKey +
              '" id="' +
              itemKey +
              "e" +
              '" class="btn btn-primary delete-btn">Edit</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              itemKey +
              '" id="' +
              itemKey +
              "c" +
              '" class="btn btn-primary delete-btn">Complete</button>' +
              "</li>" +
              "</li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "f" +
              '" class="btn btn-primary delete-btn">Close</button>' +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "t" +
              '" class="btn btn-primary delete-btn">Tax Period</button>' +
              "<li>" +
              "</ul>" +
              "</div>"
          )
        );

        $("#open-orders > tbody").append(newOrderInfo);
        completeBtn(itemKey);
        editBtn(itemKey, vendor, cost, orderDate, taxStat);
        deleteBtn(itemKey);
        closeBtn(itemKey);
        taxBtn(itemKey);
      } else if (childSnapshot.val().complete == "complete") {
        let closedOrderInfo = $("<tr>").append(
          $("<td>").text(vendor),
          $("<td>").text("$" + cost),
          $("<td>").text(orderDate),
          $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow()),
          $("<td>").text(taxStat),
          $("<td>").html(
            '<a class="viewLink" target="_blank" href="' +
              orderUrl +
              '">View</a>'
          ),
          $("<td>").html(
            '<div class="dropdown">' +
              "<button" +
              'class="btn btn-primary dropdown-toggle"' +
              'type="button"' +
              'data-toggle="dropdown">' +
              "Action" +
              '<span class="caret"></span>' +
              "</button>" +
              '<ul class="dropdown-menu">' +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "d" +
              '" class="btn btn-primary delete-btn">Delete</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              itemKey +
              '" id="' +
              itemKey +
              "e" +
              '" class="btn btn-primary delete-btn">Edit</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "o" +
              '" class="btn btn-primary delete-btn">Open</button>' +
              "</li>" +
              "</li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "f" +
              '" class="btn btn-primary delete-btn">Close</button>' +
              "<li>" +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "t" +
              '" class="btn btn-primary delete-btn">Tax Period</button>' +
              "<li>" +
              "</ul>" +
              "</div>"
          )
        );
        $("#complete-orders > tbody").append(closedOrderInfo);
        editBtn(itemKey, vendor, cost, orderDate, taxStat);
        deleteBtn(itemKey);
        closeBtn(itemKey);
        openBtn(itemKey);
        taxBtn(itemKey);
      }
      if (childSnapshot.val().complete == "closed") {
        let newOrderInfo = $("<tr>").append(
          $("<td>").text(vendor),
          $("<td>").text("$" + cost),
          $("<td>").text(orderDate),
          $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow("d")),
          $("<td>").text(taxStat),
          $("<td>").html(
            '<a class="viewLink" target="_blank" href="' +
              orderUrl +
              '">View</a>'
          ),
          $("<td>").html(
            '<div class="dropdown">' +
              "<button" +
              'class="btn btn-primary dropdown-toggle"' +
              'type="button"' +
              'data-toggle="dropdown">' +
              "Action" +
              '<span class="caret"></span>' +
              "</button>" +
              '<ul class="dropdown-menu">' +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "d" +
              '" class="btn btn-primary delete-btn">Delete</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              itemKey +
              '" id="' +
              itemKey +
              "e" +
              '" class="btn btn-primary delete-btn">Edit</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              itemKey +
              '" id="' +
              itemKey +
              "c" +
              '" class="btn btn-primary delete-btn">Complete</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "o" +
              '" class="btn btn-primary delete-btn">Open</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "t" +
              '" class="btn btn-primary delete-btn">Tax Period</button>' +
              "<li>" +
              "</ul>" +
              "</div>"
          )
        );

        $("#closed-orders > tbody").append(newOrderInfo);
        completeBtn(itemKey);
        editBtn(itemKey, vendor, cost, orderDate, taxStat);
        deleteBtn(itemKey);
        openBtn(itemKey);
        taxBtn(itemKey);
      }
      if (childSnapshot.val().complete == "tax") {
        let newId = itemKey + "all";

        let newOrderInfo = $("<tr>").append(
          $("<td>").html(
            '<div class="checkbox" name="openCheck" value="' +
              newId +
              '" class="form-check checkBox"' +
              '" id="' +
              itemKey +
              ' id="hideBox">' +
              ' <input class="form-check-input" id="' + 
              newId +
              '" type="checkbox" onClick="selectOne(' + itemKey + ')" value="' +
              newId +
              '" id="flexCheckDefault">' +
              '<label class="form-check-label" for="flexCheckDefault">' +
              // 'Default checkbox'+
              "</label>" +
              "</div>"
          ),
          $("<td>").text(vendor),
          $("<td>").text("$" + cost),
          $("<td>").text(orderDate),
          $("<td>").text(moment(orderDate, "MM/DD/YYYY").fromNow("d")),
          $("<td>").text(taxStat),
          $("<td>").html(
            '<a class="viewLink" target="_blank" href="' +
              orderUrl +
              '">View</a>'
          ),
          $("<td>").html(
            '<div name="openCheck" value="' +
              newId +
              '" class="form-check checkBox"' +
              '" id="' +
              itemKey +
              '">' +
              "</div>" +
              '<div class="dropdown">' +
              "<button" +
              'class="btn btn-primary dropdown-toggle"' +
              'type="button"' +
              'data-toggle="dropdown">' +
              "Action" +
              '<span class="caret"></span>' +
              "</button>" +
              '<ul class="dropdown-menu">' +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "d" +
              '" class="btn btn-primary delete-btn">Delete</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              itemKey +
              '" id="' +
              itemKey +
              "e" +
              '" class="btn btn-primary delete-btn">Edit</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              itemKey +
              '" id="' +
              itemKey +
              "c" +
              '" class="btn btn-primary delete-btn">Complete</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "o" +
              '" class="btn btn-primary delete-btn">Open</button>' +
              "</li>" +
              "<li>" +
              '<button key="' +
              orderDate +
              '" id="' +
              itemKey +
              "t" +
              '" class="btn btn-primary delete-btn">Tax Period</button>' +
              "<li>" +
              "</ul>" +
              "</div>"
          )
        );
        $("#hideBox").hide();
        $("#tax-period > tbody").append(newOrderInfo);
        completeBtn(itemKey);
        editBtn(itemKey, vendor, cost, orderDate, taxStat);
        deleteBtn(itemKey);
        openBtn(itemKey);
        closeBtn(itemKey);
      }

      calcTax(taxableArr);

      if (taxableArr > 0) {
        batchOut(taxableArr);
      }
    });
};

retreive();
