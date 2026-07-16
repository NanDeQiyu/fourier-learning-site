import { useState } from 'react';
import type { QuizContent } from '../content/chapters';

type QuizProps = {
  quiz: QuizContent;
  onComplete: () => void;
};

export default function Quiz({ quiz, onComplete }: QuizProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const checkAnswer = () => {
    if (selected === null) return;
    if (selected === quiz.answer) {
      setFeedback('correct');
      if (feedback !== 'correct') onComplete();
    } else {
      setFeedback('incorrect');
    }
  };

  return (
    <section className="quiz" aria-labelledby="quiz-title">
      <p className="eyebrow">即时练习</p>
      <h2 id="quiz-title">{quiz.question}</h2>
      <div className="quiz-options">
        {quiz.options.map((option, index) => (
          <label key={option} className={selected === index ? 'selected' : undefined}>
            <input
              type="radio"
              name="chapter-quiz"
              checked={selected === index}
              onChange={() => {
                setSelected(index);
                setFeedback(null);
              }}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <button type="button" className="button-primary" disabled={selected === null} onClick={checkAnswer}>
        检查答案
      </button>
      {feedback === 'correct' ? (
        <div className="quiz-feedback correct" role="status">
          <strong>回答正确</strong>
          <p>{quiz.explanation}</p>
        </div>
      ) : null}
      {feedback === 'incorrect' ? (
        <div className="quiz-feedback" role="status">
          <strong>再想一想</strong>
          <p>回到上面的讲解或实验中找找线索，然后重新选择。</p>
        </div>
      ) : null}
    </section>
  );
}
