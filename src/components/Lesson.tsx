import type { Chapter } from '../content/chapters';
import Experiment from './Experiment';
import Quiz from './Quiz';

type LessonProps = {
  chapter: Chapter;
  index: number;
  total: number;
  onComplete: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
};

export default function Lesson({
  chapter,
  index,
  total,
  onComplete,
  onPrevious,
  onNext,
}: LessonProps) {
  return (
    <article className="lesson">
      <header className="lesson-intro">
        <p className="chapter-kicker">第 {String(index + 1).padStart(2, '0')} 章 · 共 {total} 章</p>
        <h1>{chapter.title}</h1>
        <p className="lesson-summary">{chapter.summary}</p>
        <div className="objectives">
          <strong>学完本章，你将能够</strong>
          <ul>
            {chapter.objectives.map((objective) => <li key={objective}>{objective}</li>)}
          </ul>
        </div>
      </header>

      <div className="lesson-layout">
        <div className="lesson-copy">
          {chapter.sections.map((section) => (
            <section key={section.heading} className="lesson-section">
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
              {section.formula ? (
                <details className="formula">
                  <summary>查看公式</summary>
                  <code>{section.formula}</code>
                </details>
              ) : null}
            </section>
          ))}
        </div>
        <Experiment key={chapter.id} initialConfig={chapter.preset} />
      </div>

      <Quiz key={`${chapter.id}-quiz`} quiz={chapter.quiz} onComplete={onComplete} />

      <nav className="lesson-pagination" aria-label="章节翻页">
        {onPrevious ? <button type="button" className="button-secondary" onClick={onPrevious}>上一章</button> : <span />}
        {onNext ? <button type="button" className="button-primary" onClick={onNext}>下一章</button> : <span className="course-finished">你已经来到课程终点</span>}
      </nav>
    </article>
  );
}
