var questions = [];
var currentQuestion = 0;

$(document).ready(function () {
    var timerCount;
    var endOfGame = false;
    var shuffleArr;
    var timerInt;
    var giphyInt;
    var qnumber;
    var questionCount;
    var timerInterval;
    //Hides question box till start button is pressed.
    $("#questions").hide();

    // Start button.
    $("#startBtn").on("click", function () {
        // Call the set time function to display it on the page
        setTime();

        // Option selected for number of questions
        qnumber = $("#numberOfQuestions").children("option:selected").val();
        // Set end of game counter for question timer
        questionCount = qnumber;
        console.log("where questionCount is set ", questionCount)
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
            if (timerCount < 1 || currentQuestion >= qnumber) {
                clearInterval(timerInterval);
                // If the game timer is less than zero set it to zero - no negative time.
                if (timerCount < 0) {
                    timerCount = 0;
                    $("#timer").text(timerCount + " seconds");

                } else {
                    // Otherwise just stop the game clock, and record the time as it is for high score in gamepver function.
                    clearInterval(timerInterval);

                };
                // When time is up call gameOver functon
                console.log("settime clear display")
                clearDisplay();
                console.log("settimer function gameover call")
                // Cancel question timer
                endOfGame = true;
                clearInterval(timerInt);
                clearInterval(giphyInt);
                gameOver();
            }
        }, 1000);
    }

    function gameOver() {
        console.log("Game over function");
        // When time is up display Game over and high score
        var gameOverDiv = $("<div class='gameOver'>");
        $(".triviaQuestions").append(gameOverDiv);
        var gameOverH1 = $("<h1>");
        gameOverH1.text("Game Over");
        gameOverDiv.append(gameOverH1);

        var highScoreMsgH1 = $("<h1>");
        highScoreMsgH1.text("High score: " + timerCount);
        gameOverDiv.append(highScoreMsgH1);

        // have user enter name and push submit button to save data to localstorage
        // H1 for Label to enter the name
        var nameH1 = $("<h1>");
        nameH1.text("Enter name Here: ");
        gameOverDiv.append(nameH1);
        // Input box to enter the name
        var inputBoxName = $("<input>");
        inputBoxName.attr("id", "userInputName")
        gameOverDiv.append(inputBoxName);
        //Button to submit the name and high score to local storage
        var submitButton = $("<button>");
        submitButton.text("Submit");
        submitButton.attr("class", "submitBtn");
        gameOverDiv.append(submitButton);

        // Submit button click loads the information to local storage
        $(".submitBtn").on("click", function () {
            console.log("submit button clicked")
            localStorage.getItem("userHighScores");
            let userHighScores = JSON.parse(localStorage.getItem("userHighScores"));
            // if no highscores exist in localstorage create an array to start storing them in
            if (!userHighScores) {
                userHighScores = [];
            };

            inputboxName = $("#userInputName").val();
            console.log("userHighScores ", userHighScores);
            console.log("inputBoxName.text ", inputboxName);
            console.log("SubmitButton pushed");
            var userObj = {
                highScore: timerCount,
                name: inputboxName
            };
            // Push the user oject with name and high score into the array 
            userHighScores.push(userObj);
            // Sort the high scores from highest to lowest
            let sortedHighScores = userHighScores.sort(function (a, b) {
                return (b.highScore - a.highScore);
            });
            // Put the data into local storage
            localStorage.setItem("userHighScores", JSON.stringify(sortedHighScores));
            console.log(sortedHighScores);
            // Clear the page for reload
            $("#questions").empty();
            // go to highscores page
            setTimeout(function () {
                $(window).attr('location', './game-page.html');
            }, 500);
        });
    };

    //Function to display question.
    function displayQuestion() {
        console.log("currentQuestion in displayQuestion ", currentQuestion);
        if (currentQuestion >= questions.length) {
            console.log("if (currentQuestion >= questions.length) ")
            return false;
        } else if (timerCount === 0) {
            return false;
        }
        // Shuffle the answers so they are random
        shuffleArr = [questions[currentQuestion].correct_answer, ...questions[currentQuestion].incorrect_answers].map(a => [Math.random(), a])
            .sort((a, b) => a[0] - b[0])
            .map(a => a[1])
        console.log("currentQuestion after shuffleArr set ", currentQuestion);
        console.log(shuffleArr)
        // Set up game timer and make it visible
        $("#timer").css("visibility", "visible");
        // Show question on display

        $("#questions").append(`<h1>${questions[currentQuestion].question}</h1><br>`)
        // Take the correctAnswer from the respose and take out the html syntax
        var correctAnswer = $('<textarea />').html(questions[currentQuestion].correct_answer).text();

        console.log("correctAnswerEscape ", correctAnswer);

        $("#questions").append(`<button class="answers button is-danger is-rounded" data-answer="${correctAnswer}">${shuffleArr[0]}</button><br>`)

        $("#questions").append(`<button class="answers button is-danger is-rounded" data-answer="${correctAnswer}">${shuffleArr[1]}</button><br>`)

        $("#questions").append(`<button class="answers button is-danger is-rounded" data-answer="${correctAnswer}">${shuffleArr[2]}</button><br>`)

        $("#questions").append(`<button class="answers button is-danger is-rounded" data-answer="${correctAnswer}">${shuffleArr[3]}</button><br>`)

        console.log("Message", questions, currentQuestion);
        // Reset timers
        clearTimeout(timerInt);
        clearTimeout(giphyInt);
        questionTimer();
    };

    // Verify the answers clicked on as to correct or incorrect then clear the display and moveon to next question.
    $("#questions").on("click", ".answers", function () {

        // Grab current text from button
        var currentText = $(this).text();
        console.log("currentText ", currentText)
        // grab correct answer
        var correctAnswer = $('<textarea />').html(questions[currentQuestion].correct_answer).text();
        console.log("correctAnswer ", correctAnswer);
        // compare current text to correct answer
        if (currentText === correctAnswer) {
            console.log("compare current text to correct answer clear display")
            clearDisplay();
            console.log("In the correct if statement");
            soundManager.play('Obi-Wan');
            apiKey = "dwmJvUX39tGRmMpNFZhIxgzD5J6JuM7K";
            correctGiphyURL = "https://api.giphy.com/v1/gifs/TwmEnGgxdUT4Y?api_key=" + apiKey;
            // Get giphy for correct answer
            $.ajax({
                url: correctGiphyURL,
                method: "GET"
            }).then(function (responseCorrectData) {
                console.log("response.Data ", responseCorrectData);
                correctInt = setTimeout(function () {
                    var correctImageUrl = responseCorrectData.data.images.original.url;
                    // Build the image layout to display on the page
                    var correctAnswerImg = $("<img>");
                    correctAnswerImg.attr("src", correctImageUrl);
                    correctAnswerImg.attr("alt", "Yoda");
                    $("#questions").append(correctAnswerImg);
                }, 100);

                // Show giphy for 3 seconds then clear screen move to next question and display to screen
                correctAnswerInt = setTimeout(function () {
                    if (endOfGame === true) {
                        return false;
                    }
                    console.log("correctAnswerInt clear display")
                    clearDisplay();
                    currentQuestion++;
                    displayQuestion();
                }, 3000);
            });
        } else {

            console.log("incorrect answer clear display")
            clearDisplay();
            console.log("In the incorrect else statement");
            soundManager.play('DarthVader');
            apiKey = "dwmJvUX39tGRmMpNFZhIxgzD5J6JuM7K";
            incorrectGiphyURL = "https://api.giphy.com/v1/gifs/ZX6NHzA9Fcddm?api_key=" + apiKey;
            // Get giphy for incorrect answer
            $.ajax({
                url: incorrectGiphyURL,
                method: "GET"
            }).then(function (responseIncorrectData) {
                console.log("response.Data ", responseIncorrectData);
                incorrectInt = setTimeout(function () {
                    var incorrectImageUrl = responseIncorrectData.data.images.original.url;
                    // Build the image layout to display on the page
                    var incorrectAnswerImg = $("<img>");
                    incorrectAnswerImg.attr("src", incorrectImageUrl);
                    incorrectAnswerImg.attr("alt", "Darth Vader");
                    $("#questions").append(incorrectAnswerImg);
                }, 100);
                // Deduct 10 seconds from the game time as a penalty
                timerCount = timerCount - 10;
                // Show giphy for 3 seconds then clear screen move to next question and display to screen
                incorrectAnswerInt = setTimeout(function () {
                    if (endOfGame === true) {
                        return false;
                    }
                    console.log("incorrectAnswerInt clear display")
                    clearDisplay();
                    currentQuestion++;
                    displayQuestion();
                }, 3000);
            });
        };
    });

    function clearDisplay() {
        console.log("Clear display called.")
        // Empty the div
        $(".triviaQuestions").empty();

    }

    function questionTimer() {

        // Decrement how many questions are remaining for question timer to keep track of end of game.
        questionCount--;
        console.log("In questionTimer function");
        console.log("Question count inside questionTimer after it has been deducted ", questionCount, qnumber);
        timerInt = setTimeout(function () {
            console.log("Question count in settimeout function of questionTimer ", questionCount);
            //   If there are no more questions left, game if over
            if (questionCount === 0) {
                console.log("If questionCount is 0" + questionCount);
                console.log("In if statement of questionTimer");
                console.log(" If Statement Game is over!");
                console.log("TimerCount is " + timerCount);

                endOfGame = true;
                clearTimeout(timerInt);

            } else if (setTime <= 10) {
                clearInterval(timerInt);
                endOfGame = true;
                // endOfGame()
            } else {
                // If user can not answer question count it wrong, deduct time and play special music and show special giphy. Increment currentQuestion count
                console.log("in else of questionTimer");
                console.log("Else questionCount is not zero and no answer in queestionTimer is " + questionCount);
                console.log("In the can't answer part of the if statement clear display");
                clearDisplay();
                // Insert the giphy
                giphyInt = setTimeout(function () {
                //    Deduct 10 seconds if they are unable to quess at an answer
                    timerCount = timerCount - 10;
                    
                    // Wait .1 seconds to show no question answered giphy and play associated sound
                    soundManager.play('DarthVader2');
                    apiKey = "dwmJvUX39tGRmMpNFZhIxgzD5J6JuM7K";
                    noAnswerGiphyURL = "https://api.giphy.com/v1/gifs/1FZqAOn4hzGO4?api_key=" + apiKey;
                    $.ajax({
                        url: noAnswerGiphyURL,
                        method: "GET"
                    }).then(function (responseNoAnswerData) {
                        console.log("response.Data ", responseNoAnswerData)
                        var noAnswerImageUrl = responseNoAnswerData.data.images.original.url;
                        var noAnswercorrectAnswerImg = $("<img>");
                        noAnswercorrectAnswerImg.attr("src", noAnswerImageUrl);
                        noAnswercorrectAnswerImg.attr("alt", "Darth Vader2");
                        $("#questions").append(noAnswercorrectAnswerImg);
                    });
                }, 100);
                // Show giphy for 3 seconds then clear screen move to next question and display to screen
                newQuestionInt = setTimeout(function () {
                    console.log("no answer giphy clear display timeout")
                    clearDisplay();
                    currentQuestion++;
                    displayQuestion();
                }, 3000);
            }
            // If it's the end of game stop all the timers and call the endOfGame function
            if (endOfGame === true) {
                console.log("End of Game If statement in 15 second timer")
                clearInterval(timerInterval);
                clearInterval(timerInt);
                clearInterval(giphyInt);
                gameOver();
            }
        }, 15000);
    }

    // Set up sounds to play if answers are correct, incorrect or not answered.
    soundManager.setup({
        // where to find flash audio SWFs, as needed
        url: './assets/I_have_you_now.mp3',

        onready: function () {

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

        onready: function () {

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

        onready: function () {

            //   Ran out of time - incorrect answer sound
            var darthVader2Sound = soundManager.createSound({
                id: 'DarthVader2',
                url: './assets/Dont_Fail_Me_Again.mp3'
            });
            darthVader2Sound.play();
        }, // SM2 is ready to play audio!
    });
});