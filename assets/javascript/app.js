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

    //Retrieve Data From the Database: This should be done every one second...
    setInterval(() => {
    //First, we empty the train schedule table
    $("#train-schedule").empty();
    //Then we get the data from firebase
    database.ref().on("child_added", function (childSnapshot) {
        //Create a varriable that stores the data from the
        var trainsData = childSnapshot.val();       
        //First, let's convert the time given by the user.
        var convertedFirstTrainTime = moment(trainsData.firstTrainTime, "HH:mm").subtract(1, "years");
        //We then get the difference between the curent time and the time when the train will arrive
        var diffBetweenNowAndFirstTrainTime = moment().diff(moment(convertedFirstTrainTime), "minutes");
        //Calculate the time remaining
        var timeRemaining = diffBetweenNowAndFirstTrainTime % trainsData.frequency;
        //get minutes away here
        var mininutesAway = trainsData.frequency - timeRemaining;
        //Calculate nextArrival here
        nextArrival = moment().add(mininutesAway, "minutes");
        nextArrival = moment(nextArrival).format("HH:mm");
            
            //Create a table dynamically
            $("#train-schedule").append(
                //Print Train Name here
                "<tr> <td>" + trainsData.trainName + "</td>" +
                //Print destination name here
                "<td>" + trainsData.destination + "</td>" +
                //Print train frequency here
                "<td>" + trainsData.frequency + "</td>" +
                //Print next arrival time here
                "<td>" + nextArrival + "</td>" +
                //Print minutes away here
                "<td>" + mininutesAway + "</td></tr>"
            );        
    },
        function (error) {
            //Log the erro if it is present
            console.log("There is an error" + error.code());
        }
    );

    }, 1000);

});