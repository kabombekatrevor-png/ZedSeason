const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const storage = firebase.storage();
const db = firebase.firestore();

const ADMIN_EMAIL = "youradminemail@gmail.com";

function login() {
  auth.signInWithEmailAndPassword(email.value, password.value);
}

auth.onAuthStateChanged(user => {
  if (user && user.email !== ADMIN_EMAIL) {
    alert("Access denied");
    window.location.href = "index.html";
  }
});

function uploadMusic() {
  const song = musicFile.files[0];
  const cover = coverFile.files[0];

  const songRef = storage.ref("songs/" + Date.now() + song.name);
  const coverRef = storage.ref("covers/" + Date.now() + cover.name);

  songRef.put(song).then(() => {
    songRef.getDownloadURL().then(songURL => {
      coverRef.put(cover).then(() => {
        coverRef.getDownloadURL().then(coverURL => {

          db.collection("songs").add({
            title: title.value,
            artist: artist.value,
            genre: genre.value,
            songURL,
            coverURL,
            type: song.type.includes("video") ? "video" : "audio",
            views: 0,
            likes: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });

          alert("Upload successful");
        });
      });
    });
  });
}