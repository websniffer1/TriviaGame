$(document).ready(function(){

// event listeners
$("#remaining-time").hide();
$("#start").on('click', trivia.startGame);
$(document).on('click' , '.option', trivia.checkGuess);

})

var trivia = {
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId: '',

    questions: {
        q1: 'Louis Pasteur has been credited with the development of three major vaccinations that are still used today. Which of the following did he not develop a vaccine for?',
        q2: 'How often does the epidermis, the outer layer of our skin replace itself?',
        q3: 'What was the first human organ to be successfully transplanted?',
        q4: 'The average adult has how many fat cells?',
        q5: 'How many bones are there in the human foot?',
        q6: 'What percentage of the human body is water?',
        q7: 'The smallest bones in the human body can be found in ......?',
        q8: 'Alcohol makes which drugs less effective?',
        q9: 'Which of the following is not a blood type?',
        q10: 'When someone has Hepatitis, which organ is affected?'
    },
    options: {
        q1: ['Rabies', 'Anthrax', 'Cholera', 'Polio'],
        q2: ['Once a week', 'Once every four weeks', 'Once a year', 'Once in lifetime'],
        q3: ['Spleen', 'Kidney', 'Heart', 'Lung'],
        q4: ['35 to 60 billion', '200 to 600 billion', '10 to 50 million', '25 to 75 thousand'],
        q5: ['38', '64', '26', '17'],
        q6: ['81', '59', '75', '66'],
        q7: ['Your feet', 'Your hands', 'Your nose', 'Your ears'],
        q8: ['Pain killers', 'Contraceptive pills', 'Antibiotics', 'Anti-anxiety meds'],
        q9: ['A', 'B', 'OA', 'AB'],
        q10: ['Lungs', 'Kidney', 'Liver', 'Brain']
    },
    answers: {
        q1: 'Polio', 
        q2: 'Once every four weeks',
        q3: 'Kidney',
        q4: '35 to 60 billion',
        q5: '26',
        q6: '66',
        q7: 'Your ears',
        q8: 'Antibiotics',
        q9: 'OA',
        q10: 'Liver'
    },

    //initialize game
    startGame: function(){
        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0; 
        clearInterval(trivia.timerId);

        //show game
        $('#game').show();

        //empty last result
        $('#results').html('');

        //show timer
        $('#timer').text(trivia.timer);

        //remove start button
        $('#start').hide();

        //show remaining time
        $('#remaining-time').show();

        //ask first question
        trivia.nextQuestion();
    },

    //loop through questions and options
    nextQuestion : function(){

        //timer settings
        trivia.timer = 10;
        $('#timer').removeClass('last-seconds');
        $('#timer').text(trivia.timer);

        //prevent speed up
        if(!trivia.timerOn){
            trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }

        //index current question
        var questionContent = Object.values(trivia.questions)[trivia.currentSet];
        $('#question').text(questionContent);

        //user options for current question
        var questionOptions = Object.values(trivia.options)[trivia.currentSet];

        $.each(questionOptions, function(index, key){
            $('#options').append($('<button class="option btn btn-info btn-lg">' + key + '</button>'));
        })
    },

    //timer countdown
    timerRunning : function(){
        //time left; questions left
        if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
            $('#timer').text(trivia.timer);
            trivia.timer--;
            if(trivia.timer === 4){
                $('#timer').addClass('last-seconds');
            }
        }
        //time run out; question not answered. 
        else if(trivia.timer === -1){
            trivia.unanswered++;
            trivia.result = false;
            clearInterval(trivia.timerId);
            resultId = setTimeout(trivia.guessResult,1000);
            $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
        }
        // all questions shown; show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // adds results of game;show on page
        $('#results')
          .html('<h3>Thank you for playing!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Please try again!</p>');
        
        // hide game sction
        $('#game').hide();
        
        // show start button to begin a new game
        $('#start').show();
      }
    },

checkGuess : function() {
      
    
    var resultId;
    
    // the answer to the current question 
    var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
    
    // if the text of the option picked matches the answer of the current question, increment correct
    if($(this).text() === currentAnswer){
      // turn button green for correct
      $(this).addClass('btn-success').removeClass('btn-info');
      
      trivia.correct++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Correct Answer!</h3>');
    }
    // else the user picked the wrong option, increment incorrect
    else{
      // turn button clicked red for incorrect
      $(this).addClass('btn-danger').removeClass('btn-info');
      
      trivia.incorrect++;
      clearInterval(trivia.timerId);
      resultId = setTimeout(trivia.guessResult, 1000);
      $('#results').html('<h3>Oh no!That was wrong!'+ currentAnswer +'</h3>');
    }
    
  },
  // method to remove previous question results and options
  guessResult : function(){
    
    // increment to next question set
    trivia.currentSet++;
    
    // remove the options and results
    $('.option').remove();
    $('#results h3').remove();
    
    // begin next question
    trivia.nextQuestion();
     
  }
}