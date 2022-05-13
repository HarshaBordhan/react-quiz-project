import _ from 'lodash';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import useAnswers from '../../hooks/useAnswers';
import Analysis from '../Analysis';
import Summary from '../Summary';

export default function Result() {
  const { id } = useParams();
  const { location } = useNavigate();
  const { state } = useLocation();
  const { qna } = state; //  checked(choosed or correct mark options) in qna
  // const qna = state;
  console.log(state);

  const { loading, error, answers } = useAnswers(id); // video ID (bring correct answers from firebase)
  console.log(answers);

  // compare answers and qna to get correct answers
  function calculate() {
    let score = 0;

    answers.forEach((question, index1) => {
      let correctIndexes = [], // in answers
        checkedIndexes = []; // in qna

      question.options.forEach((option, index2) => {
        if (option.correct) correctIndexes.push(index2);
        if (qna[index1].options[index2].checked) {
          checkedIndexes.push(index2);
          option.checked = true;
        }
      });

      if (_.isEqual(correctIndexes, checkedIndexes)) {
        score = score + 5;
      }
    });
    return score;
  }

  const userScore = calculate();

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>There was an error!</div>}

      {answers && answers.length > 0 && (
        <>
          <Summary score={userScore} noq={answers.length} />
          <Analysis answers={answers} />
        </>
      )}
    </>
  );
}
