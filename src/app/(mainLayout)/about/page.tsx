import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  MessageSquare,
  Target,
  Users,
  Award,
  Globe,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-black/80 via-white/30 to-black/40 dark:from-[#1D2B64] dark:via-black dark:to-[#06D6A0]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              AI-Powered IELTS Preparation
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-foreground">
              Welcome to <span className="text-primary">linguaAI</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
              Revolutionizing IELTS preparation with cutting-edge AI technology.
              Master your English skills through personalized mock interviews
              and intelligent feedback.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-[#06D6A0]">
              Start Your Journey
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg text-white px-8 bg-[#1D2B64]"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Our Mission
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Empowering students worldwide to achieve their IELTS goals through
              innovative AI-driven learning experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Image
                width={500}
                height={500}
                src="https://substackcdn.com/image/fetch/$s_!wIes!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8c120d1c-35b2-4a2c-b868-04f984d4a21e_1200x600.png"
                alt="Students using linguaAI platform"
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Global Accessibility
                  </h3>
                  <p className="text-muted-foreground">
                    Breaking down geographical barriers to provide world-class
                    IELTS preparation to students everywhere.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <Target className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Personalized Learning
                  </h3>
                  <p className="text-muted-foreground">
                    AI-driven insights that adapt to your unique learning style
                    and pace for maximum efficiency.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                  <p className="text-muted-foreground">
                    Helping thousands of students achieve their target IELTS
                    scores and unlock new opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Why Choose linguaAI?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Experience the future of IELTS preparation with our comprehensive
              AI-powered platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  AI-Powered Analysis
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced AI algorithms analyze your speaking patterns,
                  pronunciation, and fluency to provide detailed feedback.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-accent/10 p-3 rounded-lg w-fit mb-4">
                  <MessageSquare className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Mock Interviews</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Practice with realistic IELTS speaking tests that simulate the
                  actual exam environment.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Personalized Study Plans
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Customized learning paths based on your current level and
                  target score requirements.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-accent/10 p-3 rounded-lg w-fit mb-4">
                  <Users className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access to certified IELTS instructors and AI tutors available
                  24/7 for guidance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary/10 p-3 rounded-lg w-fit mb-4">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Progress Tracking
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Detailed analytics and progress reports to monitor your
                  improvement over time.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-accent/10 p-3 rounded-lg w-fit mb-4">
                  <Award className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Proven Success</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Join thousands of successful students who achieved their
                  target IELTS scores with linguaAI.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
