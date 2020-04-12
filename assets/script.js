var questions = [];
var currentQuestion = 0;

$(document).ready(function () {
    //Hides question box till start button is pressed.
    $("#questions").hide();
    
    // Start button.
    $("#startBtn").on("click", function () {

        var qnumber = $("#numberOfQuestions").children("option:selected").val();
        var cvalue = $("#category").children("option:selected").val();
        var difficulty = $("#difficulty").children("option:selected").val();
        console.log(qnumber, cvalue, difficulty);
        var apiURL = `https://opentdb.com/api.php?amount=${qnumber}&category=${cvalue}&difficulty=${difficulty}&type=multiple`;

        $
            .ajax({
                url: apiURL,
                method: "GET"
            })
            .then(function (response) {
                console.log(response);
                $("#startgame").hide();
                $("#questions").show();
                questions = response.results;
                display();
            });


    });

    //Function to display questions and answers.
    function display() {
        console.log("Message", questions, currentQuestion);
        $("#questions").append(`<h1>${questions[currentQuestion].question}</h1><br>`)
        $("#questions").append(`<button class="answers button is-danger is-rounded" style:text-align:center; data-answer="${questions[currentQuestion].correct_answer}">${questions[currentQuestion].correct_answer}</button><br>`)
        $("#questions").append(`<button class="answers button is-danger is-rounded" ${questions[currentQuestion].incorrect_answers[0]}">${questions[currentQuestion].incorrect_answers[0]}</button><br>`)
        $("#questions").append(`<button class="answers button is-danger is-rounded" ${questions[currentQuestion].incorrect_answers[1]}">${questions[currentQuestion].incorrect_answers[1]}</button><br>`)
        $("#questions").append(`<button class="answers button is-danger is-rounded" ${questions[currentQuestion].incorrect_answers[2]}">${questions[currentQuestion].incorrect_answers[2]}</button><br>`)
        
    };

    //User ability to select buttons with the right answers.
    $("#questions").on("click", ".answers", function () {
        var userChoice = $(this).text()
        var rightAnswer = $(this).attr("data-answer");
        if (userChoice === rightAnswer) {
            alert("correct");
        } else alert("WRONG!");
    });
});
