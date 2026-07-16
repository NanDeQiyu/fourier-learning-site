import { describe, expect, it } from 'vitest';
import { chapters } from './chapters';

describe('chapters', () => {
  it('提供六个顺序章节和完整中文内容', () => {
    expect(chapters).toHaveLength(6);
    expect(chapters.map((chapter) => chapter.id)).toEqual([
      'signal',
      'parameters',
      'synthesis',
      'transform',
      'sampling',
      'applications',
    ]);
    expect(
      chapters.every(
        (chapter) =>
          chapter.sections.length >= 2 &&
          chapter.objectives.length >= 2 &&
          chapter.quiz.options.length >= 3,
      ),
    ).toBe(true);
  });

  it('在变换与采样章节提供关键公式和概念', () => {
    const transform = chapters.find((chapter) => chapter.id === 'transform');
    const sampling = chapters.find((chapter) => chapter.id === 'sampling');

    expect(transform?.sections.some((section) => section.formula?.includes('X[k]'))).toBe(true);
    expect(sampling?.sections.some((section) => section.body.includes('奈奎斯特'))).toBe(true);
  });
});
