//selecting all required elements
const dropArea = document.querySelector(".drag-area"),
  dragText = dropArea.querySelector("header"),
  button = dropArea.querySelector("button"),
  input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
const rightArea = document.querySelector("#right")
//const boxright = document.querySelector("#box-right")
const memberDisplay = document.querySelector("#member-information")
const displayMember = document.querySelector("#display-members")
const chatDisplay = document.querySelector("#chat");
const displayChat = document.querySelector("#display-chat")

const left = document.querySelector("#left");
const buttonArea = document.querySelector("#button-area")
const right = document.querySelector("#right");
const stopStreaming = document.querySelector("#stop-streaming")
let changeVid = '';
sessionStorage.setItem("count", 0);

displayMember.addEventListener("click", (e) => {
  console.log("clicked")
  chatDisplay.hidden = true;
  memberDisplay.hidden = false;
})

displayChat.addEventListener("click", (e) => {
  console.log("clicked 1")
  memberDisplay.hidden = true;
  chatDisplay.hidden = false;
})

button.onclick = () => {
  input.click(); //if user click on the button then the input also clicked
}

input.addEventListener("change", function (e) {
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = this.files[0];
  dropArea.classList.add("active");
  showVideo(e); //calling function
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
  dragText.textContent = "Release to Upload File";
});

//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", () => {
  dropArea.classList.remove("active");
  dragText.textContent = "Drag & Drop to Upload File";
});

//If user drop File on DropArea
dropArea.addEventListener("drop", (event) => {
  event.preventDefault(); //preventing from default behaviour
  //getting user select file and [0] this means if user select multiple files then we'll select only the first one
  file = event.dataTransfer.files[0];
  showVideo(event); //calling function
});

// function showFile(){
//   let fileType = file.type; //getting selected file type
//   let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
//   if(validExtensions.includes(fileType)){ //if user selected file is an image file
//     let fileReader = new FileReader(); //creating new FileReader object
//     fileReader.onload = ()=>{
//       let fileURL = fileReader.result; //passing user file source in fileURL variable
//       let imgTag = `<img src="${fileURL}" alt="">`; //creating an img tag and passing user selected file source inside src attribute
//       dropArea.innerHTML = imgTag; //adding that created img tag inside dropArea container
//     }
//     fileReader.readAsDataURL(file);
//   }else{
//     alert("This is not an Image File!");
//     dropArea.classList.remove("active");
//     dragText.textContent = "Drag & Drop to Upload File";
//   }
// }

function showVideo(e) {
  //let count = 0;
  //let count = sessionStorage.getItem("count");
  //console.log(count)
  dropArea.hidden = true;
  const videoCreate = document.createElement("video");
  if (document.querySelector(".vidElement") !== null) {
    document.querySelector(".vidElement").remove();
    return;
  }
  videoCreate.setAttribute("class", "vidElement")
  if (e.target.files && e.target.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      console.log('loaded')
      videoCreate.src = e.target.result
      videoCreate.controls = true;
      videoCreate.autoplay = true;
    }.bind(this)

    reader.readAsDataURL(e.target.files[0]);
  }
  //vidLayout.append(videoCreate);
  videoCreate.hidden = false;
  left.prepend(videoCreate);
  videoCreate.addEventListener("pause", () => {
    dropArea.hidden = false;
    videoCreate.hidden = true;
    console.log("LOLOLOLOLO")
    let buttonContinue = document.createElement("button");
    buttonContinue.textContent = "Continue Streaming";
    buttonContinue.setAttribute("id", "continue-streaming");
    buttonArea.append(buttonContinue);
    buttonContinue.addEventListener("click", () => {
      dropArea.hidden = true;
      videoCreate.hidden = false;
      buttonContinue.remove();
    })
  });
  // buttonUpload.addEventListener("click", function (e) {
  //   dropArea.hidden = false;
  //   videoCreate.hidden = true;
  //   console.log("LOLOLOLOLO")
  //   buttonUpload.textContent = "Start Streaming"
  // })
  // if (count % 2 !== 0 && count !== 0) {
  //   buttonUpload.addEventListener("click", function (e) {
  //     dropArea.hidden = false;
  //     videoCreate.hidden = true;
  //     console.log("LOLOLOLOLO")
  //     count++;
  //     sessionStorage.setItem("count", count);
  //     buttonUpload.textContent = "Start Streaming"
  //   })
  // } else {
  //   buttonUpload.addEventListener("click", function (e) {
  //     dropArea.hidden = true;
  //     videoCreate.hidden = false;
  //     console.log("LOLOLOLOLO 2222")
  //     buttonUpload.textContent = "Stop Streaming"
  //     count++;
  //     sessionStorage.setItem("count", count);
  //   })
  // }
}

// if (document.querySelector("#stop-streaming") !== null) {
//   changeVid = document.querySelector("#stop-streaming");
//   console.log(changeVid);
//   changeVid.addEventListener("click", function (e) {
//     console.log("Change video button appeared");
//   })
// }
if (changeVid !== '') {
  changeVid.addEventListener("click", function (e) {
    console.log("Change video button appeared");
  })
}
