function readImage(file, img, output, status) {
  // Check if the file is an image.
  if (file.type && !file.type.startsWith("image/")) {
    (status.textContent = "File is not an image > "), file.type, file;
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", (event) => {
    img.src = event.target.result;
    output.src = event.target.result;
  });
  reader.readAsDataURL(file);
}

function drawImage(canvasContext, img) {
  var w = img.width;
  var h = img.height;

  canvasContext.canvas.width = w;
  canvasContext.canvas.height = h;

  canvasContext.clearRect(0, 0, w, h);
  canvasContext.drawImage(img, 0, 0);

  var imgData = canvasContext.getImageData(0, 0, w, h);

  canvasContext.clearRect(0, 0, w, h);
  canvasContext.drawImage(img, 0, 0);
}
