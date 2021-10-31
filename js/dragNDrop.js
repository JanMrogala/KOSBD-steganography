function setupDragNDrop(dragNDropZone, trueImage, output, status, fileName) {
  if (window.FileList && window.File) {
    dragNDropZone.addEventListener("dragover", (event) => {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    });
    dragNDropZone.addEventListener("drop", (event) => {
      event.stopPropagation();
      event.preventDefault();

      status.textContent = "";

      const file = event.dataTransfer.files[0];
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
        fileName.name = file["name"];
        readImage(file, trueImage, output, status);

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
