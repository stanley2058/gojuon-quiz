import { JP50Data } from "@/hooks";
import { create } from "zustand";

export interface UserAnswer {
  quiz: string;
  user: string;
  answer: string;
  isCorrect: boolean;
}

export interface OptionStore {
  selected: {
    hiragana: boolean;
    katagana: boolean;
  } & JP50Data["category"];
  updateSelected: (selected: Partial<OptionStore["selected"]>) => void;
  quizData: string[];
  answers: Map<string, Set<string>>;
  isTestGoing: boolean;
  setQuizData: (quizData: string[], answers: Map<string, Set<string>>) => void;
  userAnswers: UserAnswer[];
}

export const optionStore = create<OptionStore>((set) => ({
  selected: {
    hiragana: true,
    katagana: false,
    dakuon: [],
    handakuon: [],
    seion: ["a"],
    youon: [],
  },
  updateSelected: (selected) => {
    set((s) => ({ selected: { ...s.selected, ...selected } }));
  },
  quizData: [],
  answers: new Map(),
  isTestGoing: false,
  setQuizData: (quizData, answers) => {
    // TODO: save multiple rounds of answers
    set(() => ({ quizData, answers, isTestGoing: true, userAnswers: [] }));
  },
  userAnswers: [],
}));

export function generateQuizData(
  selected: OptionStore["selected"],
  data: JP50Data,
) {
  const { hiragana, katagana, ...rest } = selected;
  const selectedOption = Object.values(rest).flat();

  const quizData: string[] = [];

  for (const option of selectedOption) {
    if (hiragana) quizData.push(...data.hiragana[option]);
    if (katagana) quizData.push(...data.katakana[option]);
  }

  quizData.sort(() => Math.random() - 0.5);

  const answers = new Map<string, Set<string>>();
  for (const quiz of quizData) {
    answers.set(quiz, new Set(data.spell[quiz]));
  }

  return { quizData, answers };
}
