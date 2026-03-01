"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  // Getting Started
  {
    category: "Getting Started",
    question: "How do I create an account?",
    answer: "Click on the 'Sign In with Google' button on the login page. You'll be redirected to Google's secure authentication page. Once you authorize access, your account will be automatically created and you can start practicing immediately."
  },
  {
    category: "Getting Started",
    question: "Is the platform free to use?",
    answer: "Yes! UPSC Practice Platform is currently completely free to use. All features including practice tests, analytics, and progress tracking are available at no cost."
  },
  {
    category: "Getting Started",
    question: "What subjects and topics are covered?",
    answer: "We cover all major UPSC subjects including Indian Polity, History, Geography, Economics, Environment, Science & Technology, and Current Affairs. Topics are organized hierarchically for easy navigation."
  },

  // Tests & Practice
  {
    category: "Tests & Practice",
    question: "How do I start a practice test?",
    answer: "Go to 'Start Test' from the sidebar, select your preferred topics, difficulty level, and number of questions. Click 'Start Test' and you'll be taken to the test interface. The timer starts automatically."
  },
  {
    category: "Tests & Practice",
    question: "Can I pause a test and resume later?",
    answer: "No, once you start a test, you need to complete it in one session. However, you can abandon a test if needed, though it won't be saved in your history."
  },
  {
    category: "Tests & Practice",
    question: "How is my score calculated?",
    answer: "Each correct answer gives you 1 point. Incorrect answers and unanswered questions give 0 points. Your percentage is calculated as (Correct Answers / Total Questions) × 100."
  },
  {
    category: "Tests & Practice",
    question: "Can I review my answers after submitting?",
    answer: "Yes! After submitting a test, you'll see detailed results including your answers, correct answers, explanations, and topic-wise performance analysis."
  },
  {
    category: "Tests & Practice",
    question: "What does 'Mark for Review' do?",
    answer: "Marking a question for review flags it so you can easily return to it later using the question palette. It's useful for questions you want to reconsider before submitting."
  },
  {
    category: "Tests & Practice",
    question: "Can I extend the test time?",
    answer: "Yes, you can extend the test time by 5 or 10 minutes using the 'Extend Time' button. This feature is available during the test."
  },

  // Analytics & Progress
  {
    category: "Analytics & Progress",
    question: "How can I track my progress?",
    answer: "Visit the Dashboard to see your overall statistics, topic-wise strength, recent performance trends, and study streak. The Analytics page provides detailed insights into your performance patterns."
  },
  {
    category: "Analytics & Progress",
    question: "What is topic-wise strength?",
    answer: "Topic-wise strength shows your accuracy percentage for each topic you've practiced. It helps identify your strong and weak areas so you can focus your preparation accordingly."
  },
  {
    category: "Analytics & Progress",
    question: "Where can I see my test history?",
    answer: "Go to 'Test History' from the sidebar to see all your completed tests with scores, dates, topics covered, and detailed performance metrics."
  },
  {
    category: "Analytics & Progress",
    question: "What is the study streak?",
    answer: "Study streak tracks consecutive days you've taken at least one test. Maintaining a streak helps build consistent study habits."
  },

  // Questions & Content
  {
    category: "Questions & Content",
    question: "Are these real UPSC questions?",
    answer: "Our question bank includes Previous Year Questions (PYQs) marked with the year, as well as practice questions designed to match UPSC standards and difficulty levels."
  },
  {
    category: "Questions & Content",
    question: "How often is content updated?",
    answer: "We regularly update our question bank with new questions, current affairs, and corrections based on user feedback and UPSC syllabus changes."
  },
  {
    category: "Questions & Content",
    question: "What if I find an error in a question?",
    answer: "Please contact us at kumodsharma1164@gmail.com with the question details and the issue you found. We review all feedback and make corrections promptly."
  },
  {
    category: "Questions & Content",
    question: "Can I suggest new topics or questions?",
    answer: "Absolutely! We welcome suggestions for new topics, questions, or features. Email us at kumodsharma1164@gmail.com with your ideas."
  },

  // Technical Issues
  {
    category: "Technical Issues",
    question: "What browsers are supported?",
    answer: "UPSC Practice Platform works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version for optimal performance."
  },
  {
    category: "Technical Issues",
    question: "My test didn't submit properly. What should I do?",
    answer: "If you experience submission issues, check your internet connection and try again. If the problem persists, contact us immediately at kumodsharma1164@gmail.com with details about when it happened."
  },
  {
    category: "Technical Issues",
    question: "Can I use the platform on mobile devices?",
    answer: "Yes! The platform is fully responsive and works on smartphones and tablets. However, for the best test-taking experience, we recommend using a desktop or laptop."
  },
  {
    category: "Technical Issues",
    question: "I'm having login issues. What should I do?",
    answer: "Make sure you're using the same Google account you registered with. Clear your browser cache and cookies, then try again. If issues persist, contact support."
  },

  // Account & Privacy
  {
    category: "Account & Privacy",
    question: "How is my data protected?",
    answer: "We use industry-standard encryption and security measures to protect your data. Your information is stored securely and never shared with third parties. See our Privacy Policy for details."
  },
  {
    category: "Account & Privacy",
    question: "Can I delete my account?",
    answer: "Yes, you can request account deletion by contacting us at kumodsharma1164@gmail.com. We'll permanently delete your data within 30 days."
  },
  {
    category: "Account & Privacy",
    question: "Can I export my test history?",
    answer: "Currently, you can view and screenshot your test history and analytics. We're working on adding a data export feature in the future."
  },
  {
    category: "Account & Privacy",
    question: "Do you share my data with anyone?",
    answer: "No, we do not sell, trade, or share your personal information with third parties. Your data is used solely to provide and improve our services."
  },

  // Features & Tips
  {
    category: "Features & Tips",
    question: "What's the best way to use this platform?",
    answer: "Start with mixed difficulty tests to assess your level, then focus on weak topics. Take regular tests to build consistency, review explanations carefully, and track your progress through analytics."
  },
  {
    category: "Features & Tips",
    question: "Should I focus on one topic or practice mixed topics?",
    answer: "Both approaches are valuable. Topic-wise practice helps master specific subjects, while mixed-topic tests simulate actual exam conditions. We recommend a combination of both."
  },
  {
    category: "Features & Tips",
    question: "How many questions should I practice daily?",
    answer: "This depends on your schedule and preparation stage. We recommend starting with 20-30 questions daily and gradually increasing. Consistency is more important than quantity."
  },
  {
    category: "Features & Tips",
    question: "What do the difficulty levels mean?",
    answer: "Easy: Basic conceptual questions. Medium: Application-based questions requiring understanding. Hard: Complex questions requiring deep analysis and multiple concepts."
  }
];

export default function FAQPage() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = selectedCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <HelpCircle className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl">Frequently Asked Questions</CardTitle>
          </div>
          <p className="text-muted-foreground">
            Find answers to common questions about UPSC Practice Platform
          </p>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary hover:bg-secondary/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-3">
            {filteredFAQs.map((faq, index) => {
              const isExpanded = expandedItems.has(index);
              
              return (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full p-4 flex items-start gap-3 hover:bg-secondary/50 transition-colors text-left"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {faq.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-base">{faq.question}</h3>
                    </div>
                  </button>
                  
                  {isExpanded && (
                    <div className="px-4 pb-4 pl-12">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Still Have Questions */}
          <div className="mt-8 p-6 bg-secondary/30 rounded-lg text-center">
            <h3 className="font-semibold mb-2">Still have questions?</h3>
            <p className="text-muted-foreground mb-4">
              Can't find the answer you're looking for? We're here to help!
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
