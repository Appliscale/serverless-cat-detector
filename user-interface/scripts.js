var API_UPLOAD_ENDPOINT = "<your upload endpoint>"
var API_RESULTS_ENDPOINT = "<your results endpoint>"

document.getElementById("detect").onclick = function() {
  var reader = new FileReader();
  var file = $("#image")[0].files[0];
  $("#detect").prop("value","pending...");
  $.ajax({
    url: API_UPLOAD_ENDPOINT,
    type: "POST",
    contentType: "application/json; charset=utf-8",
    data: JSON.stringify({
      name: file.name,
      type: file.type
    }),
    success: function(response){
      console.log(response);
      $.ajax({
        url: response.uploadURL,
        type: "PUT",
        contentType: file.type,
        data: file,
        processData: false,
        success: function(response) {
          console.log("successfuly uploaded");
          $("#detect").prop("value", "Detect it!");
        }
      });
    },
    error: function(response) {
      console.log(response);
      $("#detect").prop("value", "Detect it!");
    }
  });
};

document.getElementById("searchButton").onclick = function() {
  $.ajax({
    url: API_RESULTS_ENDPOINT,
    type: "GET",
    success: function (data) {
      $("#posts tr").slice(1).remove();

      data.forEach(element => {
        $("#posts").append(
          "<tr>" +
          "<td>" + element["name"] + "</td>" +
          "<td> <img height=\"200\" src=\"" + element["imageUrl"] + "\"/></td>" +
          "<td>" + element["checked"] + "</td>" +
          "<td>" + element["status"] + "</td>" +
          "</tr>");
      });
      },
      error: function (error) {
        console.error("Unexpected error: %j", error);
      }
    });
  };
