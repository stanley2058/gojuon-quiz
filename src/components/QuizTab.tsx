import { Card } from "@/components/ui/card";
import { Divider, TitleText } from "./Common";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LucideSendHorizontal } from "lucide-react";
import { ReactNode, useCallback } from "react";
import { useStore } from "zustand";
import { optionStore } from "@/lib/store";
import { Link, useNavigate } from "react-router";

function InfoDisplay({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-md bg-secondary px-3 py-2 text-sm h-full">
      {children}
    </span>
  );
}

function useQuiz() {
  const navigate = useNavigate();
  const quizData = useStore(optionStore, (s) => s.quizData);
  const isTestGoing = useStore(optionStore, (s) => s.isTestGoing);
  const userAnswers = useStore(optionStore, (s) => s.userAnswers);

  const quiz = quizData[0];

  const correctCounts = userAnswers.filter((a) => a.isCorrect).length;
  const totalCounts = userAnswers.length;
  const percentage = Math.round((correctCounts / totalCounts) * 10000) / 100;
  const lastResult = userAnswers[userAnswers.length - 1];

  const answerQuiz = useCallback(
    (answer: string) => {
      const { quizData, answers, userAnswers } = optionStore.getState();
      const quiz = quizData[0];
      const correctAnswers = answers.get(quiz)!;
      const isCorrect = correctAnswers.has(answer);

      const nextQuiz = quizData.slice(1);
      optionStore.setState({
        quizData: nextQuiz,
        userAnswers: [
          ...userAnswers,
          {
            quiz,
            user: answer,
            answer: [...correctAnswers].join(", "),
            isCorrect,
          },
        ],
        isTestGoing: nextQuiz.length > 0,
      });
      if (nextQuiz.length === 0) navigate("/record");
    },
    [navigate],
  );

  return {
    quiz,
    correctCounts,
    totalCounts,
    percentage,
    lastResult,
    answerQuiz,
    isTestGoing,
  };
}

export function QuizTab() {
  const {
    quiz,
    correctCounts,
    totalCounts,
    percentage,
    lastResult,
    answerQuiz,
  } = useQuiz();

  return (
    <Card className="p-0 flex gap-0 overflow-hidden">
      <div className="flex flex-row">
        <div className="flex flex-col gap-2.5 px-3 py-2.5 border-border border-r-1 border-solid flex-1">
          <TitleText>題目</TitleText>
          <InfoDisplay>
            {quiz ?? (
              <span className="text-slate-400">
                <Link to="/setting" className="text-blue-400">
                  設定題目
                </Link>
                <span>以開始...</span>
              </span>
            )}
          </InfoDisplay>
        </div>

        <div className="flex flex-col gap-2.5 px-3 py-2.5 flex-1">
          <TitleText>資訊</TitleText>
          <InfoDisplay>
            {lastResult && lastResult.isCorrect && "🎉 正確"}
            {lastResult &&
              !lastResult.isCorrect &&
              `❌ 錯誤，${lastResult.quiz} 正確答案為 ${lastResult.answer}`}
            {!lastResult && "N/A"}
          </InfoDisplay>
        </div>
      </div>

      <Divider />

      <form
        className="flex flex-col gap-2.5 px-3 py-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const answer = new FormData(form).get("answer");
          if (typeof answer === "string") answerQuiz(answer);
          form.reset();
        }}
      >
        <TitleText>作答</TitleText>
        <span className="flex flex-row gap-2">
          <Input name="answer" placeholder="你的答案..." autoFocus />
          <Button
            variant="secondary"
            size="icon"
            className="cursor-pointer"
            type="submit"
          >
            <LucideSendHorizontal />
          </Button>
        </span>
      </form>

      <Divider />

      <div className="flex flex-row">
        <div className="flex flex-col gap-2.5 px-3 py-2.5 border-border border-r-1 border-solid flex-1">
          <TitleText>答對題數</TitleText>
          <InfoDisplay>{correctCounts}</InfoDisplay>
        </div>

        <div className="flex flex-col gap-2.5 px-3 py-2.5 border-border border-r-1 border-solid flex-1">
          <TitleText>總答題數</TitleText>
          <InfoDisplay>{totalCounts}</InfoDisplay>
        </div>

        <div className="flex flex-col gap-2.5 px-3 py-2.5 flex-1">
          <TitleText>答對比率</TitleText>
          <InfoDisplay>
            {totalCounts > 0 ? `${percentage}%` : "N/A"}
          </InfoDisplay>
        </div>
      </div>
    </Card>
  );
}
