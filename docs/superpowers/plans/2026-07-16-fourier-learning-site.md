# 傅里叶变换互动学习网站 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个面向大学生的全中文、六章节、可交互的傅里叶变换学习网站。

**Architecture:** 使用 Vite、React 与 TypeScript 构建无后端单页应用。纯函数负责信号与傅里叶计算，React 组件负责课程、交互和 Canvas 绘图，Web Audio API 仅在用户主动操作时启用，学习进度保存在 localStorage。

**Tech Stack:** React 19、TypeScript 5、Vite 7、Vitest、Testing Library、Canvas 2D、Web Audio API、原生 CSS

## Global Constraints

- 所有面向学习者的界面、提示、练习和错误信息均使用中文。
- 页面采用纯白背景、深灰文字和单一蓝色强调色，不使用渐变、玻璃效果或重阴影。
- 桌面端采用讲解与实验双栏，窄屏改为单栏且实验紧跟讲解。
- 图表使用蓝色时域实线与深灰频域柱形；主要触控目标不小于 44 像素。
- 音频失败不得阻止图形实验；学习进度损坏时恢复默认值。
- 所有主要操作支持键盘，并尊重 `prefers-reduced-motion`。

---

### Task 1: 项目骨架与测试环境

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/test/setup.ts`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: 无。
- Produces: `App(): JSX.Element`、可运行的 `dev`、`build`、`test` 脚本。

- [ ] **Step 1: 写入依赖清单和测试脚本**

```json
{
  "name": "fourier-learning-site",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "latest",
    "vite": "latest",
    "typescript": "latest",
    "react": "latest",
    "react-dom": "latest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "latest",
    "@testing-library/react": "latest",
    "@testing-library/user-event": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "jsdom": "latest",
    "vitest": "latest"
  }
}
```

- [ ] **Step 2: 创建失败的首页测试**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('显示中文学习入口', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: '看见傅里叶变换' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '开始学习' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: 运行测试并确认失败**

Run: `pnpm install && pnpm test`

Expected: FAIL，原因是 `App` 或测试环境尚未定义。

- [ ] **Step 4: 创建最小首页和测试配置**

```tsx
// src/App.tsx
export default function App() {
  return <main><h1>看见傅里叶变换</h1><button>开始学习</button></main>;
}
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', setupFiles: './src/test/setup.ts' },
});
```

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 5: 验证并提交**

Run: `pnpm test && pnpm build`

Expected: 测试通过，构建生成 `dist/`。

```bash
git add package.json tsconfig.json vite.config.ts index.html src
git commit -m "chore: scaffold Fourier learning app"
```

---

### Task 2: 信号生成与傅里叶计算

**Files:**
- Create: `src/domain/signal.ts`
- Create: `src/domain/fourier.ts`
- Test: `src/domain/signal.test.ts`
- Test: `src/domain/fourier.test.ts`

**Interfaces:**
- Consumes: 无。
- Produces: `generateSignal(config: SignalConfig): number[]`、`computeSpectrum(samples: number[], sampleRate: number): SpectrumBin[]`、`clampSignalConfig(config: SignalConfig): SignalConfig`。

- [ ] **Step 1: 为信号生成写失败测试**

```ts
import { expect, it } from 'vitest';
import { generateSignal } from './signal';

it('生成指定长度的单一正弦波', () => {
  const samples = generateSignal({ sampleRate: 8, duration: 1, components: [{ frequency: 1, amplitude: 1, phase: 0 }] });
  expect(samples).toHaveLength(8);
  expect(samples[2]).toBeCloseTo(1, 6);
  expect(samples[6]).toBeCloseTo(-1, 6);
});
```

- [ ] **Step 2: 运行单测并确认失败**

Run: `pnpm vitest run src/domain/signal.test.ts`

Expected: FAIL，`generateSignal` 尚不存在。

- [ ] **Step 3: 实现信号类型、边界限制和生成函数**

```ts
export type SignalComponent = { frequency: number; amplitude: number; phase: number };
export type SignalConfig = { sampleRate: number; duration: number; components: SignalComponent[] };

export function clampSignalConfig(config: SignalConfig): SignalConfig {
  const sampleRate = Math.min(4096, Math.max(8, config.sampleRate));
  const duration = Math.min(2, Math.max(0.125, config.duration));
  return {
    sampleRate,
    duration,
    components: config.components.slice(0, 12).map((item) => ({
      frequency: Math.min(sampleRate / 2, Math.max(0, item.frequency)),
      amplitude: Math.min(1, Math.max(0, item.amplitude)),
      phase: Math.min(Math.PI * 2, Math.max(0, item.phase)),
    })),
  };
}

export function generateSignal(input: SignalConfig): number[] {
  const config = clampSignalConfig(input);
  const count = Math.round(config.sampleRate * config.duration);
  return Array.from({ length: count }, (_, index) => {
    const time = index / config.sampleRate;
    return config.components.reduce((sum, item) =>
      sum + item.amplitude * Math.sin(2 * Math.PI * item.frequency * time + item.phase), 0);
  });
}
```

- [ ] **Step 4: 为频谱峰值写失败测试**

```ts
import { expect, it } from 'vitest';
import { generateSignal } from './signal';
import { computeSpectrum } from './fourier';

it('在单一正弦波频率处产生最大峰值', () => {
  const samples = generateSignal({ sampleRate: 64, duration: 1, components: [{ frequency: 8, amplitude: 1, phase: 0 }] });
  const spectrum = computeSpectrum(samples, 64);
  const peak = spectrum.reduce((best, bin) => bin.magnitude > best.magnitude ? bin : best);
  expect(peak.frequency).toBe(8);
});
```

- [ ] **Step 5: 实现归一化单边离散傅里叶变换**

```ts
export type SpectrumBin = { frequency: number; magnitude: number };

export function computeSpectrum(samples: number[], sampleRate: number): SpectrumBin[] {
  const size = samples.length;
  if (!size || sampleRate <= 0) return [];
  return Array.from({ length: Math.floor(size / 2) + 1 }, (_, k) => {
    let real = 0;
    let imaginary = 0;
    for (let n = 0; n < size; n += 1) {
      const angle = (2 * Math.PI * k * n) / size;
      real += samples[n] * Math.cos(angle);
      imaginary -= samples[n] * Math.sin(angle);
    }
    return { frequency: (k * sampleRate) / size, magnitude: (2 * Math.hypot(real, imaginary)) / size };
  });
}
```

- [ ] **Step 6: 验证并提交**

Run: `pnpm vitest run src/domain/signal.test.ts src/domain/fourier.test.ts`

Expected: 两组测试全部通过。

```bash
git add src/domain
git commit -m "feat: add signal and Fourier calculations"
```

---

### Task 3: 章节内容与学习进度

**Files:**
- Create: `src/content/chapters.ts`
- Create: `src/domain/progress.ts`
- Test: `src/content/chapters.test.ts`
- Test: `src/domain/progress.test.ts`

**Interfaces:**
- Consumes: `SignalConfig` from `src/domain/signal.ts`。
- Produces: `chapters: Chapter[]`、`loadProgress(storage: Storage): Progress`、`saveProgress(storage: Storage, progress: Progress): void`。

- [ ] **Step 1: 为六章结构写失败测试**

```ts
import { expect, it } from 'vitest';
import { chapters } from './chapters';

it('提供六个顺序章节和中文内容', () => {
  expect(chapters).toHaveLength(6);
  expect(chapters.map((chapter) => chapter.id)).toEqual(['signal', 'parameters', 'synthesis', 'transform', 'sampling', 'applications']);
  expect(chapters.every((chapter) => chapter.sections.length > 0 && chapter.quiz.options.length >= 2)).toBe(true);
});
```

- [ ] **Step 2: 定义章节接口并写入六章数据**

```ts
export type Chapter = {
  id: string;
  title: string;
  summary: string;
  objectives: string[];
  sections: { heading: string; body: string; formula?: string }[];
  preset: SignalConfig;
  quiz: { question: string; options: string[]; answer: number; explanation: string };
};

export const chapters: Chapter[] = [
  {
    id: 'signal', title: '从声音与波形认识信号', summary: '先看见信号如何随时间变化。',
    objectives: ['读懂时域图的横轴与纵轴', '理解振幅与响度的关系'],
    sections: [
      { heading: '信号是什么', body: '信号是随时间或空间变化、能够携带信息的量。时域图的横轴表示时间，纵轴表示瞬时大小。' },
      { heading: '先从一个音调开始', body: '单一、稳定的音调可以用正弦波表示。波形越高，振幅越大；在其他条件相同时，听起来也更响。' },
    ],
    preset: { sampleRate: 64, duration: 1, components: [{ frequency: 2, amplitude: .8, phase: 0 }] },
    quiz: { question: '时域图的横轴通常表示什么？', options: ['时间', '音量', '频率成分'], answer: 0, explanation: '时域图描述信号随时间怎样变化。' },
  },
  {
    id: 'parameters', title: '频率、振幅和相位', summary: '分别改变正弦波的三个基本参数。',
    objectives: ['区分频率与振幅', '理解相位对波形位置的影响'],
    sections: [
      { heading: '频率和振幅', body: '频率表示每秒重复多少次，单位是赫兹。振幅表示偏离中心线的最大程度。' },
      { heading: '相位', body: '相位描述周期运动从哪个位置开始。改变相位会水平移动波形，但不会改变单一频率峰值的位置。' },
    ],
    preset: { sampleRate: 128, duration: 1, components: [{ frequency: 4, amplitude: .75, phase: 0 }] },
    quiz: { question: '只改变相位时，哪项保持不变？', options: ['主要频率', '波形起点', '瞬时数值'], answer: 0, explanation: '相位改变波形在时间轴上的位置，不改变其主要频率。' },
  },
  {
    id: 'synthesis', title: '把复杂波形拆成正弦波', summary: '用简单波叠加出复杂形状。',
    objectives: ['观察线性叠加', '认识方波中的奇次谐波'],
    sections: [
      { heading: '叠加', body: '同一时刻把多个正弦分量的数值相加，就得到组合信号。每个分量都保留自己的频率、振幅和相位。' },
      { heading: '逼近方波', body: '基频加上逐渐减弱的奇次谐波，可以越来越接近方波。这说明尖锐边缘需要更多高频分量。' },
    ],
    preset: { sampleRate: 256, duration: 1, components: [{ frequency: 3, amplitude: .8, phase: 0 }, { frequency: 9, amplitude: .27, phase: 0 }, { frequency: 15, amplitude: .16, phase: 0 }] },
    quiz: { question: '加入更多高次谐波后，方波近似会怎样？', options: ['边缘更清晰', '频率全部消失', '只剩直流'], answer: 0, explanation: '高次谐波补充快速变化，使边缘更陡。' },
  },
  {
    id: 'transform', title: '傅里叶变换与频谱', summary: '把时间视角转换成频率视角。',
    objectives: ['对应时域与频域', '读懂离散傅里叶变换公式'],
    sections: [
      { heading: '另一种观察方式', body: '时域告诉我们信号何时怎样变化，频域告诉我们信号由哪些频率组成以及各自有多强。' },
      { heading: '离散傅里叶变换', body: '对每个候选频率，把全部采样点与对应的复指数基函数比较；累加结果越大，说明该频率越明显。', formula: 'X[k] = Σ x[n] · e^{-i2πkn/N}' },
    ],
    preset: { sampleRate: 128, duration: 1, components: [{ frequency: 5, amplitude: .8, phase: 0 }, { frequency: 12, amplitude: .45, phase: .8 }] },
    quiz: { question: '频谱中的峰值通常表示什么？', options: ['较强的频率成分', '时间停止', '采样点丢失'], answer: 0, explanation: '峰值位置对应频率，峰值高度对应相对强度。' },
  },
  {
    id: 'sampling', title: '采样、混叠与离散傅里叶变换', summary: '理解数字世界如何记录连续信号。',
    objectives: ['理解采样率', '识别奈奎斯特频率与混叠'],
    sections: [
      { heading: '采样', body: '采样把连续信号变成离散数值。采样率表示每秒记录多少个点。' },
      { heading: '奈奎斯特频率', body: '采样率的一半称为奈奎斯特频率。高于它的成分会伪装成较低频率，这种现象叫混叠。' },
    ],
    preset: { sampleRate: 32, duration: 1, components: [{ frequency: 7, amplitude: .9, phase: 0 }] },
    quiz: { question: '32 Hz 采样率对应的奈奎斯特频率是多少？', options: ['16 Hz', '32 Hz', '64 Hz'], answer: 0, explanation: '奈奎斯特频率等于采样率的一半。' },
  },
  {
    id: 'applications', title: '工程应用', summary: '用频域思维处理真实问题。',
    objectives: ['理解频域降噪', '认识频率分量与压缩的关系'],
    sections: [
      { heading: '音频降噪', body: '如果噪声集中在某个频段，可以在频域削弱该频段，再把结果转换回时域。' },
      { heading: '压缩', body: '许多信号的能量集中在少量频率分量中。保留主要分量并舍弃很弱的分量，可以减少数据量。' },
    ],
    preset: { sampleRate: 256, duration: 1, components: [{ frequency: 4, amplitude: .8, phase: 0 }, { frequency: 42, amplitude: .2, phase: 0 }] },
    quiz: { question: '频域降噪的核心操作是什么？', options: ['削弱噪声频段', '删除全部采样点', '增大所有频率'], answer: 0, explanation: '先找到噪声所在频段，再有选择地降低该频段强度。' },
  },
];
```

- [ ] **Step 3: 为损坏进度恢复写失败测试**

```ts
import { expect, it } from 'vitest';
import { loadProgress } from './progress';

it('存储数据损坏时返回默认进度', () => {
  const storage = { getItem: () => '{bad json' } as Storage;
  expect(loadProgress(storage)).toEqual({ currentChapter: 'signal', completed: [] });
});
```

- [ ] **Step 4: 实现进度校验与保存**

```ts
export type Progress = { currentChapter: string; completed: string[] };
const DEFAULT_PROGRESS: Progress = { currentChapter: 'signal', completed: [] };

export function loadProgress(storage: Storage): Progress {
  try {
    const value = JSON.parse(storage.getItem('fourier-progress') ?? 'null');
    if (!value || typeof value.currentChapter !== 'string' || !Array.isArray(value.completed)) return DEFAULT_PROGRESS;
    return { currentChapter: value.currentChapter, completed: value.completed.filter((id: unknown) => typeof id === 'string') };
  } catch { return DEFAULT_PROGRESS; }
}

export function saveProgress(storage: Storage, progress: Progress): void {
  try { storage.setItem('fourier-progress', JSON.stringify(progress)); } catch { /* 学习流程继续 */ }
}
```

- [ ] **Step 5: 验证并提交**

Run: `pnpm vitest run src/content/chapters.test.ts src/domain/progress.test.ts`

Expected: 章节与进度测试全部通过。

```bash
git add src/content src/domain/progress.ts src/domain/progress.test.ts
git commit -m "feat: add Chinese chapters and local progress"
```

---

### Task 4: 时域与频域图形

**Files:**
- Create: `src/components/SignalPlot.tsx`
- Create: `src/components/SpectrumPlot.tsx`
- Create: `src/components/plots.ts`
- Test: `src/components/plots.test.ts`

**Interfaces:**
- Consumes: `number[]` samples、`SpectrumBin[]` spectrum。
- Produces: `buildSignalPath(samples, width, height): Point[]`、`buildSpectrumBars(bins, width, height): Rect[]`、两个带中文无障碍说明的 Canvas 组件。

- [ ] **Step 1: 为坐标映射写失败测试**

```ts
import { expect, it } from 'vitest';
import { buildSignalPath } from './plots';

it('将波形映射到画布范围', () => {
  expect(buildSignalPath([-1, 0, 1], 100, 60)).toEqual([
    { x: 0, y: 60 }, { x: 50, y: 30 }, { x: 100, y: 0 },
  ]);
});
```

- [ ] **Step 2: 实现纯坐标函数**

```ts
export type Point = { x: number; y: number };
export type Rect = { x: number; y: number; width: number; height: number };

export function buildSignalPath(samples: number[], width: number, height: number): Point[] {
  if (!samples.length || width <= 0 || height <= 0) return [];
  return samples.map((value, index) => ({
    x: samples.length === 1 ? 0 : (index / (samples.length - 1)) * width,
    y: (1 - Math.max(-1, Math.min(1, value))) * height / 2,
  }));
}
```

`buildSpectrumBars` 取前 48 个频点，将最大幅值归一化到画布高度，每根柱保留 2 像素间距；空数据或零尺寸返回空数组。

- [ ] **Step 3: 实现 Canvas 组件**

两个组件使用 `ResizeObserver` 获取容器尺寸和设备像素比。`SignalPlot` 使用 `#2563eb`、2 像素实线；`SpectrumPlot` 使用 `#374151` 柱形。Canvas 分别设置 `role="img"` 与 `aria-label="时域波形图"`、`aria-label="频域幅度谱"`。

- [ ] **Step 4: 验证并提交**

Run: `pnpm vitest run src/components/plots.test.ts && pnpm build`

Expected: 坐标测试与构建通过。

```bash
git add src/components
git commit -m "feat: add responsive time and frequency plots"
```

---

### Task 5: 互动实验、声音与练习

**Files:**
- Create: `src/components/Experiment.tsx`
- Create: `src/components/Quiz.tsx`
- Create: `src/hooks/useAudioSignal.ts`
- Test: `src/components/Experiment.test.tsx`
- Test: `src/components/Quiz.test.tsx`

**Interfaces:**
- Consumes: `SignalConfig`、`generateSignal`、`computeSpectrum`、Canvas 图形组件。
- Produces: `Experiment({ initialConfig })`、`Quiz({ quiz, onComplete })`、`useAudioSignal(components)`。

- [ ] **Step 1: 为滑块联动写失败测试**

```tsx
it('调整频率后更新显示值', async () => {
  render(<Experiment initialConfig={{ sampleRate: 64, duration: 1, components: [{ frequency: 4, amplitude: 1, phase: 0 }] }} />);
  const slider = screen.getByRole('slider', { name: '频率' });
  fireEvent.change(slider, { target: { value: '8' } });
  expect(screen.getByText('8 Hz')).toBeInTheDocument();
});
```

- [ ] **Step 2: 实现实验状态和参数控件**

`Experiment` 使用 `useMemo` 从当前配置计算 samples 与 spectrum。频率、振幅和相位均使用带 `<output>` 的原生范围输入；提供“播放声音”“暂停声音”“恢复默认”按钮。播放失败时显示 `声音暂时无法播放，波形实验仍可继续。`。

- [ ] **Step 3: 实现 Web Audio Hook**

```ts
export function useAudioSignal(components: SignalComponent[]) {
  const contextRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<OscillatorNode[]>([]);
  const [error, setError] = useState('');

  const stop = useCallback(() => {
    nodesRef.current.forEach((node) => { try { node.stop(); } catch {} });
    nodesRef.current = [];
  }, []);

  const play = useCallback(async () => {
    try {
      stop();
      const context = contextRef.current ?? new AudioContext();
      contextRef.current = context;
      await context.resume();
      nodesRef.current = components.map((item) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.frequency.value = item.frequency;
        gain.gain.value = item.amplitude / Math.max(1, components.length);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start();
        return oscillator;
      });
      setError('');
    } catch { setError('声音暂时无法播放，波形实验仍可继续。'); }
  }, [components, stop]);

  useEffect(() => stop, [stop]);
  return { play, stop, error };
}
```

- [ ] **Step 4: 为练习反馈写失败测试并实现**

```tsx
it('答对后解释原因并完成章节', async () => {
  const onComplete = vi.fn();
  render(<Quiz quiz={{ question: '频谱峰值表示什么？', options: ['频率成分', '时间长度'], answer: 0, explanation: '峰值对应信号中的主要频率。' }} onComplete={onComplete} />);
  await userEvent.click(screen.getByLabelText('频率成分'));
  await userEvent.click(screen.getByRole('button', { name: '检查答案' }));
  expect(screen.getByText('回答正确')).toBeInTheDocument();
  expect(onComplete).toHaveBeenCalledOnce();
});
```

`Quiz` 使用单选按钮；错误答案显示“再想一想”并允许重试，正确答案显示解释并调用 `onComplete`。

- [ ] **Step 5: 验证并提交**

Run: `pnpm vitest run src/components/Experiment.test.tsx src/components/Quiz.test.tsx`

Expected: 互动实验和练习测试通过。

```bash
git add src/components src/hooks
git commit -m "feat: add interactive experiment audio and quizzes"
```

---

### Task 6: 完整课程界面与简洁视觉系统

**Files:**
- Create: `src/components/ChapterNav.tsx`
- Create: `src/components/Lesson.tsx`
- Create: `src/styles.css`
- Modify: `src/App.tsx`
- Modify: `src/main.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `chapters`、`Progress`、`Experiment`、`Quiz`。
- Produces: 首页、六章导航、继续学习、章节完成状态和完整响应式课程体验。

- [ ] **Step 1: 写完整学习流程的失败测试**

```tsx
it('从首页进入第一章并保存完成状态', async () => {
  render(<App />);
  await userEvent.click(screen.getByRole('button', { name: '开始学习' }));
  expect(screen.getByRole('heading', { name: /从声音与波形认识信号/ })).toBeInTheDocument();
  expect(screen.getByRole('navigation', { name: '课程章节' })).toBeInTheDocument();
});
```

- [ ] **Step 2: 实现 App、章节导航和课程组合**

`App` 首次显示首页；点击“开始学习”进入第一章，“继续上次进度”进入 `progress.currentChapter`。`ChapterNav` 列出六章及“已完成”文字状态。`Lesson` 渲染标题、目标、讲解、可展开公式、`Experiment`、`Quiz` 和上一章或下一章按钮。章节切换与答对练习后调用 `saveProgress`。

- [ ] **Step 3: 实现视觉令牌和响应式布局**

```css
:root {
  color: #1f2937;
  background: #ffffff;
  font-family: "Noto Sans CJK SC", "Microsoft YaHei", system-ui, sans-serif;
  --blue: #2563eb;
  --line: #e5e7eb;
  --muted: #6b7280;
  --max: 1180px;
}

.lesson-layout {
  display: grid;
  grid-template-columns: minmax(0, .9fr) minmax(420px, 1.1fr);
  gap: 48px;
}

button, input[type="range"], summary, a { min-height: 44px; }
:focus-visible { outline: 3px solid color-mix(in srgb, var(--blue) 35%, transparent); outline-offset: 3px; }

@media (max-width: 820px) {
  .lesson-layout { grid-template-columns: 1fr; gap: 28px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; transition-duration: .01ms !important; }
}
```

在同一文件中明确添加 `.site-header`、`.home`、`.chapter-nav`、`.experiment`、`.plot`、`.formula`、`.quiz` 七组选择器：容器最大宽度均使用 `var(--max)`，边界统一为 `1px solid var(--line)`，控件间距使用 8/16/24/48 像素阶梯，按钮主操作使用蓝底白字、次操作使用白底蓝色边框；任何选择器都不得添加渐变、背景图案或超过 `0 2px 8px rgb(0 0 0 / .08)` 的阴影。

- [ ] **Step 4: 运行全套验证**

Run: `pnpm test && pnpm build`

Expected: 全部测试通过且生产构建成功。

- [ ] **Step 5: 在浏览器完成视觉验收**

启动 `pnpm dev --host 127.0.0.1`，检查 1440×900、1024×768 和 390×844 三种尺寸。确认六章可进入、滑块可操作、音频失败能降级、键盘焦点可见、手机端无横向滚动。

- [ ] **Step 6: 提交完整课程界面**

```bash
git add src
git commit -m "feat: complete responsive Fourier learning course"
```

---

### Task 7: 最终回归与交付

**Files:**
- Modify: `README.md`
- Test: 所有测试与生产构建。

**Interfaces:**
- Consumes: 完整应用。
- Produces: 可交付说明和验证证据。

- [ ] **Step 1: 编写运行说明**

`README.md` 用中文记录项目目标、`pnpm install`、`pnpm dev`、`pnpm test`、`pnpm build`，以及浏览器必须在用户点击后才能播放音频的说明。

- [ ] **Step 2: 运行最终验证**

Run: `pnpm test && pnpm build`

Expected: 测试零失败，构建零错误。

- [ ] **Step 3: 检查工作区并提交**

Run: `git status --short`

Expected: 只出现计划内的 `README.md` 修改。

```bash
git add README.md
git commit -m "docs: add setup and usage guide"
```
