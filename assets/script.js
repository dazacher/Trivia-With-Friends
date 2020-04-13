var questions = [];
var currentQuestion = 0;

$(document).ready(function () {
    var timerCount;
    var endOfGame = false;
    var shuffledArr;
    //Hides question box till start button is pressed.
    $("#questions").hide();

    // Start button.
    $("#startBtn").on("click", function () {
        // Call the set time function to display it on the page
        setTime();


        // Option selected for number of questions
        var qnumber = $("#numberOfQuestions").children("option:selected").val();
        // Set variable for timer based in number of question input by user. Each question given 15 seconds to answer
        timerCount = 15 * qnumber;
        console.log("qnumber ", qnumber);
        console.log("timerCount ", timerCount);
        // Trying to figure out how to display the timer in minutes and seconds.
        // var minutes = Math.floor(timerCount / 60);
        // var seconds = timerCount - minutes * 60;
        // var finalTime = str_pad_left(minutes,'0',2)+':'+ str_pad_left(seconds,'0',2);
        // formatedTime = str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);

        // console.log("formatedTime ", formatedTime);
        // Option Selected for category
        var cvalue = $("#category").children("option:selected").val();

        // Option selected for difficulty
        var difficulty = $("#difficulty").children("option:selected").val();
        console.log(qnumber, cvalue, difficulty);

        // Api to get the question data from the Open Trivia API
        var apiURL = `https://opentdb.com/api.php?amount=${qnumber}&category=${cvalue}&difficulty=${difficulty}&type=multiple`;


        $.ajax({
            url: apiURL,
            method: "GET"
        })
            .then(function (response) {
                console.log(response);
                $("#startgame").hide();
                $("#questions").show();
                questions = response.results;
                console.log("questions ", questions)
                shuffleArr = [questions[currentQuestion].correct_answer, ...questions[currentQuestion].incorrect_answers].map(a => [Math.random(), a])
                .sort((a, b) => a[0] - b[0])
                .map(a => a[1])

                console.log(shuffleArr)
                displayQuestion();
            });
    });


    // Set the time on the screen and check for end of game
    function setTime() {
        console.log("In setTime function");
        var timerPar = $("#timer");

        timerPar.text = timerCount;

        timerInterval = setInterval(function () {
            timerCount--;
            $("#timer").text(timerCount + " seconds");

            //   Executes when timer is done
            if (timerCount < 1 || endOfGame === true) {
                clearInterval(timerInterval);
                if (timerCount < 0) {
                    timerCount = 0;
                    $("#timer").text(timerCount + " seconds");
                };
                // $("#gameOver").Show("Game Over");
            }
        }, 1000);
    }

    //Function to display question.
    function displayQuestion() {
        // Set up game timer and make it visible
        var quizTimer = $("#timer");
        $("#timer").css("visibility", "visible");
        // Show question on display
        $("#questions").append(`<h1>${questions[currentQuestion].question}</h1><br>`)

        loadAnswers();
        console.log("Message", questions, currentQuestion);

    };

    function loadAnswers() {
        console.log("currentQuestion ", currentQuestion);
        // Load answers onto display
        // $(".b1").attr('click', function (event) { });
        // questions.questions[currentQuestion].correct_answer
        // questions[currentQuestion].incorrect_answers[0]
        // questions[currentQuestion].incorrect_answers[1]
        // questions[currentQuestion].incorrect_answers[2]
        
        $("#questions").append(`<button class="b1 answers button is-danger is-rounded" style:text-align:center; data-answer="${questions[currentQuestion].correct_answer}">${shuffleArr[0]}</button><br>`)


        $("#questions").append(`<button class="b2 answers button is-danger is-rounded" data-answer="${questions[currentQuestion].correct_answer}"> ${shuffleArr[1]}</button><br>`)


        $("#questions").append(`<button class="b3 answers button is-danger is-rounded" data-answer="${questions[currentQuestion].correct_answer}">${shuffleArr[2]}</button><br>`)


        $("#questions").append(`<button class="b4 answers button is-danger is-rounded" data-answer="${questions[currentQuestion].correct_answer}"> ${shuffleArr[3]}</button><br>`)


        // Question timer goes here
        // questionTimer();
        // Move onto the next question
        currentQuestion++;

    }

    $("#questions").on("click", ".b1", function () {
        // function checkAnswer1(event) {
        console.log("In checkAnswer function.")
        apiKey = "dwmJvUX39tGRmMpNFZhIxgzD5J6JuM7K";
        // giphyURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "=The force will be with you&limit=1&offset=0&rating=G&lang=en";

        // $.ajax({
        //     url: giphyURL,
        //     method: "GET"
        // }).then(function (responseData) {
        // console.log("response.Data ", responseData)
        mode = questions.correct_answer;
        if (mode === questions.correct_answer) {
            // mode = questions.answer1.charAt(0);
            apiKey = "dwmJvUX39tGRmMpNFZhIxgzD5J6JuM7K";
            correctGiphyURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "=The force will be with you&limit=1&rating=G&lang=en";

            // $.ajax({
            //     url: correctGiphyURL,
            //     method: "GET"
            // }).then(function (responseCorrectData) {
            // console.log("response.Data ", responseCorrectData);
            // b1.setAttribute("class", questions.correct_answer);
            // var imageUrl = responseCorrectData.data.url;
            var correctAnswerImg = $("<img>");
            // correctAnswerImg.attr("src", imageUrl);
            correctAnswerImg.attr("alt", "Obi-Wan");
            $("#images").append(correctAnswerImg);
            soundManager.play('Obi-Wan');

            // });





            // --------------------------------------------------------------------
            // --------------------------------------------------------------------
            // Incorrect Data Question Answers Code

            //     message.textContent = questions.correctAnswerResponse;
            //     answerMessage.append(message);
        } else if (mode !== correctAnswer) {
            //         apiKey = "dwmJvUX39tGRmMpNFZhIxgzD5J6JuM7K";
            // incorrectGiphyURL = "https://api.giphy.com/v1/gifs/search/" + apiKey + "/q:I have you now/limit:1/rating:g/lang:en";

            // $.ajax({
            //     url: incorrectGiphyURL,
            //     method: "GET"
            // }).then(function (responseIncorrectData) {
            //     console.log("response.Data ", responseIncorrectData)
            //     mode = questions.answer1.charAt(0);
            //     button1.setAttribute("class", questions.answer1.charAt(0));
            //     message = document.createElement("p");
            //     message.textContent = questions.incorrectAnswerResponse;
            //     answerMessage.append(message);
            // //Deduct time if they get the question wrong
            //     if (timerCount <= 10) {
            //         timerCount = 0;
            //     } else {
            //         timerCount = timerCount - 10;
            //     };

        }

        // Move on to the next quetion
        currentQuestion++;


        // });

        // });
    });


    //User ability to select buttons with the right answers.
    // $("#questions").on("click", ".answers", function () {
    //     var userChoice = $(this).text()
    //     var rightAnswer = $(this).attr("data-answer");
    //     if (userChoice === rightAnswer) {

    //         alert("correct");
    //         soundManager.play('Obi-Wan');

    //     } else {
    //         alert("WRONG!")
    //         soundManager.play('DarthVader');
    //     };
    // });

    // Set up sounds to play if answers are correct, incorrect or not answered.
    soundManager.setup({
        // where to find flash audio SWFs, as needed
        url: './assets/I_have_you_now.mp3',
        // onload: function() {
        onready: function () {
            // soundManager.mute('darthVaderSound');
            //   Incorrect Answer Sound
            var darthVaderSound = soundManager.createSound({
                id: 'DarthVader',
                url: './assets/I_have_you_now.mp3'
            });
            darthVaderSound.play();
        }, // SM2 is ready to play audio!
    });

    soundManager.setup({
        // where to find flash audio SWFs, as needed
        url: './assets/The_Force_Will_Be_With_You.mp3',
        // onload: function() {
        onready: function () {
            // soundManager.mute('Obi-wan');
            // Correct answer sound
            var obiwanSound = soundManager.createSound({
                id: 'Obi-Wan',
                url: './assets/The_Force_Will_Be_With_You.mp3'
            });
            obiwanSound.play();
        }, // SM2 is ready to play audio!
    });

    soundManager.setup({
        // where to find flash audio SWFs, as needed
        url: './assets/The_Force_Will_Be_With_You.mp3',
        // onload: function() {
        onready: function () {
            // soundManager.mute('Obi-wan');
            //   Ran out of time - incorrect answer sound
            var darthVader2Sound = soundManager.createSound({
                id: 'DarthVader2',
                url: './assets/Dont_Fail_Me_Again.mp3'
            });
            darthVader2Sound.play();
        }, // SM2 is ready to play audio!
    });
});
