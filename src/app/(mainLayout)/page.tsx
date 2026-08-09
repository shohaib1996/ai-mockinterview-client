
import { AiPerformanceShowcase } from "@/components/HomePage/AiPerformanceShowcase";
import HeroSection from "@/components/HomePage/HeroSection";
import HowItWorks from "@/components/HomePage/HowItWorks";
import ProcessSteps from "@/components/HomePage/ProcessSteps";
import DashboardPreview from "@/components/HomePage/DashboardPreview";
import MockTest from "@/components/HomePage/MockTest";
import NewsletterSection from "@/components/HomePage/NewsletterSection";
import { TestimonialsSection } from "@/components/HomePage/TestimonialSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <ProcessSteps />
      <DashboardPreview />
      <MockTest />
      <AiPerformanceShowcase />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
