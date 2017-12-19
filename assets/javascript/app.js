$("document").ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyB0XfTFWsIlLyc67Tr9K6m4aEkO5Hua9rU",
        authDomain: "gbmahili-train-time.firebaseapp.com",
        databaseURL: "https://gbmahili-train-time.firebaseio.com",
        projectId: "gbmahili-train-time",
        storageBucket: "gbmahili-train-time.appspot.com",
        messagingSenderId: "204544333050"
    };
    firebase.initializeApp(config);
    // We are referencing our database in firebase

    var database = firebase.database();

    // event listener on click Submit button
    $("#add-train").on("click", function (event) {
        //Prevent page reload
        event.preventDefault();
        console.log("clickeed to add")

        // retreiving user input values and save them in an object
        train = {
            trainName: $("#train-name").val().trim(),
            destination: $("#destination").val().trim(),
            firstTrainTime: $("#first-train-time").val().trim(),
            frequency: parseInt($("#frequency").val().trim())
        };

        //we are emptying the input values 
        $(".form-control").val("");
        
        // we are pushing it to database
        database.ref().push(train);
    });

    //Retrieve Data From the Database
    setInterval(() => {
    $("#train-schedule").empty();
    database.ref().on("child_added", function (childSnapshot) {
        //Create a varriable that stores the data from the
        var trainsData = childSnapshot.val();       
        //First, let's convert the time given by the user.
        var convertedFirstTrainTime = moment(trainsData.firstTrainTime, "HH:mm").subtract(1, "years");
        //We then get the difference between the curent time
        var diffBetweenNowAndFirstTrainTime = moment().diff(moment(convertedFirstTrainTime), "minutes");
        var timeRemaining = diffBetweenNowAndFirstTrainTime % trainsData.frequency;
        var mininutesAway = trainsData.frequency - timeRemaining;
        nextArrival = moment().add(mininutesAway, "minutes");
        nextArrival = moment(nextArrival).format("HH:mm");
            
            //Create a table dynamically
            $("#train-schedule").append(
                "<tr> <td>" + trainsData.trainName + "</td>" +
                "<td>" + trainsData.destination + "</td>" +
                "<td>" + trainsData.frequency + "</td>" +
                //Get the difference between today using moment() and the date the employee started working
                "<td>" + nextArrival + "</td>" +
                "<td>" + mininutesAway + "</td></tr>"
            );

        
    },
        function (error) {
            console.log("There is an error" + error.code());
        }
    );

    }, 1000);

});