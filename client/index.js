document.getElementById("first").style.display = "block";

let paramString = (window.location.href).split('?')[1];
let queryString = new URLSearchParams(paramString);
for (let pair of queryString.entries()) {
    if (pair[0] === 'img') {
        document.getElementById("first").style.display = "none";
        document.getElementById("second").style.display = "block";
        document.getElementById("upload_your_own_files").style.display = "block";

        $.post("https://server-akkuishot.glitch.me/getImage", {
            json_string: JSON.stringify({
                ImageID: pair[1]
            })
        }).always(function (output) {      
            if (output.status !== 400) {
                if (localStorage.getItem('img_uploaded', true)) {
                    localStorage.removeItem('img_uploaded');
                    document.getElementById("message_second").innerHTML = `Your image has been successfully uploaded.<br>The link for this image: ${document.location.href}`;
                }

                document.getElementById("image_preview_message").style.visibility = "hidden";
                var img = document.getElementById("image_preview")
                img.style.visibility = "visible"
                img.src = output;
            }
        })
    }
} 

function selectImage() {
    document.getElementById("img_upload").click();
    document.getElementById('img_upload').addEventListener('change', function () {
        document.getElementById("file_name").innerHTML = document.getElementById('img_upload').files[0].name;
        document.getElementById("select_file").style.visibility = "hidden";
        document.getElementById("upload_file").style.display = "block";
      }, false);
}

function uploadImage() {
    var input = document.getElementById("img_upload");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = function(event){
        $.post("https://server-akkuishot.glitch.me/uploadImage", {
            json_string: JSON.stringify({
                ImageBase64: event.target.result
            })
        }).always(function (output) {           
            if (output.status === 200) {
                localStorage.setItem('img_uploaded', true);
                window.location.href = `index.html?img=${output.image_url}`
            } else {
                document.getElementById("message_first").innerHTML = output.message;
            }
        })
    }
}