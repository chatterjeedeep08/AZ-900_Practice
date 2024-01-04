import { createContext, useState, useEffect } from "react";

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
  // All Quizs, Current Question, Index of Current Question, Answer, Selected Answer, Total Marks
  const [quizs, setQuizs] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [question, setQuestion] = useState({});
  const [questionIndex, setQuestionIndex] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [marks, setMarks] = useState(0);
  const [flag, setFlag] = useState(true); // [true, false
  const [Timer, setTimer] = useState(5100);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


  // Display Controlling States
  const [showStart, setShowStart] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  useEffect(() => {
    setFlag(true);
  },[]);
  // Load JSON Data
  useEffect(() => {
    //console.log("react: useEffect: load JSON data");
    fetch('quiz.json')
      .then(res => res.json())
      .then(data => setQuizs(data))
    }, []);

  useEffect(() => {
    //console.log("react: useEffect: question slice here");
    //console.log(quizs.length);
    //console.log(flag);
    if(quizs.length > 0 && flag){
      const shuffledQuestions = quizs.sort(() => 0.5 - Math.random());
      //console.log(shuffledQuestions.slice(0, 10));
      setSelectedQuestions(shuffledQuestions.slice(0, 60));
      setFlag(false);
    }
  },[flag,quizs,selectedQuestions]);


  // const getRandomQuestions = () => {
  //   if(flag){
  //     const shuffledQuestions = quizs.sort(() => 0.5 - Math.random());
  //     console.log(shuffledQuestions.slice(0, 10));
  //     setSelectedQuestions(shuffledQuestions.slice(0, 10));
  //   }
  //   setFlag(false);
  // };

  // useEffect(() => {
  //   setQuestion(selectedQuestions[questionIndex]);
  //   console.log(question);
  // }, [selectedQuestions, question, questionIndex]);
    
  // Set a Single Question
  useEffect(() => {
    //console.log("react: useEffect: set a single question");
    setQuizs(selectedQuestions);
    setQuestion(selectedQuestions[questionIndex]);
  }, [selectedQuestions, questionIndex]);
  
  // Function to get 60 random questions

  // Start Quiz
  const startQuiz = () => {
    setShowStart(false);
    setShowQuiz(true);
    startTimer();
  }

  const startTimer = async () => {
    for (let i = 5100; i >= 0; i--) {
      setTimer(i);
      console.log(i);
      await delay(1000); // Wait for 1 second
    }
    showTheResult();
  };
  

  // Check Answer
  const checkAnswer = (event, selected) => {
    if (!selectedAnswer) {
      setCorrectAnswer(question.answer);
      setSelectedAnswer(selected);

      if (selected === question.answer) {
        event.target.classList.add('bg-success');
        setMarks(marks + 0.8);
      } else {
        event.target.classList.add('bg-danger');
      }
    }
  }

  // Next Question
  const nextQuestion = () => {
    setCorrectAnswer('');
    setSelectedAnswer('');
    const wrongBtn = document.querySelector('button.bg-danger');
    wrongBtn?.classList.remove('bg-danger');
    const rightBtn = document.querySelector('button.bg-success');
    rightBtn?.classList.remove('bg-success');
    setQuestionIndex(questionIndex + 1);
    setQuestion(quizs[questionIndex + 1]);
  }


  // Show Result
  const showTheResult = () => {
    setShowResult(true);
    setShowStart(false);
    setShowQuiz(false);
  }

  // Start Over
  const startOver = () => {
    window.location.reload();
  }

  return (
    <DataContext.Provider value={{
      startQuiz, showStart, showQuiz, question, quizs, checkAnswer, correctAnswer,
      selectedAnswer, questionIndex, nextQuestion, showTheResult, showResult, marks, Timer,
      startOver
    }} >
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
