function setupFileSelect(fileSelector, trueImage, output, status) {
  if (window.FileList && window.File && window.FileReader) {
    fileSelector.addEventListener("change", (event) => {
      const file = event.target.files[0];
      status.textContent = "";
      if (!file.type) {
        status.textContent =
          "Error: The file type does not appear to be supported on this browser.";
        return;
      }
      if (!file.type.match("image.*")) {
        status.textContent =
          "Error: The selected file does not appear to be an image.";
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", (event) => {
        readImage(file, img, output, status);

        var element = document.getElementById("drop-files-here");
        if (typeof element != "undefined" && element != null) {
          element.remove();
        }
      });
      reader.readAsDataURL(file);
    });
  } else {
    status.textContent = "Error: File reading did not load correctly.";
    return;
  }
}
