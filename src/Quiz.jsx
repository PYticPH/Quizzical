//

import { useState, useEffect } from "react"
import Start from "./Start"
import Question from "./Question"


export default function Quiz() {

  const [quizData, setQuizData] = useState([])
  const [status, setStatus] = useState(
    { score: 0, isSubmitted: false, start: false, refresh: false })


  function randomizedAnswers(answersArray) {

    for (let i = answersArray.length - 1; i > 0; i--) {

      const j = Math.floor(Math.random() * (i + 1));

      [answersArray[i], answersArray[j]] =
        [answersArray[j], answersArray[i]]
    }

    return answersArray
  }


  function checkAnswer(event) {

    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    if (status.isSubmitted === true && status.start) {

      setStatus(prev => (
        {
          ...prev,
          start: !prev.start,
          refresh: !prev.refresh,
          score: 0,
          isSubmitted: !prev.isSubmitted
        })
      )

      return
    }

    if (Array.from(formData).length < quizData.length)
      return

    const quizObjArray = Array.from(formData).map(([name, value]) => {

      const index = Number(name.slice(-1))
      const quizObj = quizData[index]

      if (quizObj['correctAnswer'] === value)
        setStatus(prev => ({ ...prev, score: prev.score + 1 }))

      return (
        {
          ...quizObj,
          selected: value,
          isAttempted: !quizData.isAttempted
        }
      )
    })

    setQuizData(quizObjArray)
    setStatus(prev => ({ ...prev, isSubmitted: !prev.isSubmitted }))
  }


  useEffect(() => {

    fetch('https://opentdb.com/api.php?amount=5')
      .then(res => res.json())
      .then(data => {
        const QuizObj = data.results.map(
          ({ question, correct_answer, incorrect_answers }) =>
          ({
            question: question,
            correctAnswer: correct_answer,
            answers: randomizedAnswers(
              [...incorrect_answers, correct_answer]),
            isAttempted: false,
            selected: undefined
          })
        )
        setQuizData(QuizObj)
      })
  }, [status.refresh])


  const QuizQsn = quizData.map((
    {
      question,
      correctAnswer,
      answers,
      selected,
      isAttempted
    }, index) =>

    <Question
      key={index}
      question={question}
      correctAnswer={correctAnswer}
      answers={answers}
      selected={selected}
      isAttempted={isAttempted}
      index={index}
    />)


  return (

    (
      status.start ?
        (
          quizData.length <= 0 ? <p className="loading">Loading...</p> :

            <form onSubmit={checkAnswer} method="POST">
              {QuizQsn}
              {status.isSubmitted &&
                <span className="user-score">
                  You scored{` ${status.score}/${quizData.length} `}
                  correct answers
                </span>}
              <button
                className="submit">
                {status.isSubmitted ? "Play again" : "Check answers"}
              </button>
            </form>
        )
        :
        <Start setStatus={setStatus} />
    ))
}
