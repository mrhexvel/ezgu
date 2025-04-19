import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { AboutSection } from "@/components/home/about-section";
import { HeroSection } from "@/components/home/hero-section";
import { JoinSection } from "@/components/home/join-section";
import { NewsSection } from "@/components/home/news-section";
import { ProjectsSection } from "@/components/home/projects-section";
import { StatsSection } from "@/components/home/stats-section";
import { SuccessStoriesSection } from "@/components/home/success-stories-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <StatsSection />
        <ProjectsSection />
        <SuccessStoriesSection />
        <TestimonialsSection />
        {/* <PartnersSection /> */}
        <NewsSection />
        <JoinSection />
      </main>
      <Footer />
    </div>
  );
}
