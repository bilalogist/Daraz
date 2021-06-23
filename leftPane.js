let main = (function () {
  let dom = {
    related: document.getElementById(`related`),
    primaryColorsBar: document.getElementById(`primary-Colors-bar`),
    secondaryColorsBar: document.getElementById(`secondary-Colors-bar`),
    service: document.getElementById("service"),
    location: document.getElementById("location"),
    bottleCapacity: document.getElementById("water-bottle-capacity"),
  };

  function updateUI(data) {
    let colorElement = `<div class="form-check"> <label class="form-check-label"> <input type="checkbox" class="form-check-input" value="" /><span class="side-buttons" >%item%</span > </label></div>`;

    let element = {
      checkBox: `<div class="form-check"> <label class="form-check-label"> <input type="checkbox" class="form-check-input" value="" /><span class="side-buttons" >%item%</span > </label></div>`,
      option: `<a href="" class="side-buttons d-block">%item%</a>`,
    };

    //update the color options on left pane
    updateDOM(dom.primaryColorsBar, data.pColors, colorElement);
    updateDOM(dom.secondaryColorsBar, data.sColors, colorElement);
    updateDOM(dom.related, data.related, element.option);
    updateDOM(dom.service, data.service, element.checkBox);
    updateDOM(dom.location, data.location, element.checkBox);
    updateDOM(dom.bottleCapacity, data.bottleCapacity, element.checkBox);
  }

  function updateDOM(dom, data, element) {
    for (const item of data) {
      dom.insertAdjacentHTML(`beforeend`, element.replace(`%item%`, item));
    }
    console.log("Updated");
  }

  return {
    init: () => {
      console.log("xhttp.responseText");
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          var response = JSON.parse(xhttp.responseText);
          updateUI(response);
        }
      };
      xhttp.open("GET", "components.json", true);
      xhttp.send();
    },
  };
})();
main.init();
