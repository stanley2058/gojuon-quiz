import { Card } from "./ui/card";
import { useStore } from "zustand";
import { optionStore } from "@/lib/store";
import { useNavigate, Link } from "react-router";
import { Button } from "./ui/button";

export function RecordTab() {
  const navigate = useNavigate();
  const quizData = useStore(optionStore, (s) => s.quizData);
  const userAnswers = useStore(optionStore, (s) => s.userAnswers);
  const incorrectAnswers = userAnswers.filter((a) => a.isCorrect === false);
  const totalAnswers = userAnswers.length;
  const correctAnswers = totalAnswers - incorrectAnswers.length;
  const correctPercentage =
    Math.round((correctAnswers / totalAnswers) * 10000) / 100;
  const hasTestRecord = totalAnswers > 0;
  const isTestGoing = quizData.length > 0;

  return (
    <>
      <Card className="p-3 flex gap-0 overflow-hidden text-sm">
        <div className="p-2.5 rounded-md bg-accent h-[180px] max-h-[180px] overflow-y-auto flex flex-col gap-0.5">
          {incorrectAnswers.map((a) => (
            <span className="flex flex-row">
              <span>題目：{a.quiz}</span>
              <span>、</span>
              <span>正解：{a.answer}</span>
              <span>、</span>
              <span>輸入：{a.user}</span>
            </span>
          ))}
          {isTestGoing && (
            <span>
              測試中，回到
              <Link to="/quiz" className="text-blue-400">
                測試頁面
              </Link>
              繼續測驗。
            </span>
          )}
          {!isTestGoing && hasTestRecord && (
            <span>
              正確率：{correctPercentage}% ({correctAnswers}/{totalAnswers})
            </span>
          )}
          {!isTestGoing && !hasTestRecord && (
            <span>
              <Link to="/setting" className="text-blue-400">
                設定題目
              </Link>
              後開始測試吧！
            </span>
          )}
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <Button
          variant="secondary"
          className="cursor-pointer"
          onClick={() => {
            const quiz = userAnswers.map((a) => a.quiz);
            const { setQuizData, answers } = optionStore.getState();
            setQuizData(quiz, answers);
            navigate("/quiz");
          }}
          disabled={!hasTestRecord}
        >
          再次測驗
        </Button>
        <Link to="/setting">
          <Button variant="secondary" className="cursor-pointer w-full">
            回到設定
          </Button>
        </Link>
      </div>
    </>
  );
}
