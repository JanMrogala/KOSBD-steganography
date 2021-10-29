const status = document.getElementById("status");
const output = document.getElementById("output");
const fileSelector = document.getElementById("file-selector");
const dragNDropZone = document.getElementById("drag-n-drop");

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var img = new Image();
img.onload = function () {
  imageManipulation(ctx);
};

setupFileSelect(fileSelector, img, output, status);
setupDragNDrop(dragNDropZone, img, output, status);
