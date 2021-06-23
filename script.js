let UIcontroller = (function () {
  DOM = {};

  return {
    addCard: function (json) {
      for (let i = 0; i < json.cards.length; i++) {
        let card =
          '<a href="productDetailPage.html?id=%id%" ><div class="card card-size card-shadow border-0"><div><img src="%url%" width="234px" height="234px" alt=""class="card-img-top"/><div class="card-body p-3"><div class="small_images"><img src="%url%" width="32px"class="border border-danger border-circular"alt=""/></div><img src="images/badge.PNG" class="mt-2" alt="" /> <p class="card-title crop-text-2 mt-2"> %name%</p><p class="price-style">%price%</p><p class="small"><del>%old-price%</del>-%discount%</p> <div class="row justify-content-between px-2"> <p class="small"><span style="color: #faca51" ><i class="fa fa-star"></i><i class="fa fa-star"></i ><i class="fa fa-star"></i><i class="fa fa-star"></i ><i class="fa fa-star"></i ></span> (%stars%) </p>  <p class="small">%Country%</p>  </div> </div> </div></div></a>';

        card = card.replace("%id%", json.cards[i].id);
        card = card.replace("%name%", json.cards[i].name);
        card = card.replace("%url%", json.cards[i].url);
        card = card.replace("%url%", json.cards[i].url);
        card = card.replace("%price%", json.cards[i].price);
        card = card.replace("%old-price%", json.cards[i].oldPrice);
        card = card.replace("%discount%", json.cards[i].discount);
        card = card.replace("%stars%", json.cards[i].stars);
        card = card.replace("%Country%", json.cards[i].country);

        document
          .getElementById("cards-section")
          .insertAdjacentHTML("afterbegin", card);
      }
    },
  };
})();

let controller = (function () {
  function attachEventListner() {
    let button = document.getElementById("showmorebutton");
    let categories = document.querySelector(".dropdown-toggle");

    button.addEventListener("click", function () {
      if (button.innerHTML === "Show more") {
        button.innerHTML = "Show less";
      } else button.innerHTML = "Show more";
    });

    categories.addEventListener("mouseenter", function () {
      console.log("Mouse has entered");

      // categories.collapse("show");
    });
  }
  function populateDataToUI() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        var response = JSON.parse(xhttp.responseText);
        UIcontroller.addCard(response);
        UIcontroller.addCard(response);
      }
    };
    xhttp.open("GET", "data.json", true);
    xhttp.send();
  }

  return {
    init: function () {
      populateDataToUI();
      attachEventListner();
    },
  };
})();

controller.init();
