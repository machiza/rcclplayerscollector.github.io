const teams = [
  {
    "name": "Agri-Sul",
    "fullName": "Agri-Sul Futebol Clube",
    shortName: "Agri-Sul FC"
  },
  {
    "name": "Babalaza",
    "fullName": "Babalaza Futebol Clube",
    shortName: "Babalaza FC"
  },
  {
    "name": "Baptine",
    "fullName": "Baptine Futebol Clube",
    shortName: "Baptine FC"
  },
  {
    "name": "Chelsea",
    "fullName": "Chelsea Futebol Clube",
    shortName: "Chelsea FC"
  },
  {
    "name": "Corumana",
    "fullName": "Corumana Futebol Clube",
    shortName: "Corumana FC"
  },
  {
    "name": "Dakar",
    "fullName": "Dakar Futebol Clube",
    shortName: "Dakar FC"
  },
  {
    "name": "Freitas",
    "fullName": "Freitas Futebol Clube",
    shortName: "Freitas FC"
  },
  {
    "name": "Mahungo",
    "fullName": "Mahungo Futebol Clube",
    shortName: "Mahungo FC"
  },
  {
    "name": "Mavunguana",
    "fullName": "Mavunguana Futebol Clube",
    shortName: "Mavunguana FC"
  },
  {
    "name": "Mucacaza",
    "fullName": "Mucacaza Futebol Clube",
    shortName: "Mucacaza FC"
  },
  {
    "name": "Sabie",
    "fullName": "Sabie Futebol Clube",
    shortName: "Sabie FC"
  },
  {
    "name": "Tchuela",
    "fullName": "Tchuela Futebol Clube",
    shortName: "Tchuela FC"
  },
  {
    "name": "Agri-Sul1",
    "fullName": "Babalaza Futebol Clube",
    shortName: "Babalaza FC"
  },
  {
    "name": "Babalaza1",
    "fullName": "Babalaza Futebol Clube",
    shortName: "Babalaza FC"
  }
]

// const myTeams = JSON.parse(teams);

var selectElement = document.querySelector("select");

function setTeams() {
  selectElement.innerHTML = '';

  for (const team of teams) {
    var optionElement = document.createElement('option');
    var shortName = document.createTextNode(team.shortName);

    optionElement.text = team.shortName
    optionElement.value = team.shortName
    selectElement.appendChild(optionElement);
  }  
}

setTeams();

var myInput = document.getElementById('photo');

function sendPic() {
    var file = myInput.files[0];

    // Send file here either by adding it to a `FormData` object 
    // and sending that via XHR, or by simply passing the file into 
    // the `send` method of an XHR instance.
}

myInput.addEventListener('change', sendPic, false);

var firebaseConfig = {
  apiKey: "AIzaSyBL1Z0xIrNTaojvv4Xc2ZvhpuE-pk6JXWM",
  authDomain: "wild-and-free-foundation.firebaseapp.com",
  databaseURL: "https://wild-and-free-foundation.firebaseio.com",
  projectId: "wild-and-free-foundation",
  storageBucket: "wild-and-free-foundation.appspot.com",
  messagingSenderId: "753693107985",
  appId: "1:753693107985:web:d3581586c90fb91e338eb0"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var db = firebase.firestore();
var storage = firebase.storage();

var storageRef = storage.ref();

function addPlayer() {
  let player = {
    team: document.querySelector("#team").value,
    name: document.querySelector("#name").value,
    lastName: document.querySelector("#lastName").value,
    birthDate: document.querySelector("#birthDate").value,
    height: document.querySelector("#height").value,
    foot: document.querySelector("#foot").value,
    position: document.querySelector("#position").value,
    dream: document.querySelector("#dream").value,
    photo: ''
  }

  var file = myInput.files[0];

  const splitPhotoName = file.name.split(".");
  const photoExtension = splitPhotoName[splitPhotoName.length - 1];
  const photoName = player.name+''+player.lastName+'.'+photoExtension;

  var uploadTask = storageRef.child(`players/${team}/${photoName}`).put(file);
  
  uploadTask.on('state_changed', function(snapshot){
    // Observe state change events such as progress, pause, and resume
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case firebase.storage.TaskState.PAUSED: // or 'paused'
        console.log('Upload is paused');
        break;
      case firebase.storage.TaskState.RUNNING: // or 'running'
        console.log('Upload is running');
        break;
    }
  }, function(error) {
    // Handle unsuccessful uploads
  }, function() {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
      player.photo = downloadURL;
      db.collection("players").add(player)
      .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        console.error("Error adding document: ", error);
      });
      console.log('File available at', downloadURL);
    });
  });
}

