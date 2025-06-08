import { useJP50Data } from "@/hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateQuizData, optionStore } from "@/lib/store";
import { useStore } from "zustand";
import { CheckboxButton, Divider, TitleText } from "./Common";
import { useNavigate } from "react-router";

export function SettingTab() {
  const navigate = useNavigate();
  const { data } = useJP50Data();
  const selected = useStore(optionStore, (s) => s.selected);
  const updateSelected = useStore(optionStore, (s) => s.updateSelected);

  console.log("[DEBUG]", { data });

  return (
    <>
      <Card className="p-0 flex gap-0 overflow-hidden">
        <div className="flex flex-col gap-2.5 px-3 py-2.5">
          <TitleText>假名</TitleText>
          <div className="flex flex-row gap-2 flex-wrap">
            <CheckboxButton
              id="hiragana"
              checked={selected.hiragana}
              onCheckedChange={(checked) =>
                updateSelected({ hiragana: Boolean(checked) })
              }
            >
              平假名
            </CheckboxButton>
            <CheckboxButton
              id="katagana"
              checked={selected.katagana}
              onCheckedChange={(checked) =>
                updateSelected({ katagana: Boolean(checked) })
              }
            >
              片假名
            </CheckboxButton>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-2.5 px-3 py-2.5">
          <TitleText>清音</TitleText>
          <div className="flex flex-row gap-2 flex-wrap">
            {data?.category.seion.map((item) => (
              <CheckboxButton
                key={item}
                id={item}
                checked={selected.seion.includes(item)}
                onCheckedChange={(checked) =>
                  updateSelected({
                    seion: checked
                      ? [...selected.seion, item]
                      : selected.seion.filter((i) => i !== item),
                  })
                }
              >
                {item}
              </CheckboxButton>
            ))}
          </div>
        </div>

        <Divider />

        <div className="flex flex-row">
          <div className="flex flex-col gap-2.5 px-3 py-2.5 border-border border-r-1 border-solid flex-1">
            <TitleText>濁音</TitleText>
            <div className="flex flex-row gap-2 flex-wrap">
              {data?.category.dakuon.map((item) => (
                <CheckboxButton
                  key={item}
                  id={item}
                  checked={selected.dakuon.includes(item)}
                  onCheckedChange={(checked) =>
                    updateSelected({
                      dakuon: checked
                        ? [...selected.dakuon, item]
                        : selected.dakuon.filter((i) => i !== item),
                    })
                  }
                >
                  {item}
                </CheckboxButton>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 px-3 py-2.5 flex-1">
            <TitleText>半濁音</TitleText>
            <div className="flex flex-row gap-2 flex-wrap">
              {data?.category.handakuon.map((item) => (
                <CheckboxButton
                  key={item}
                  id={item}
                  checked={selected.handakuon.includes(item)}
                  onCheckedChange={(checked) =>
                    updateSelected({
                      handakuon: checked
                        ? [...selected.handakuon, item]
                        : selected.handakuon.filter((i) => i !== item),
                    })
                  }
                >
                  {item}
                </CheckboxButton>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col gap-2.5 px-3 py-2.5">
          <TitleText>拗音</TitleText>
          <div className="flex flex-row gap-2 flex-wrap">
            {data?.category.youon.map((item) => (
              <CheckboxButton
                key={item}
                id={item}
                checked={selected.youon.includes(item)}
                onCheckedChange={(checked) =>
                  updateSelected({
                    youon: checked
                      ? [...selected.youon, item]
                      : selected.youon.filter((i) => i !== item),
                  })
                }
              >
                {item}
              </CheckboxButton>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-4">
        <div className="flex flex-row gap-3">
          <Button
            variant="secondary"
            className="flex-1 cursor-pointer"
            onClick={() => {
              updateSelected({
                hiragana: true,
                katagana: true,
                ...data?.category,
              });
            }}
          >
            全選
          </Button>
          <Button
            variant="secondary"
            className="flex-1 cursor-pointer"
            onClick={() => {
              updateSelected({
                hiragana: false,
                katagana: false,
                dakuon: [],
                handakuon: [],
                seion: [],
                youon: [],
              });
            }}
          >
            全不選
          </Button>
        </div>
        <Button
          className="cursor-pointer"
          onClick={() => {
            // TODO: handle errors
            if (!data) return;
            const { quizData, answers } = generateQuizData(
              optionStore.getState().selected,
              data,
            );
            optionStore.getState().setQuizData(quizData, answers);
            navigate("/quiz");
          }}
        >
          開始測驗
        </Button>
      </div>
    </>
  );
}
