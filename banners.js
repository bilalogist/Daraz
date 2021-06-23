//This script adds items to the categories and footer.
let defaults = (function () {
  let dom = {
    categories: document.querySelector(`.dropdown-menu`),
    ntn: document.getElementById(`ntn`),
    strn: document.getElementById(`strn`),
    makeMoney: document.getElementById(`make-money`),
    darazOptions: document.getElementById(`daraz-options`),
    customerCare: document.getElementById(`customer-care`),
    cartBadge: document.querySelector(".number-badge"),
  };

  function renderDefaults(jsonObj) {
    //read attributes from jsonObj and render the UI
    //Customer Care Options
    updateDOM(
      dom.customerCare,
      jsonObj.customerCare,
      `<a href="#" class="d-block">%item%</a>`
    );

    //Categories
    updateDOM(
      dom.categories,
      jsonObj.categories,
      `<a class="dropdown-item">%item%</a>`
    );
    // Make Money options
    updateDOM(
      dom.makeMoney,
      jsonObj.makeMoney,
      `<a class="d-block" href="#">%item%</a>`
    );

    // Daraz support options
    updateDOM(
      dom.darazOptions,
      jsonObj.darazOptions,
      `<a class="d-block" href="#">%item%</a>`
    );
    // NTN Number
    dom.ntn.innerHTML = jsonObj.ntn;

    // STRN Number
    dom.strn.innerHTML = jsonObj.strn;

    updateBadge();

    dom.cartBadge.addEventListener("updateBadge", () => updateBadge());
  }

  // updates the number of items in the cart
  function updateBadge() {
    let number = getItemsCount();
    if (number != undefined && number > 0) {
      dom.cartBadge.innerHTML = number;
    } else dom.cartBadge.innerHTML = ``;
  }

  function getItemsCount() {
    let ids = sessionStorage.getItem(`items`);
    if (ids) {
      ids = ids.replaceAll(`id-`, ``);
      return ids.split(`_`).length;
    } else {
      console.log("No Item to add in cart");
      return 0;
    }
  }

  function updateDOM(dom, data, element) {
    for (const item of data) {
      dom.insertAdjacentHTML(`beforeend`, element.replace(`%item%`, item));
    }
  }

  function readJson() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        var response = JSON.parse(xhttp.responseText);

        // 2.send the data to the UIrenderer
        renderDefaults(response);
      }
    };
    xhttp.open("GET", "components.json", true);
    xhttp.send();
  }

  return {
    init: function () {
      // 1. read the JSON file
      readJson();
    },
  };
})();

defaults.init();
