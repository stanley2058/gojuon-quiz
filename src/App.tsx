import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./hooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingTab } from "./components/SettingTab";
import { QuizTab } from "./components/QuizTab";
import { BrowserRouter, useLocation, useNavigate } from "react-router";
import "./index.css";

function JP50() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      <Tabs
        value={location.pathname.slice(1) || "setting"}
        onValueChange={(value) => navigate(`/${value}`)}
        className="w-[800px] max-w-[calc(100dvw-40px)]"
      >
        <TabsList>
          <TabsTrigger className="cursor-pointer" value="setting">
            設定
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="quiz">
            測驗
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="record">
            記錄
          </TabsTrigger>
        </TabsList>
        <TabsContent value="setting" className="space-y-5">
          <SettingTab />
        </TabsContent>
        <TabsContent value="quiz" className="space-y-5">
          <QuizTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <main className="flex flex-col items-center min-h-svh p-6">
          <JP50 />
        </main>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
