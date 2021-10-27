let photo = document.getElementById("image-file").files[0];
let formData = new FormData();

formData.append("photo", photo);
fetch('/upload/image', {method: "POST", body: formData});