import type { SignalConfig } from '../domain/signal';

export type ChapterSection = {
  heading: string;
  body: string;
  formula?: string;
};

export type QuizContent = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export type Chapter = {
  id: string;
  title: string;
  summary: string;
  objectives: string[];
  sections: ChapterSection[];
  preset: SignalConfig;
  quiz: QuizContent;
};

export const chapters: Chapter[] = [
  {
    id: 'signal',
    title: '从声音与波形认识信号',
    summary: '先看见信号如何随时间变化。',
    objectives: ['读懂时域图的横轴与纵轴', '理解振幅与响度的关系'],
    sections: [
      {
        heading: '信号是什么',
        body: '信号是随时间或空间变化、能够携带信息的量。时域图的横轴表示时间，纵轴表示信号在那个时刻的大小。',
      },
      {
        heading: '先从一个音调开始',
        body: '单一而稳定的音调可以用正弦波表示。波形越高，振幅越大；在其他条件相同时，听起来也更响。',
      },
    ],
    preset: {
      sampleRate: 64,
      duration: 1,
      components: [{ frequency: 2, amplitude: 0.8, phase: 0 }],
    },
    quiz: {
      question: '时域图的横轴通常表示什么？',
      options: ['时间', '音量', '频率成分'],
      answer: 0,
      explanation: '时域图描述信号随时间怎样变化。',
    },
  },
  {
    id: 'parameters',
    title: '频率、振幅和相位',
    summary: '分别改变正弦波的三个基本参数。',
    objectives: ['区分频率与振幅', '理解相位对波形位置的影响'],
    sections: [
      {
        heading: '频率和振幅',
        body: '频率表示每秒重复多少次，单位是赫兹。振幅表示信号偏离中心线的最大程度。',
      },
      {
        heading: '相位',
        body: '相位描述周期运动从哪个位置开始。改变相位会水平移动波形，但不会改变单一频率峰值的位置。',
        formula: 'x(t) = A · sin(2πft + φ)',
      },
    ],
    preset: {
      sampleRate: 128,
      duration: 1,
      components: [{ frequency: 4, amplitude: 0.75, phase: 0 }],
    },
    quiz: {
      question: '只改变相位时，哪一项保持不变？',
      options: ['主要频率', '波形起点', '每个时刻的数值'],
      answer: 0,
      explanation: '相位改变波形在时间轴上的位置，不改变其主要频率。',
    },
  },
  {
    id: 'synthesis',
    title: '把复杂波形拆成正弦波',
    summary: '用简单波叠加出复杂形状。',
    objectives: ['观察正弦分量的线性叠加', '认识方波中的奇次谐波'],
    sections: [
      {
        heading: '叠加',
        body: '在同一时刻把多个正弦分量的数值相加，就得到组合信号。每个分量都保留自己的频率、振幅和相位。',
      },
      {
        heading: '逼近方波',
        body: '基频加上逐渐减弱的奇次谐波，可以越来越接近方波。这说明尖锐边缘需要更多高频分量。',
      },
    ],
    preset: {
      sampleRate: 256,
      duration: 1,
      components: [
        { frequency: 3, amplitude: 0.8, phase: 0 },
        { frequency: 9, amplitude: 0.27, phase: 0 },
        { frequency: 15, amplitude: 0.16, phase: 0 },
      ],
    },
    quiz: {
      question: '加入更多高次谐波后，方波近似会怎样？',
      options: ['边缘更清晰', '频率全部消失', '只剩直流分量'],
      answer: 0,
      explanation: '高次谐波补充快速变化，使波形边缘变得更陡。',
    },
  },
  {
    id: 'transform',
    title: '傅里叶变换与频谱',
    summary: '把时间视角转换成频率视角。',
    objectives: ['对应时域与频域', '读懂离散傅里叶变换公式'],
    sections: [
      {
        heading: '另一种观察方式',
        body: '时域告诉我们信号何时怎样变化，频域告诉我们信号由哪些频率组成，以及每种频率有多强。',
      },
      {
        heading: '离散傅里叶变换',
        body: '对每个候选频率，把全部采样点与对应的复指数基函数比较。累加结果越大，说明该频率越明显。',
        formula: 'X[k] = Σ x[n] · e^{-i2πkn/N}',
      },
    ],
    preset: {
      sampleRate: 128,
      duration: 1,
      components: [
        { frequency: 5, amplitude: 0.8, phase: 0 },
        { frequency: 12, amplitude: 0.45, phase: 0.8 },
      ],
    },
    quiz: {
      question: '频谱中的峰值通常表示什么？',
      options: ['较强的频率成分', '时间停止', '采样点丢失'],
      answer: 0,
      explanation: '峰值位置对应频率，峰值高度对应相对强度。',
    },
  },
  {
    id: 'sampling',
    title: '采样、混叠与离散傅里叶变换',
    summary: '理解数字世界如何记录连续信号。',
    objectives: ['理解采样率', '识别奈奎斯特频率与混叠'],
    sections: [
      {
        heading: '采样',
        body: '采样把连续信号变成离散数值。采样率表示每秒记录多少个点；采样点越密，越能跟上快速变化。',
      },
      {
        heading: '奈奎斯特频率',
        body: '采样率的一半称为奈奎斯特频率。高于它的成分会伪装成较低频率，这种现象叫混叠。',
        formula: 'fₘₐₓ < fₛ / 2',
      },
    ],
    preset: {
      sampleRate: 32,
      duration: 1,
      components: [{ frequency: 7, amplitude: 0.9, phase: 0 }],
    },
    quiz: {
      question: '32 Hz 采样率对应的奈奎斯特频率是多少？',
      options: ['16 Hz', '32 Hz', '64 Hz'],
      answer: 0,
      explanation: '奈奎斯特频率等于采样率的一半。',
    },
  },
  {
    id: 'applications',
    title: '工程应用',
    summary: '用频域思维处理真实问题。',
    objectives: ['理解频域降噪', '认识频率分量与压缩的关系'],
    sections: [
      {
        heading: '音频降噪',
        body: '如果噪声集中在某个频段，可以在频域削弱该频段，再把结果转换回时域。',
      },
      {
        heading: '压缩',
        body: '许多信号的能量集中在少量频率分量中。保留主要分量并舍弃很弱的分量，可以减少数据量。',
      },
    ],
    preset: {
      sampleRate: 256,
      duration: 1,
      components: [
        { frequency: 4, amplitude: 0.8, phase: 0 },
        { frequency: 42, amplitude: 0.2, phase: 0 },
      ],
    },
    quiz: {
      question: '频域降噪的核心操作是什么？',
      options: ['削弱噪声所在频段', '删除全部采样点', '增大所有频率'],
      answer: 0,
      explanation: '先找到噪声所在频段，再有选择地降低该频段强度。',
    },
  },
];
