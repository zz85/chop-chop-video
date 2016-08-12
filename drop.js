var dropbox;

dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  for (var i = 0; i < files.length; i++) {
    var file = files[i];

    var video = document.createElement("video")
    video.classList.add("obj");
    video.file = file;
    video.className = "preview";
    dropbox.appendChild(video);

    var reader = new FileReader();
    reader.onload = (function(aVideo) {
      return function(e) {
        console.log('aVideo', aVideo, e.target.result);
        // videojs(aVideo, { "controls": true, "autoplay": true, "preload": "auto" }).src({ type: "video/mp4", src: e.target.result})
      };
    })(video);
    reader.readAsDataURL(file);
  }
}