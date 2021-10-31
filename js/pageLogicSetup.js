const status = document.getElementById("status");
const output = document.getElementById("output");
const fileSelector = document.getElementById("file-selector");
const dragNDropZone = document.getElementById("drag-n-drop");
const textArea = document.getElementById("textarea1");
const textAreaLabel = document.getElementById("textareaLabel");

const encodingFormat = "utf-8";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var img = new Image();
img.onload = function () {
  drawImage(ctx, img);
};

setupFileSelect(fileSelector, img, output, status);
setupDragNDrop(dragNDropZone, img, output, status);

function encodeAction(el) {
  var imgData = ctx.getImageData(0, 0, img.width, img.height);

  encode(imgData, textArea.value, encodingFormat, NaN);

  img.imgData = imgData;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.putImageData(imgData, 0, 0);

  // get image URI from canvas object
  var imageURI = canvas.toDataURL("image/png", 1);
  el.href = imageURI;
  el.download = "Encoded img";
}

function decodeAction() {
  var imgData = ctx.getImageData(0, 0, img.width, img.height);

  var decodedMsg = decode(imgData, encodingFormat, NaN);

  $("#textarea1").val(decodedMsg);
  $(document).ready(function () {
    $("#textarea1").focus();
  });
  M.textareaAutoResize($("#textarea1"));
}
