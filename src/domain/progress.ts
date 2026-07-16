export type Progress = {
  currentChapter: string;
  completed: string[];
};

type StoredProgress = Progress & { version: 1 };

const STORAGE_KEY = 'fourier-progress-v1';
const DEFAULT_PROGRESS: Progress = { currentChapter: 'signal', completed: [] };

export function loadProgress(storage: Storage): Progress {
  try {
    const value = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null') as Partial<StoredProgress> | null;
    if (
      !value ||
      value.version !== 1 ||
      typeof value.currentChapter !== 'string' ||
      !Array.isArray(value.completed)
    ) {
      return DEFAULT_PROGRESS;
    }

    return {
      currentChapter: value.currentChapter,
      completed: value.completed.filter((id): id is string => typeof id === 'string'),
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(storage: Storage, progress: Progress): void {
  try {
    const value: StoredProgress = { version: 1, ...progress };
    storage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // 本地存储不可用时，课程仍可在当前页面继续。
  }
}
