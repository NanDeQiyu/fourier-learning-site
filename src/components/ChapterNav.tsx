import type { Chapter } from '../content/chapters';

type ChapterNavProps = {
  chapters: Chapter[];
  currentId: string;
  completed: string[];
  onSelect: (id: string) => void;
};

export default function ChapterNav({ chapters, currentId, completed, onSelect }: ChapterNavProps) {
  return (
    <details className="chapter-nav-wrap">
      <summary>课程目录 · 已完成 {completed.length} / {chapters.length} 章</summary>
      <nav className="chapter-nav" aria-label="课程章节">
        <p className="nav-progress">已完成 {completed.length} / {chapters.length} 章</p>
        <ol>
          {chapters.map((chapter, index) => {
            const isComplete = completed.includes(chapter.id);
            return (
              <li key={chapter.id}>
                <button
                  type="button"
                  className={chapter.id === currentId ? 'active' : undefined}
                  aria-current={chapter.id === currentId ? 'page' : undefined}
                  onClick={() => onSelect(chapter.id)}
                >
                  <span>第 {index + 1} 章</span>
                  <strong>{chapter.title}</strong>
                  {isComplete ? <small>已完成</small> : null}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </details>
  );
}
