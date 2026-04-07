//

import he from "he"
import clsx from "clsx"


export default function Question(props) {

  return (

    <fieldset className="quiz">
      <legend>{he.decode(props.question)}</legend>
      {
        props.answers.map((answer, answerIndex) => (
          <label
            key={answerIndex}
            className={
              clsx(
                {
                  'correct-ans':
                    props.isAttempted && answer === props.correctAnswer
                },
                {
                  'wrong-ans':
                    props.isAttempted && props.selected === answer
                    && answer !== props.correctAnswer
                })}>
            <input
              type="radio"
              name={`qa-${props.index}`}
              value={he.decode(answer)}
              disabled={
                props.isAttempted &&
                  (answer !== props.correctAnswer) ? true : false}
              required
            />
            {he.decode(answer)}
          </label>
        ))
      }
    </fieldset>
  )
}
