$(document).ready(function (){

    let userHighScores = JSON.parse(localStorage.getItem("userHighScores"));
    for (var i = 0; i < Math.min(userHighScores.length, 10); i++) {
        $(".high-score-" + (i + 1)).text(userHighScores[i].highScore + " - " + userHighScores[i].name);
    };



});

