var questions = [];
var currentQuestion = 0;

$(document).ready(function () {
    var timerCount;
    var endOfGame = false;
    var shuffleArr;
    var timerInt;
    var giphyInt;
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
                // When time is up call gameOver functon
                clearDisplay();
                gameOver();
            }
        }, 1000);
    }

    function gameOver() {
        // When time is up clear screen and display Game over
        var gameOverDiv = $("<div class='gameOver'>");
        $("#questions").append(gameOverDiv);
        var gameOverH5 = $("<h1>");
        gameOverH5.text("Game Over");
        gameOverDiv.append(gameOverH5);
        setTimeout(function () {
            $(window).attr('location', './game-page.html');
        }, 5000);
    }
    //Function to display question.
    function displayQuestion() {
        shuffleArr = [questions[currentQuestion].correct_answer, ...questions[currentQuestion].incorrect_answers].map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1])
        console.log("currentQuestion after shuffleArr set ", currentQuestion);
        console.log(shuffleArr)
        // Set up game timer and make it visible
        var quizTimer = $("#timer");
        $("#timer").css("visibility", "visible");
        // Show question on display
        $("#questions").append(`<h1>${questions[currentQuestion].question}</h1><br>`)

        $("#questions").append(`<button class="answers button is-danger is-rounded" style:text-align:center; data-answer="${questions[currentQuestion].correct_answer}">${shuffleArr[0]}</button><br>`)
    

        $("#questions").append(`<button class="answers button is-danger is-rounded" data-answer="${questions[currentQuestion].correct_answer}">${shuffleArr[1]}</button><br>`)


        $("#questions").append(`<button class="answers button is-danger is-rounded" data-answer="${questions[currentQuestion].correct_answer}">${shuffleArr[2]}</button><br>`)


        $("#questions").append(`<button class="answers button is-danger is-rounded" data-answer="${questions[currentQuestion].correct_answer}">${shuffleArr[3]}</button><br>`)


        clearTimeout(timerInt);
        clearTimeout(giphyInt);
        console.log("Message", questions, currentQuestion);
        questionTimer();

    };

    // Verify the answers clicked on as to correct or incorrect then clear the display and moveon to next question.
    $("#questions").on("click", ".answers", function () {

        // Grab current text from button
        var currentText = $(this).text();
        console.log("currentText ", currentText)
        // grab correct answer
        var correctAnswer = questions[currentQuestion].correct_answer;
        console.log("correctAnswer ", correctAnswer);
        // compare current text to
        if (currentText === correctAnswer) {
            clearDisplay();
            console.log("In the correct if statement");
            soundManager.play('Obi-Wan');
            apiKey = "dwmJvUX39tGRmMpNFZhIxgzD5J6JuM7K";
            correctGiphyURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=The force will be with you&limit=1&rating=G&lang=en";

            $.ajax({
                url: correctGiphyURL,
                method: "GET"
            }).then(function (responseCorrectData) {
                console.log("response.Data ", responseCorrectData);
                correctInt = setTimeout(function () {
                var correctImageUrl = responseCorrectData.data[0].images.original.url;
                var correctAnswerImg = $("<img>");
                correctAnswerImg.attr("src", correctImageUrl);
                correctAnswerImg.attr("alt", "Obi-Wan");
                $("#questions").append(correctAnswerImg);
            }, 100);

                // Show giphy for 3 seconds then clear screen move to next question and display to screen
                correctAnswerInt = setTimeout(function () {
                    clearDisplay();
                    currentQuestion++;
                    displayQuestion();
                    // Reset questionTimer
                    count = 15;
                }, 3000);
            });

        } else if (currentText !== correctAnswer) {
            // } else {
            // Incorrect Data Question Answers Code
            clearDisplay();
            // soundManager.unmute('DarthVader');
            console.log("In the incorrect part of the if statement");
            soundManager.play('DarthVader');
            apiKey = "dwmJvUX39tGRmMpNFZhIxgzD5J6JuM7K";
            incorrectGiphyURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=Darth vader I have you know&limit=1&offset=0&rating=G&lang=en";

            $.ajax({
                url: incorrectGiphyURL,
                method: "GET"
            }).then(function (responseIncorrectData) {
                console.log("response.Data ", responseIncorrectData)
                incorrectAnswerInt = setTimeout(function () {
                    var incorrectImageUrl = responseIncorrectData.data[0].images.original.url;
                    var incorrectAnswerImg = $("<img>");
                    incorrectAnswerImg.attr("src", incorrectImageUrl);
                    incorrectAnswerImg.attr("alt", "Darth Vader");
                    $("#questions").append(incorrectAnswerImg);
                    //Deduct time if they get the question wrong
                    if (timerCount <= 10) {
                        timerCount = 0;
                    } else {
                        timerCount = timerCount - 10;
                    }
                    // Wait .1 seconds to show no question answered giphy and play associated sound
                    soundManager.play('DarthVader');
                }, 100);
               
                // Show giphy for 3 seconds then clear screen move to next question and display to screen
                wrongAnswerInt = setTimeout(function () {
                    clearDisplay();
                    currentQuestion++;
                    displayQuestion();
                    // Reset questionTimer
                    count = 15;
                }, 3000);
            });
        }

        // currentQuestion++;
        // clearDisplay();
        // displayQuestion();
    });


    function clearDisplay() {

        // Empty the div
        $(".triviaQuestions").empty();

    }

    var count = 15;
    function questionTimer() {
        console.log("In questionTimer function");

        timerInt = setTimeout(function () {

            //   Executes when timer is done
            if (count === 0) {
                console.log("Count is " + count);
                console.log("In if statement of questionTimer");
                timerCount = 0;
                console.log(" If Statement Game is over!");
                console.log("TimerCount is " + timerCount);
                endOfGame = true;
                clearTimeout(timerInt);

            } else {
                // If user can not answer question count it wrong, deduct time and play special music and show special giphy. Increment currentQuestion count
                console.log("in else of questionTimer");
                console.log(count);
                console.log("In the incorrect part of the if statement");

                if (timerCount <= 10) {
                    timerCount = 0;
                } else {
                    timerCount = timerCount - 10;
                }
                clearDisplay();
            }
            if (endOfGame === true) {
                console.log("End of Game If statement")
                clearInterval(timerInterval);
                gameOver();
            }
            count--;
            // Insert the giphy
            giphyInt = setTimeout(function () {
                // Wait .1 seconds to show no question answered giphy and play associated sound
                soundManager.play('DarthVader2');
                apiKey = "dwmJvUX39tGRmMpNFZhIxgzD5J6JuM7K";
                noAnswerGiphyURL = "https://api.giphy.com/v1/gifs/search?api_key=" + apiKey + "&q=Darth Vader Dont fail me again&limit=25&offset=0&rating=G&lang=en";
                $.ajax({
                    url: noAnswerGiphyURL,
                    method: "GET"
                }).then(function (responseNoAnswerData) {
                    console.log("response.Data ", responseNoAnswerData)
                    var noAnswerImageUrl = responseNoAnswerData.data[6].images.original.url;
                    var noAnswercorrectAnswerImg = $("<img>");
                    noAnswercorrectAnswerImg.attr("src", noAnswerImageUrl);
                    noAnswercorrectAnswerImg.attr("alt", "Darth Vader2");
                    $("#questions").append(noAnswercorrectAnswerImg);       
                });
            }, 100);
            // Show giphy for 3 seconds then clear screen move to next question and display to screen
            newQuestionInt = setTimeout(function () {
                clearDisplay();
                currentQuestion++;
                displayQuestion();
            }, 3000);
            // clearInterval(giphyInt);
        }, 15000);
        // Reset questionTimer
        count = 15;
    }

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
        url: './assets/Dont_Fail_Me_Again.mp3',
        // onload: function() {
        onready: function () {
            //  soundManager.mute('DarthVader2');
            //   Ran out of time - incorrect answer sound
            var darthVader2Sound = soundManager.createSound({
                id: 'DarthVader2',
                url: './assets/Dont_Fail_Me_Again.mp3'
            });
            darthVader2Sound.play();
        }, // SM2 is ready to play audio!
    });
});
