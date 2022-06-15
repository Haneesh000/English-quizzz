const express = require("express");
const _ = require("lodash");
const firebaseApp = require("firebase/app");
const firebaseDB = require("firebase/firestore");
const https = require("https");

const firebaseConfig = {
    apiKey: "AIzaSyBz1kOpHGbECrAVDQAQN217ycfbM0VjC20",
    authDomain: "english-quizzz.firebaseapp.com",
    projectId: "english-quizzz",
    storageBucket: "english-quizzz.appspot.com",
    messagingSenderId: "531636974687",
    appId: "1:531636974687:web:987866ab854ddf5f9597ea",
    measurementId: "G-0GCR06880E"
};

const fbApp = firebaseApp.initializeApp(firebaseConfig);
const db = firebaseDB.getFirestore(fbApp);

const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/quiz", async (req, res) => {
    const docRef = firebaseDB.doc(db, "Quizes", "today");
    const docSnap = await firebaseDB.getDoc(docRef);  

    res.render("quiz", {
        question1: docSnap.data().Question1,
        question2: docSnap.data().Question2,
        question3: docSnap.data().Question3,
        question4: docSnap.data().Question4,
        question5: docSnap.data().Question5,
        value: "today"
    });
});

app.get("/developer", (req, res) => {
    res.render("developer");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.get("/my-account", (req, res) => {
    res.render("my-account");
});

app.get("/my-account/update", (req, res) => {
    res.render("update");
});

app.post("/quiz", async (req, res) => {
    const quizName = req.body.quizName;

    const docRef = firebaseDB.doc(db, "Quizes", quizName);
    const docSnap = await firebaseDB.getDoc(docRef);

    const value1 = req.body.questiononeblank;
    const value2 = req.body.questiontwoblank;
    const value3 = req.body.questionthreeblank;
    const value4 = req.body.questionfourblank;
    const value5 = req.body.questionfiveblank;

    var score = 0;

    var q1 = false;
    var q2 = false;
    var q3 = false;
    var q4 = false;
    var q5 = false;

    if(_.lowerCase(value1) == _.lowerCase(docSnap.data().Q1Ans)) {
        score += 1;
        q1 = true;
    }
    if(_.lowerCase(value2) == _.lowerCase(docSnap.data().Q2Ans)) {
        score += 1;
        q2 = true;
    }
    if(_.lowerCase(value3) == _.lowerCase(docSnap.data().Q3Ans)) {
        score += 1;
        q3 = true;
    }
    if(_.lowerCase(value4) == _.lowerCase(docSnap.data().Q4Ans)) {
        score += 1;
        q4 = true;
    }
    if(_.lowerCase(value5) == _.lowerCase(docSnap.data().Q5Ans)) {
        score += 1;
        q5 = true;
    }
    
    res.render("results", {marks: score, maxMarks: 5})
});

app.get("/hash/:password", async (req, res) => {
    const password = req.params.password;
    https.get("https://api.hashify.net/hash/md5/hex?value="+password, (response) => {
        response.on("data", (data) => {
            const jsonData = JSON.parse(data);
            res.json({originalPassword: password, hashedPassword: jsonData.Digest});
        });
    });
});

app.get("/quiz-history", async (req, res) => {
    const querySnapshot = await firebaseDB.getDocs(firebaseDB.collection(db, "Quizes"));
    var quizzes = [];
    querySnapshot.forEach(doc => {
        quizzes.push(doc.data());
    });
    quizzes.forEach(quiz => {
        console.log(quiz.Q1Ans);
    })
    // res.render("quiz-history", {quizzes:quizzes});
    res.send("Page under development");
});

app.get("/admin", (req, res) => {
    res.render("admin");
});

app.get("/admin/manage-administrators", (req, res) => {
    res.render("manage-admins");
});

app.get("/admin/manage-users", (req, res) => {
    res.render("manage-users");
});

app.use(function(req, res) {
    res.status(404);
    if (req.accepts('html')) {
      res.render('404', { url: req.url });
      return;
    }
    if (req.accepts('json')) {
      res.json({ error: 'Not found' });
      return;
    }
    res.type('txt').send('Not found');
});

app.listen(process.env.PORT || 5500, () => {
    console.log("Server is started at port 5500");
});
