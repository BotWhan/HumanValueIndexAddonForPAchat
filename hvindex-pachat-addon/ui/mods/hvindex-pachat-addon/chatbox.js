//http://nuttygroup.org:27395/?case=0&uberid=6089886685367004270

const HVIURL = "http://nuttygroup.org:27395/?";
function getWordRating(rating) {
  if (rating <= 3) {
    return "Bad";
  } else if (rating <= 5) {
    return "Casual";
  } else if (rating <= 7) {
    return "Good";
  }
  return "Very Good";
}
var updateindex = ko.observable(0);

model.determineAuth = function () {
  $.getJSON(
    HVIURL + "case=3&authentication=" + model.uberId(),
    function (result) {
      auth(result);
    }
  );
};
var auth = ko.observable();
model.determineAuth();

model.update = function () {
  $.get(HVIURL, function (update) {
    if (update != updateindex()) {
      updateindex(update);
    }
  });
};

setInterval(function () {
  model.update();
}, 20000);
model.humanRatings = function (Name, UberId) {
  var value = ko.observable();
  function get() {
    $.getJSON(HVIURL + "case=0&uberid=" + UberId, function (profile) {
      if (profile.name != "not registered") {
        value(
          (Name == profile.name ? "" : "(" + profile.name + ") | ") +
            profile.rating +
            ", " +
            getWordRating(profile.rating)
        );
      } else if (auth() == true) {
        value("C");
      } else {
        value("");
      }
    });
  }
  get();
  updateindex.subscribe(function () {
    get();
  });
  return { value: value, name: Name, uberid: UberId };
};

function foobar(bar) {
  console.log(bar);
  if (bar.length == 1) {
    return true;
  }
  return false;
}
$("span.user-name").after(
  '<!-- ko with: model.humanRatings(Name,UberId) -->\
  <!-- ko if: value() == "C"-->\
	<small data-bind="click: function(){editBox(name,uberid)}"><small data-bind="text: value"></small></small>\
		 <!-- /ko --><!-- /ko -->'
);
$("span.user-name").after(
  '<!-- ko with: model.humanRatings(Name,UberId) -->\
  <!-- ko if: value() != "C"-->\
  <small data-bind="click: function(){editBox(name,uberid)}"><br><small data-bind="text: value"></small></small>\
  <!-- /ko --><!-- /ko -->'
);

function editBox(Name, UberId) {
  if (!auth()) {
    return;
  }
  setInputBox();
  document.getElementById("editPlayerBoxheader").innerHTML =
    "<h3>Editing " + Name + "</h3>";
  document.getElementById("data").innerHTML =
    '<input type="number" id="newRating" placeholder="Enter New Rating" autocomplete="off" autofocus />' +
    '<button type="button" onclick="' +
    "console.log(document.getElementById('newRating').value); " +
    "document.getElementById('newRating').value.length == 0 ? " +
    "document.getElementById('newRating').value = '' : " +
    "toServer('1','" +
    UberId +
    "',document.getElementById('newRating').value,'" +
    Name +
    "','" +
    model.uberId() +
    "');\">" +
    "<small>Submit</small></button>" +
    "<br>" +
    '<button type="button" id="closeButton" onclick="document.getElementById(\'editPlayerBox\').remove()"><small>X</small></button>';
}

function toServer(caseNum, id, rating, name) {
  console.log("&authentication=" + model.uberId());
  $.get(
    HVIURL +
      "case=" +
      caseNum +
      "&uberid=" +
      id +
      "&rating=" +
      rating +
      "&name=" +
      name +
      "&authentication=" +
      model.uberId()
  );
  setTimeout(function () {
    model.update();
  }, 2000);
}

model.getNameAndId = function () {
  model.armies().forEach(function eachArmy(index) {
    index.slots().forEach(function eachSlot(index) {
      if (index.playerName() != null || index.playerName() != "") {
        console.log(index.playerName() + " " + index.playerId());
      }
    });
  });
};
