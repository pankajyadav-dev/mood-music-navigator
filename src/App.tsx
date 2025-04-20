
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MusicPlayerProvider } from "@/contexts/MusicPlayerContext";
import Index from "./pages/Index";
import MoodPage from "./pages/MoodPage";
import SearchPage from "./pages/SearchPage";
import LibraryPage from "./pages/LibraryPage";
import PlaylistPage from "./pages/PlaylistPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <MusicPlayerProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/mood/:mood" element={<MoodPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="/playlist/:id" element={<PlaylistPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MusicPlayerProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
