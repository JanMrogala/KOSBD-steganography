const status = document.getElementById("status");
const output = document.getElementById("output");
const fileSelector = document.getElementById("file-selector");
const dragNDropZone = document.getElementById("drag-n-drop");
const textArea = document.getElementById("textarea1");
const textAreaLabel = document.getElementById("textareaLabel");

const encodingFormat = "utf-8";

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var totalRGBPixels;
var binaryLength;
var maxMsgLength;
var fileName = { name: "" };

var imgLoaded = false;
var codable = false;

var img = new Image();
img.onload = function () {
  drawImage(ctx, img);
  imgLoaded = true;

  totalRGBPixels = img.width * img.height * 3;
  binaryLength = Number(totalRGBPixels).toString(2).length;
  maxMsgLength = Math.floor((totalRGBPixels - binaryLength - 3) / 8);

  textAreaLabel.innerHTML = "(" + 0 + "/" + maxMsgLength + " bytes)";

  textArea.disabled = false;
  textArea.value = "";
  codable = true;
};

setupFileSelect(fileSelector, img, output, status, fileName);
setupDragNDrop(dragNDropZone, img, output, status, fileName);

function encodeAction(el) {
  if (!codable) return;

  var imgData = ctx.getImageData(0, 0, img.width, img.height);

  var success = encode(imgData, textArea.value, encodingFormat, status);

  if (success) {
    textAreaLabel.innerHTML = "Text";
    $("#textarea1").val("");

    img.imgData = imgData;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(imgData, 0, 0);

    // get image URI from canvas object
    var imageURI = canvas.toDataURL("image/png", 1);
    el.href = imageURI;
    el.download = "encoded " + fileName.name;
  }
}

function decodeAction() {
  if (!codable) return;
  var imgData = ctx.getImageData(0, 0, img.width, img.height);

  var decodedMsg = decode(imgData, encodingFormat, NaN);

  $("#textarea1").val(decodedMsg);
  checkLength(textAreaLabel);
  $(document).ready(function () {
    $("#textarea1").focus();
    $("#textarea1").animate(
      {
        scrollTop: 0,
      },
      10
    );
  });
}

function checkLength(el) {
  changedValue();
  if (imgLoaded) {
    var msgLength = encodeMessage(textArea.value, encodingFormat).length / 8;

    textAreaLabel.innerHTML = "(" + msgLength + "/" + maxMsgLength + " bytes)";

    if (msgLength > maxMsgLength) {
      textAreaLabel.style.color = "red";
      codable = false;
    } else {
      textAreaLabel.style.color = "rgb(38, 166, 154)";
      codable = true;
    }
  }
}

function changedValue() {
  let text = document.getElementById("textarea1");
  let textValue = text.value;
  let row = text.getAttribute("rows");
  let lines = textValue.split(/\r|\r\n|\n/);
  let count = lines.length;
  if (count >= row) {
    text.style.overflowY = "scroll";
  } else if (count < row) {
    text.style.overflowY = "hidden";
  }
}
