import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingPartners from "@/components/landing/LandingPartners";
import LandingFeatures from "@/components/landing/LandingFeatures";
import LandingBenefits from "@/components/landing/LandingBenefits";
import LandingQRCode from "@/components/landing/LandingQRCode";
import LandingPixPayout from "@/components/landing/LandingPixPayout";
import LandingStats from "@/components/landing/LandingStats";
import LandingTech from "@/components/landing/LandingTech";
import LandingRobot from "@/components/landing/LandingRobot";
import LandingSupport from "@/components/landing/LandingSupport";
import LandingTestimonials from "@/components/landing/LandingTestimonials";
import LandingFAQ from "@/components/landing/LandingFAQ";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden dark">
      <LandingNavbar />
      <LandingHero />
      <LandingPartners />
      <LandingFeatures />
      <LandingBenefits />
      <LandingQRCode />
      <LandingPixPayout />
      <LandingStats />
      <LandingTech />
      <LandingRobot />
      <LandingSupport />
      <LandingTestimonials />
      <LandingFAQ />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}
