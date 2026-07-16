import { describe, expect, it, vi } from 'vitest';
import { loadProgress, saveProgress } from './progress';

describe('progress', () => {
  it('存储数据损坏时返回默认进度', () => {
    const storage = { getItem: () => '{bad json' } as Storage;

    expect(loadProgress(storage)).toEqual({ currentChapter: 'signal', completed: [] });
  });

  it('校验进度并过滤非字符串完成项', () => {
    const storage = {
      getItem: () => JSON.stringify({ version: 1, currentChapter: 'transform', completed: ['signal', 4] }),
    } as Storage;

    expect(loadProgress(storage)).toEqual({ currentChapter: 'transform', completed: ['signal'] });
  });

  it('保存带版本号的最小进度数据', () => {
    const setItem = vi.fn();
    saveProgress({ setItem } as unknown as Storage, {
      currentChapter: 'sampling',
      completed: ['signal'],
    });

    expect(setItem).toHaveBeenCalledWith(
      'fourier-progress-v1',
      JSON.stringify({ version: 1, currentChapter: 'sampling', completed: ['signal'] }),
    );
  });
});
