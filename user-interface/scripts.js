var API_ENDPOINT = "<YOUR-API-GATEWAY-HERE>"

document.getElementById("detect").onclick = function() {
  var inputData = {
    "voice": $("#image").val()
  };

  $.ajax({
    url: API_ENDPOINT,
    type: "POST",
    data: JSON.stringify(inputData),
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      document.getElementById("postIDreturned").textContent =
        "Post ID: " + response;
    },
    error: function (error) {
      console.error("Unexpected error: %j", error);
    }
  });
};

document.getElementById("searchButton").onclick = function() {
  var postId = $("#postId").val();

  $.ajax({
    url: API_ENDPOINT + "?postId=" + postId,
    type: "GET",
    success: function (response) {
      $("#posts tr").slice(1).remove();

      jQuery.each(response, function(i, data) {
        var result = "(nothing detected)";

        if (typeof data["result"] === "boolean") {
          result = data["result"]
        }

        $("#posts").append(
          "<tr>" +
            "<td>" + data["id"] + "</td>" +
            "<td>" + data["image"] + "</td>" +
            "<td>" + data["status"] + "</td>" +
            "<td>" + result + "</td>" +
          "</tr>");
      });

    },
    error: function (error) {
      console.error("Unexpected error: %j", error);
    }
  });
};