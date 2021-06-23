let dataController = (function () {
  let totalPrice, deliveryCharges;
  totalPrice = 168;
  deliveryCharges = 168;

  let itemIds;
  let dom = {
    cardsDiv: document.getElementById(`cards-div`),
    cartBadge: document.querySelector(".number-badge"),
    tPrice: document.getElementById("total-price"),
    sPrice: document.getElementById("stotal-price"),
    itemCount: document.getElementById("count"),
  };

  function updateUI(card, id) {
    let el = `<div id="main-div-%id%" class="row ml-1 mr-1 mt-3 bg-white"> <div class="col-2"> <div class="d-flex align-items-center mt-2"> <a href="productDetailPage.html?id=%id%"> <img class="ml-2 mt-2" src="%src%" width="80px" height="80px" alt=""> </a></div></div><div class="col-4 mt-3"> <p class="small">%title%</p><p class="small primary-gray">%brand%, Color Family:%color%</p></div><div class="col-3 mt-3"> <p class="color-orange">Rs.<span id="rate-%id%">%price%</span></p><p class="small mb-0"> <del class="mr-1 primary-gray">%old-price%</del></p><p class="small">-%discount%</p><p><i class="fa fa-heart" aria-hidden="true"></i> <span class="big-on-hover ml-2"><i id="trash-%id%" class="fas fa-trash-alt"></i> </span> </p></div><div class="col-3 align-self-center"> <div class="input-group ml-0"> <div class="input-group-prepend"> <button id="minus-%id%" class="btn "><span class="lead">-</span></button> </div><div class="w-50 input-group"> <input readonly=true  id="input-%id%" type="text" value="%quantity%"   class="form-control bg-light pl-4 border-0"></div><div class="input-group-append"> <button class="btn" id="plus-%id%"><span class="lead">+</span></button> </div></div></div></div>`;
    el = el.replaceAll(`%id%`, id);
    el = el.replace(`%src%`, card.url);
    el = el.replace(`%title%`, card.name);
    el = el.replace(`%price%`, card.rate);
    el = el.replace(`%discount%`, card.discount);
    el = el.replace(`%old-price%`, card.oldPrice);
    el = el.replace(`%quantity%`, sessionStorage.getItem(`quantity-${id}`));
    el = el.replace(`%color%`, sessionStorage.getItem(`color-${id}`));
    el = el.replace(`%brand%`, card.brand);
    el = el.replace(`%color%`, sessionStorage.getItem(`color-${id}`));
    dom.cardsDiv.insertAdjacentHTML(`beforeend`, el);
  }

  function findCard(id, cardsArray) {
    for (const card of cardsArray) {
      if (card.id == id) {
        return card;
      }
    }
  }

  // Items are passed as a string concatenation in the session storage
  // this methods spilts the ids from the string
  // returns an array of ids.
  function getItemsId() {
    let ids = sessionStorage.getItem(`items`);
    console.log("geting items id", ids);
    if (ids != null) {
      ids = ids.replaceAll(`id-`, ``);

      console.log(ids.split(`_`));
      return ids.split(`_`);
    }
    console.log("Get Items null from storage");
    return [];
  }

  function init(jsonObject) {
    itemIds = getItemsId();

    itemIds.forEach((id) => {
      let quantity = sessionStorage.getItem(`quantity-${id}`);
      // let color = sessionStorage.getItem(`color-${id}`);

      let card = findCard(id, jsonObject.cards);
      if (card != undefined) {
        updateUI(card, id, quantity);
        updatePrice(card.rate, quantity);
      }
    });
    updateCount();
    attachEventListener();
  }

  function updateCount() {
    let itemsArray = getItemsId();
    console.log(itemsArray);
    if (itemsArray.length > 0) {
      console.log("if", itemsArray.length);

      dom.itemCount.innerHTML = itemsArray.length;
    } else {
      console.log("else");
      dom.itemCount.innerHTML = 0;
    }
  }

  function attachEventListener() {
    dom.cardsDiv.addEventListener(`click`, (e) => {
      // attach event listener to the div where cards will be rendered
      // and handled it throught event bubbling

      let eId = e.target.id;
      // eId is the id of the element that is pressed

      if (eId.search("trash") > -1) {
        deleteItem(eId);
        updateCount();
      } else if (eId.search("plus") > -1) {
        increaseQuantity(eId);
      } else if (eId.search("minus") > -1) {
        decreaseQuantity(eId);
      }
    });
  }

  // delete Item from cart
  function deleteItem(eId) {
    //e.g eid=trash-2 where 2 is product id
    let id = eId.split("-");
    removePrice(id[1]);
    removeFromStorage(id[1]);
    let mainDiv = document.getElementById(`main-div-${id[1]}`);
    mainDiv.parentNode.removeChild(mainDiv);
    dom.cartBadge.dispatchEvent(new Event(`updateBadge`));
    updateDomPrice();
  }

  // will increase a single quantity when plus button pressed
  function increaseQuantity(eId) {
    //e.g eid=trash-2 where 2 is product id
    let temp = eId.split("-");
    let id = temp[1];
    let rate = parseInt(document.getElementById(`rate-${id}`).innerHTML);
    let input = document.getElementById(`input-${id}`);
    totalPrice += rate;
    updateDomPrice();
    input.value = parseInt(input.value) + 1;

    sessionStorage.setItem(`quantity-${id}`, input.value);
  }
  // will increase a single quantity when minus button pressed
  function decreaseQuantity(eId) {
    //e.g eid=trash-2 where 2 is product id
    let temp = eId.split("-");
    let id = temp[1];
    let rate = parseInt(document.getElementById(`rate-${id}`).innerHTML);
    let input = document.getElementById(`input-${id}`);
    if (input.value > 1) {
      totalPrice -= rate;
      updateDomPrice();
      input.value = parseInt(input.value) - 1;
      sessionStorage.setItem(`quantity-${id}`, input.value);
    } else {
      console.log("Quantity cannot be less than 1 ");
    }
  }

  // *****************
  // utility functions

  // will remove price from the total price section upon removal of any item
  function removePrice(id) {
    let quanity = document.getElementById(`input-${id}`).value;
    let rate = document.getElementById(`rate-${id}`).innerHTML;
    totalPrice -= rate * quanity;
    updateDomPrice();
  }

  //will update total price upon insertion of any item
  function updatePrice(rate, quantity) {
    totalPrice += rate * quantity;
    console.log(totalPrice);
    updateDomPrice();
  }

  // this method will only update the price in DOM
  function updateDomPrice() {
    dom.sPrice.innerHTML = totalPrice - deliveryCharges;

    dom.tPrice.innerHTML = totalPrice === deliveryCharges ? 0 : totalPrice;
  }

  function removeFromStorage(tId) {
    sessionStorage.removeItem(`quantity-${tId}`);
    sessionStorage.removeItem(`color-${tId}`);

    let ids = getItemsId();
    console.log("Removing Id:", tId, `from`, ids);
    console.log("Length of ids is:", ids.length);
    console.log("ids.length == 1", ids.length == 1);
    console.log(ids[0], "===", tId, ids[0] === tId);

    let newIds;
    if (ids.length == 1 && ids[0] === tId) {
      console.log("One Item left so removing all");
      sessionStorage.removeItem("items");
    } else {
      console.log(`Index of ${tId} is:`, ids.indexOf(tId), `in`, ids);
      let index = ids.indexOf(tId);
      ids = [...ids.slice(0, index), ...ids.slice(index + 1, ids.length)];

      console.log(`after splice: `, ids);
      console.log(ids);
      if (ids.length > 0) {
        for (let index = 0; index < ids.length; index++) {
          if (index === 0) newIds = `id-${ids[index]}`;
          else newIds += `_id-${ids[index]}`;
        }
      }
      sessionStorage.setItem("items", newIds);

      console.log("After Removing Ids:", ids, "Left with:", newIds);
    }
  }

  return {
    readJSON: () => {
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          var response = JSON.parse(xhttp.responseText);
          init(response);
        }
      };
      xhttp.open("GET", "data.json", true);
      xhttp.send();
    },
  };
})();

dataController.readJSON();
