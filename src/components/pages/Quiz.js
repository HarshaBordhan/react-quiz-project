import { getDatabase, ref, set } from 'firebase/database';
import _ from 'lodash';
import { useEffect, useReducer, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useQuestions from '../../hooks/useQuestions';
import Answers from '../Answers';
import MiniPlayer from '../MiniPlayer';
import ProgressBar from '../ProgressBar';

const initialState = null;

const reducer = (state, action) => {
  switch (
    action.type // action is a object and in type we get the value
  ) {
    case 'questions':
      action.value.forEach(question => {
        question.options.forEach(option => {
          option.checked = false;
        });
      });
      return action.value;
    case 'answer': // when user select an option
      const questions = _.cloneDeep(state); // not firebase questions, it's currentState questions
      questions[action.questionID].options[action.optionIndex].checked =
        action.value; // questionID and optionIndex are just given name

      return questions;
    default:
      return state;
  }
};

export default function Quiz() {
  const { id } = useParams(); // questions id or, video id
  const { loading, error, questions } = useQuestions(id);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [qna, dispatch] = useReducer(reducer, initialState); // checked the questions in checkbox('qna' is the variable name or localState where the copied data stored from 'questions')
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { location } = navigate;
  // console.log(navigate);
  const { state } = useLocation();
  const videoTitle = state;

  useEffect(() => {
    dispatch({
      type: 'questions', // useReducer question
      value: questions, // firebase 'question'
    });
  }, [questions]);

  console.log(qna);

  function handleAnswerChange(e, index) {
    dispatch({
      type: 'answer',
      questionID: currentQuestion,
      optionIndex: index,
      value: e.target.checked,
    });
  } // when user select an option

  // handle when user clicks the next button to get the next question
  function nextQuestion() {
    // if (currentQuestion + 1 < questions.length) { Or,
    if (currentQuestion <= questions.length) {
      setCurrentQuestion(prevCurrent => prevCurrent + 1);
    }
  }

  // handle when user clicks the prev button to get back to the prev question
  function prevQuestion() {
    if (currentQuestion >= 1 && currentQuestion <= questions.length) {
      setCurrentQuestion(prevCurrent => prevCurrent - 1);
    }
  }

  // submit quiz
  async function submit() {
    const { uid } = currentUser; // uid is firebase user ID
    console.log(uid);

    const db = getDatabase();
    const resultRef = ref(db, `result/${uid}`);

    await set(resultRef, {
      // 'get' for read and 'set' for write in firebase
      [id]: qna, // id is video ID
    });

    navigate(`/result/${id}`, {
      state: { qna },
      // state: qna,
    });
  }

  // calculate percentage of progress
  const percentage =
    questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  return (
    <>
      {loading && <div>Loading...</div>}
      {error && <div>There was an error!</div>}
      {!loading && !error && qna && qna.length > 0 && (
        <>
          <h1>{qna[currentQuestion].title}</h1>
          <h4>Question can have multiple answers</h4>
          <Answers
            input
            options={qna[currentQuestion].options}
            handleChange={handleAnswerChange}
          />
          <ProgressBar
            next={nextQuestion}
            prev={prevQuestion}
            progress={percentage}
            submit={submit}
          />
          <MiniPlayer id={id} title={videoTitle} />
        </>
      )}
    </>
  );
}
