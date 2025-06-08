import { QueryClient, useQuery } from "@tanstack/react-query";

export const queryClient = new QueryClient();
export interface JP50Data {
  category: {
    dakuon: string[];
    handakuon: string[];
    seion: string[];
    youon: string[];
  };
  hiragana: Record<string, string[]>;
  katakana: Record<string, string[]>;
  spell: Record<string, string[]>;
}
const dataUrl =
  "https://gist.githubusercontent.com/penut85420/5b383ee875f66cfba70c46ad0e2dd21b/raw/fbd21d468add3ad99370e23ed9dcbf10aa7740c9/kana-spell.json";

export function useJP50Data() {
  return useQuery<JP50Data>({
    queryKey: ["jp50"],
    queryFn: async () => {
      const res = await fetch(dataUrl);
      return JSON.parse(await res.text());
    },
  });
}
