import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import JobsLanding from "./pages/JobsLanding";
import PlaceholderPage from "./pages/PlaceholderPage";
import CareerByGoal from "./pages/CareerByGoal";
import CareerByInterest from "./pages/CareerByInterest";
import LatestVacancies from "./pages/LatestVacancies";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/jobs" element={<JobsLanding />} />

              {/* Jobs sub-routes */}
              <Route
                path="/jobs/by-goal"
                element={
                  <PlaceholderPage
                    title="Career Map by Goal"
                    description="Interactive career roadmap from your current stage to your dream job. Coming soon!"
                  />
                }
              />
              <Route
                path="/jobs/by-interest"
                element={
                  <PlaceholderPage
                    title="Career by Interest"
                    description="Discover careers based on your passions and interests. Coming soon!"
                  />
                }
              />
              <Route
                path="/jobs/vacancies"
                element={
                  <PlaceholderPage
                    title="Latest Vacancies"
                    description="Real-time government and private job openings. Coming soon!"
                  />
                }
              />

              {/* Business routes */}
              <Route
                path="/business"
                element={
                  <PlaceholderPage
                    title="Business Opportunities"
                    description="Explore categorized business ideas with complete startup guides. Coming soon!"
                  />
                }
              />
              <Route
                path="/business/ideas"
                element={
                  <PlaceholderPage
                    title="Business Ideas"
                    description="Categorized business opportunities with startup guides. Coming soon!"
                  />
                }
              />
              <Route
                path="/business/documentation"
                element={
                  <PlaceholderPage
                    title="Business Documentation"
                    description="Required permits, licenses, and legal documentation guidance. Coming soon!"
                  />
                }
              />
              <Route
                path="/business/calculator"
                element={
                  <PlaceholderPage
                    title="ROI Calculator"
                    description="Investment requirements and projected returns calculator. Coming soon!"
                  />
                }
              />
              <Route
                path="/business/guidance"
                element={
                  <PlaceholderPage
                    title="Business Guidance"
                    description="Complete business guidance and tutorials. Coming soon!"
                  />
                }
              />
              <Route
                path="/business/documents"
                element={
                  <PlaceholderPage
                    title="Business Documents"
                    description="Downloadable business templates and guides. Coming soon!"
                  />
                }
              />
              <Route
                path="/business/funding"
                element={
                  <PlaceholderPage
                    title="Business Funding"
                    description="Funding options and investment opportunities. Coming soon!"
                  />
                }
              />

              {/* Other routes */}
              <Route
                path="/career-map"
                element={
                  <PlaceholderPage
                    title="Interactive Career Map"
                    description="Visual career planning tool with step-by-step guidance. Coming soon!"
                  />
                }
              />
              <Route
                path="/vacancies"
                element={
                  <PlaceholderPage
                    title="Job Vacancies"
                    description="Latest job openings from government and private sectors. Coming soon!"
                  />
                }
              />

              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
