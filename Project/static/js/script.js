$(document).ready(function() {
    // Initialize variables
    var score = 0;
    var lives = 3;
    var currentScore = 5;
    var timeElapsed = 0;
    var questionsSolved = 0;
    var result;
    var timerInterval; // interval object for timer
    var timerValue; // number of seconds elapsed

    // Hide elements initially
    $(".status-container, .score-container, .problem-container, #submit, .timer-container, .Rules-container, #next, .game-over, #restart").hide();

    // Event handler for start button click
    $("#start").click(function() {
        timeElapsed = 0;
        questionsSolved = 0;
        generateEquation();
        startTimer();
        $(".status-container, .score-container, .problem-container, #submit, .timer-container").show();
        $("#start, #rules, .Rules-container").hide();
        timerValue = 0;
        $("#timer").text(timerValue);
        clearInterval(timerInterval);
        startTimer();
    });

    // Event handler for rules button click
    $("#rules").click(function() {
        $(".Rules-container").show();
        $("#rules").hide();
    });

    $("#next").click(function() {
        generateEquation();
        timerValue = 0;
        startTimer();
        $("#timer").text(timerValue);
        clearInterval(timerInterval);
        startTimer();
        $("#answer").val("");
        $("#next").hide();
        $("#submit").show();
        $("#status").text("");
    });

    $("#restart").click(function() {
        score = 0;
        lives = 3;
        $("#lives").text(lives);
        $("#score").text(score);
        $(".game-over, #restart").hide();
        $("#start, #rules").show();
        location.reload();
    });

    // Event handler for submit button click
    $("#submit").click(function() {
        var answer = Number($("#answer").val());
        if(answer == "") return;
        clearInterval(timerInterval); // Stop the timer
        if (answer == result) {
            score += currentScore;
            $("#score").text(score);
            $("#status").text("Correct!").css("color", "green");
            questionsSolved += 1;   
        } else {
            lives -= 1;
            if (lives == 0) {
                $(".status-container, .score-container, .problem-container, #submit, .timer-container, .Rules-container, #next").hide();
                $(".game-over, #restart").show();
                $("#finalScore").text(score);
                clearInterval(timerInterval);
                sendScoreToServer();
                return;
            }
            $("#status").text("Wrong!" + "\n Answer is " + result).css("color", "red");
            $("#lives").text(lives);
        }   
        timerValue = 0;
        currentScore = 5;
        $("#next").show();
        $("#submit").hide();

    });
    
    

    // Function to start the timer
    function startTimer() {
        timerInterval = setInterval(function() {
            timerValue += 1;
            timeElapsed += 1;
            $("#timer").text(timerValue);
            if(timerValue > 5) {
                currentScore -= 1;
            }
            if (timerValue >= 10) {
                timerValue = 0;
                clearInterval(timerInterval);
                $("#next").show();
                $("#submit").hide();
            }
        }, 1000);
    }

    // Generate a random number
    function generateRandomNumber() {
        return Math.floor(Math.random() * 10) + 1;
    }

    // Generate a random equation and display it
    function generateEquation() {
        $("#answer").val("");
        $("#firstOperand").text(generateRandomNumber());
        $("#secondOperand").text(generateRandomNumber());
        result = Number($("#firstOperand").text()) + Number($("#secondOperand").text());
    }

    // function to send score to server
    function sendScoreToServer(){
        var csrftoken = Cookies.get('csrftoken');  
        $.ajax({
            type: "POST",
            url: "/sendScore/",
            beforeSend: function(xhr) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            },
            data: {score: score, timeElapsed: timeElapsed, questionsSolved: questionsSolved}, 
            success: function(response) {
                alert("Score Updated");
                $("#highestScore").text(response.highestScore);
                console.log(response);
            },
            error: function(response) {
                alert("Error");
                console.log(response);
            }
        });
    }
    
    // Event handler for enter key press
    $(document).keypress(function(event) {
        if(event.which == 13){
            if ($("#next").is(":visible")) {
                $("#next").click(); // Trigger click on next button
            }
            if ($("#submit").is(":visible")) {
                $("#submit").click(); // Trigger click on submit button
            }   
        }
    });

});
