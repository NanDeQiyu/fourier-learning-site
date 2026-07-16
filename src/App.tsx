import { useState } from 'react';
import { chapters } from './content/chapters';
import ChapterNav from './components/ChapterNav';
import Lesson from './components/Lesson';
import { loadProgress, saveProgress, type Progress } from './domain/progress';

function readInitialProgress(): Progress {
  return loadProgress(window.localStorage);
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(readInitialProgress);
  const [view, setView] = useState<'home' | 'lesson'>('home');
  const currentIndex = Math.max(
    0,
    chapters.findIndex((chapter) => chapter.id === progress.currentChapter),
  );
  const currentChapter = chapters[currentIndex];

  const updateProgress = (next: Progress) => {
    setProgress(next);
    saveProgress(window.localStorage, next);
  };

  const selectChapter = (id: string) => {
    updateProgress({ ...progress, currentChapter: id });
    setView('lesson');
  };

  if (view === 'home') {
    return (
      <main className="home">
        <header className="home-header">
          <span className="wordmark">FT / 傅里叶</span>
          <span>大学生互动课程</span>
        </header>
        <section className="home-hero">
          <div className="home-copy">
            <p className="eyebrow">六章 · 约 45 分钟</p>
            <h1>看见傅里叶变换</h1>
            <p className="home-lead">不用先背公式。拖动参数，让复杂波形在你眼前变成一组清晰的频率。</p>
            <div className="home-actions">
              <button type="button" className="button-primary" onClick={() => selectChapter('signal')}>开始学习</button>
              <button type="button" className="button-secondary" onClick={() => setView('lesson')}>继续上次进度</button>
            </div>
          </div>
          <div className="home-thesis" aria-label="时域和频域是观察同一信号的两种方式">
            <div>
              <span>时域</span>
              <strong>x(t)</strong>
              <small>信号怎样随时间变化</small>
            </div>
            <b aria-hidden="true">⇄</b>
            <div>
              <span>频域</span>
              <strong>X(f)</strong>
              <small>信号包含哪些频率</small>
            </div>
          </div>
        </section>
        <section className="learning-map" aria-labelledby="learning-map-title">
          <div>
            <p className="eyebrow">学习路线</p>
            <h2 id="learning-map-title">从一个音调，到真实世界的信号</h2>
          </div>
          <ol>
            {chapters.map((chapter, index) => (
              <li key={chapter.id}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <div><strong>{chapter.title}</strong><p>{chapter.summary}</p></div>
              </li>
            ))}
          </ol>
        </section>
      </main>
    );
  }

  const completeCurrentChapter = () => {
    const completed = progress.completed.includes(currentChapter.id)
      ? progress.completed
      : [...progress.completed, currentChapter.id];
    updateProgress({ ...progress, completed });
  };

  return (
    <div className="course-page">
      <header className="site-header">
        <button type="button" className="wordmark-button" onClick={() => setView('home')}>FT / 傅里叶</button>
        <span>已完成 {progress.completed.length} / {chapters.length} 章</span>
      </header>
      <div className="course-shell">
        <ChapterNav
          chapters={chapters}
          currentId={currentChapter.id}
          completed={progress.completed}
          onSelect={selectChapter}
        />
        <Lesson
          key={currentChapter.id}
          chapter={currentChapter}
          index={currentIndex}
          total={chapters.length}
          onComplete={completeCurrentChapter}
          onPrevious={currentIndex > 0 ? () => selectChapter(chapters[currentIndex - 1].id) : undefined}
          onNext={currentIndex < chapters.length - 1 ? () => selectChapter(chapters[currentIndex + 1].id) : undefined}
        />
      </div>
    </div>
  );
}
