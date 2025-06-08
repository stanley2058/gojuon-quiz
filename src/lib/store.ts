import { JP50Data } from "@/hooks";
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  setQuizData: (quizData: string[], answers: Map<string, Set<string>>) => void;
  userAnswers: UserAnswer[];
}

export const optionStore = create<OptionStore>()(
  persist(
    (set) => ({
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
      setQuizData: (quizData, answers) => {
        set(() => ({ quizData, answers, userAnswers: [] }));
      },
      userAnswers: [],
    }),
    {
      name: "jp-50",
    },
  ),
);

// @see https://stackoverflow.com/a/2450976/13234407
function shuffleArray<T>(array: T[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    const tmp = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = tmp;
  }
}

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

  shuffleArray(quizData);

  const answers = new Map<string, Set<string>>();
  for (const quiz of quizData) {
    answers.set(quiz, new Set(data.spell[quiz]));
  }

  return { quizData, answers };
}
