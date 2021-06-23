let dataController = (function () {
  function readId() {
    const queryString = window.location.search;
    const id = queryString.split("=");
    return id[1];
  }

  function readJSONData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        const jsonObj = JSON.parse(xhttp.responseText);

        //finds the product id  from the json

        const productDetails = findCard(readId(), jsonObj.cards);
        JsonObj = productDetails;
        // Pass the data to UI controller to update on the UI
        console.log("Reading data");
        UIcontroller.initUI(productDetails);
      }
    };

    xhttp.open("GET", "data.json", true);
    xhttp.send();
  }

  // finds the product in the json's object array and returns the particular product object
  function findCard(id, cardsArray) {
    for (const card of cardsArray) {
      if (card.id == id) {
        return card;
      }
    }
  }

  function addtoCart(dom) {
    // get required data for the cart
    let quantity = dom.quantity.value;
    let color = dom.colorFamily.innerHTML;
    let id = readId();
    let storageItem = sessionStorage.getItem("items");

    if (storageItem == null || storageItem.search(`id-${id}`) < 0) {
      sessionStorage.setItem(`quantity-${id}`, quantity);
      sessionStorage.setItem(`color-${id}`, color);

      if (sessionStorage.getItem(`items`)) {
        console.log("Inside storage ");
        let old = sessionStorage.getItem(`items`);
        sessionStorage.setItem(`items`, `${old}_id-${id}`);
      } else sessionStorage.setItem(`items`, `id-${id}`);

      //THis statement will trigger and event that will be handled to update cart badge number
      dom.cartBadge.dispatchEvent(new Event(`updateBadge`));
    } else {
      console.log(`Already Added`);
    }
  }

  return {
    init: function () {
      //read and parse external json
      readJSONData();
    },
    attachEventListeners: function (dom) {
      // dom.smallImages
      dom.smallImages.addEventListener("mouseover", (e) => {
        //using event bubbling approach to update the display image when clicked on images
        if (e.target.src) {
          // checking if the clicked target had any source
          dom.displayImage.src = e.target.src;
          UIcontroller.updateZoomImage();
        }
      });

      //listens for change of color
      // so that images can also be updated
      dom.colorVariantImages.addEventListener("click", function (e) {
        console.log(e.target);
        if (e.target.title) {
          dom.colorFamily.innerHTML = e.target.title;
          UIcontroller.updateImagesforColor(JsonObj);
        }
      });

      // listens for any decrement in quantity
      dom.minusBtn.addEventListener("click", () => {
        if (dom.quantity.value > 1)
          dom.quantity.value = parseInt(dom.quantity.value) - 1;
      });

      // listens for any increment in quantity
      dom.plusBtn.addEventListener(
        "click",
        () => (dom.quantity.value = parseInt(dom.quantity.value) + 1)
      );
      // adds the product to cart
      dom.addtoCart.addEventListener("click", () => addtoCart(dom));

      // adds the product to cart and moves to cart page
      dom.buyNow.addEventListener("click", () => {
        addtoCart(dom);
        window.location.replace("cart.html");
      });
    },
  };
})();

let UIcontroller = (function () {
  // this object contains node for each dom
  let dom = {
    detailImages: document.getElementById("detail-images"),
    inBox: document.getElementById("in-box"),
    cartBadge: document.querySelector(".number-badge"),
    displayImage: document.getElementById("display-image"),
    title: document.getElementById("title"),
    price: document.getElementById("price"),
    oldPrice: document.getElementById("old-price"),
    discount: document.getElementById("discount"),
    brandName: document.getElementById("brand"),
    ansQ: document.getElementById("question-answered"),
    totalRatings: document.getElementById("total-ratings"),
    colorFamily: document.getElementById("color-family"),
    moreAcc: document.getElementById("more-acc"),
    soldBy: document.getElementById("sold-by"),
    averageStars: document.getElementById("average-ratings"),
    bottomRatingCount: document.getElementById("b-ratings"),
    smallImages: document.getElementById("variants"),
    colorVariantImages: document.getElementById("color-variants"),
    detailItems: document.getElementById("detail-items"),
    sku: document.getElementById("sku"),
    shipTime: document.getElementById("ship-time"),
    responseRate: document.getElementById("response-rate"),
    positiveRating: document.getElementById("positive-rating"),
    quantity: document.getElementById("quantity"),
    plusBtn: document.getElementById("plus-btn"),
    minusBtn: document.getElementById("minus-btn"),
    addtoCart: document.getElementById("add-to-cart"),
    buyNow: document.getElementById("buy-now"),
    s5: document.getElementById("s-5"),
    s4: document.getElementById("s-4"),
    s3: document.getElementById("s-3"),
    s2: document.getElementById("s-2"),
    s1: document.getElementById("s-1"),
  };

  //below method adds preview images for any particular color below the main image
  function addSmallImages(comp, product) {
    let element =
      '<a href=""> <img class="img-fluid mr-2" width="50px" src=%src% alt=""> </a>';

    //below block will remove any images prior to adding new images when the color is changed
    if (dom.smallImages.hasChildNodes) {
      let childNodes = Array.from(dom.smallImages.childNodes);
      console.log(childNodes);
      childNodes.forEach((element) => {
        dom.smallImages.removeChild(element);
      });
    }
    // will get images array for selected color
    let images =
      product.images[product.colors.indexOf(dom.colorFamily.innerHTML)];
    // will set main image
    dom.displayImage.src = images[0];
    //will add magnifier to the image
    UIcontroller.updateZoomImage();
    //will add small images in the bottom of main image
    for (const img of images) {
      let ele = element.replace("%src%", img);
      dom.smallImages.insertAdjacentHTML("beforeend", ele);
    }
  }

  //will add single image for each color below the color family
  // this image will be used to select between color choices
  function addColorVariants(comp, product) {
    let element =
      ' <img src=" %src% " style="cursor: pointer;" title="%value%"  width="32px" class="border border-danger border-circular"/>';

    for (let i = 0; i < product.colors.length; i++) {
      let image = product.images[i][0];
      let color = product.colors[i];
      let ele = element.replace("%src%", image);
      ele = ele.replace("%value%", color);
      comp.insertAdjacentHTML("afterBegin", ele);
    }
  }

  //utility functuin to update dom when data from json is in array form
  //3 arguments//
  // 1. dom: this is the dom element that will be updated
  // 2. data: this is the array from the json
  // 3. element is the code in string format that will be
  //    added to the dom after modification
  function updateDOM(dom, data, element) {
    for (const item of data) {
      dom.insertAdjacentHTML(`beforeend`, element.replace(`%item%`, item));
    }
  }
  // function addDetailImages(domElement, data) {
  //   for (const item of data) {
  //     let src = `<img class="pt-2" width="1000px"  src="%src%" alt="">`;
  //     domElement.insertAdjacentHTML(`beforeend`, src.replace(`%src%`, item));
  //   }
  // }
  return {
    initUI: function (product) {
      this.updateDataonUI(product);
    },

    updateZoomImage: function () {
      var options = {
        width: 250,
        height: 250,
        zoomWidth: 500,
        scale: 1.7,
        zoomStyle: `z-index:1;`,
        zoomLens: `opacity:1;`,
      };
      new ImageZoom(document.getElementById("zoomed"), options);
    },
    //below method adds preview images below the main image
    updateImagesforColor: function (product) {
      addSmallImages(``, product);
    },

    addSuggestion: function () {},

    // this method will update the dom with the attributes of the product
    updateDataonUI: function (product) {
      document.title = product.name;
      dom.displayImage.src = product.url;
      dom.title.innerHTML = product.name;
      dom.price.innerHTML = product.price;
      dom.oldPrice.innerHTML = product.oldPrice;
      dom.discount.innerHTML = product.discount;
      dom.colorFamily.innerHTML = product.colors[0];
      dom.ansQ.innerHTML = `${product.qa} Answered Questions`;
      dom.totalRatings.innerHTML = `${product.totalRatings} Ratings`;
      dom.bottomRatingCount.innerHTML = product.totalRatings;
      dom.brandName.innerHTML = product.brand;
      dom.soldBy.innerHTML = product.brand;
      dom.moreAcc.innerHTML = `More accessories from ${product.brand}`;
      dom.averageStars.innerHTML = product.averageStars;
      dom.inBox.innerHTML = product.inBox;

      addSmallImages(dom.smallImages, product);
      addColorVariants(dom.colorVariantImages, product);
      dataController.attachEventListeners(dom);
      // adding details
      updateDOM(dom.detailItems, product.details, ` <li>%item%</li>`);

      //adding sku number
      dom.sku.innerHTML = product.sku;

      //Poitive Rating
      dom.positiveRating.innerHTML = product.positiveRating;

      //Response Rate
      dom.responseRate.innerHTML = product.responseRate;

      dom.inBox.innerHTML = product.inBox;

      //Shipping Time
      dom.shipTime.innerHTML = product.shipTime;

      updateDOM(
        dom.detailImages,
        product.description,
        `<img class="pt-2" width="1000px" src="%item%" alt=""></img>`
      );

      //adding stars count

      dom.s5.innerHTML = product.fiveStars;
      dom.s4.innerHTML = product.fourStars;
      dom.s3.innerHTML = product.threeStars;
      dom.s2.innerHTML = product.twoStars;
      dom.s1.innerHTML = product.oneStar;
    },
  };
})();

dataController.init();
