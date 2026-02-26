import { ThemeProvider } from "@/providers/ThemeProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import App from "@/App";

export default function AppContainer() {
  return (
    <QueryProvider>
      <TooltipProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <App />
        </ThemeProvider>
      </TooltipProvider>
    </QueryProvider>
  );
}
