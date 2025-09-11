"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";
import emailjs from "@emailjs/browser";
import { useState, useRef } from "react";
import { error } from "console";

export default function ContactPage() {
  const form = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    phone: "",
    user_email: "",
    to_subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (form.current) {
        await emailjs
          .sendForm(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            form.current,
            { publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY! }
          )
          .then(
            () => {
              console.log("success");
            },
            (error) => {
              console.log("FAILED...", error.text);
            }
          )
          .catch((error) => console.log(error));

        toast.success("Message sent successfully!");
        setFormData({
          user_name: "",
          phone: "",
          user_email: "",
          to_subject: "",
          message: "",
        });
        form.current.reset();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-black/80 via-white/30 to-black/40 dark:from-[#1D2B64] dark:via-black dark:to-[#06D6A0]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Badge variant="secondary" className="mb-4 text-sm font-medium">
              Get in Touch
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6 text-foreground">
              Contact <span className="text-primary">linguaAI</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
              Have questions about our AI-powered IELTS preparation platform?
              We&apos;re here to help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-foreground">
                  Get in Touch
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Ready to start your IELTS journey with linguaAI? Contact us
                  today and let our AI-powered platform help you achieve your
                  target score.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="border-0 shadow-md py-0">
                  <CardContent className="p-2">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Our Location
                        </h3>
                        <p className="text-muted-foreground">
                          Mirpur, Dhaka, Bangladesh
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md py-0">
                  <CardContent className="p-2">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Phone className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Phone Number
                        </h3>
                        <p className="text-muted-foreground">+8801303429044</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md py-0">
                  <CardContent className="p-2">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Email Address
                        </h3>
                        <p className="text-muted-foreground">
                          khanshohaibhossain@gmail.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md py-0">
                  <CardContent className="p-2">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Support Hours
                        </h3>
                        <p className="text-muted-foreground">
                          Monday - Friday: 9:00 AM - 6:00 PM (GMT+6)
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="h-6 w-6 text-primary" />
                    Send us a Message
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <form
                    ref={form}
                    className="space-y-6"
                    onSubmit={handleSubmit}
                  >
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="user_name"
                          placeholder="Enter your full name"
                          className="bg-background"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          name="user_email"
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          className="bg-background"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          name="phone"
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          className="bg-background"
                          onChange={handleChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                          name="to_subject"
                          id="subject"
                          placeholder="What's this about?"
                          className="bg-background"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        name="message"
                        id="message"
                        placeholder="Tell us how we can help you with your IELTS preparation..."
                        rows={10}
                        className="bg-background resize-none h-28"
                        onChange={handleChange}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full text-lg"
                      disabled={isSubmitting}
                    >
                      <Send className="h-5 w-5 mr-2" />
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Quick answers to common questions about linguaAI and our IELTS
              preparation platform.
            </p>
          </div>

          <div className="grid gap-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  How does the AI-powered mock interview work?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our AI interviewer conducts realistic IELTS speaking tests,
                  analyzes your responses in real-time, and provides detailed
                  feedback on pronunciation, fluency, grammar, and vocabulary
                  usage.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  What IELTS score improvements can I expect?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Students typically see 1-2 band score improvements within 4-6
                  weeks of consistent practice. Our personalized AI feedback
                  helps identify and address specific weaknesses quickly.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Is there a free trial available?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Yes! We offer a 7-day free trial that includes access to mock
                  interviews, AI feedback, and personalized study plans. No
                  credit card required to get started.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">
                  Do you provide support for all IELTS modules?
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Currently, we specialize in the Speaking module with our
                  AI-powered mock interviews. We&apos;re expanding to include
                  Writing, Reading, and Listening modules in upcoming releases.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
