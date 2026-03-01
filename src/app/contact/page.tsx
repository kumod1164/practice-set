"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Mail, MessageSquare, HelpCircle, Send } from "lucide-react";

export default function ContactUsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Contact Us</CardTitle>
            <p className="text-sm text-muted-foreground">
              We're here to help! Reach out to us for any questions or support.
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Email Contact */}
            <section className="flex items-start gap-4 p-6 border rounded-lg bg-secondary/30">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-3">
                  For general inquiries, technical support, or feedback, please email us at:
                </p>
                <a 
                  href="mailto:kumodsharma1164@gmail.com" 
                  className="text-lg font-medium text-primary hover:underline"
                >
                  kumodsharma1164@gmail.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  We typically respond within 24-48 hours.
                </p>
              </div>
            </section>

            {/* Submit Feedback Form Button */}
            <section className="flex items-start gap-4 p-6 border rounded-lg bg-blue-500/5">
              <div className="p-3 rounded-full bg-blue-500/10">
                <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Submit Feedback or Feature Request</h3>
                <p className="text-muted-foreground mb-4">
                  Have a suggestion, found a bug, or want to request a new feature? 
                  Use our feedback form to share your thoughts directly with us.
                </p>
                <Button onClick={() => setShowForm(true)} className="gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Open Feedback Form
                </Button>
              </div>
            </section>

            {/* What We Can Help With */}
            <section>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                What We Can Help With
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Technical Issues</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Login or account problems</li>
                    <li>• Test submission errors</li>
                    <li>• Performance issues</li>
                    <li>• Browser compatibility</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Content Questions</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Question accuracy</li>
                    <li>• Explanation clarifications</li>
                    <li>• Topic suggestions</li>
                    <li>• Content updates</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Account Management</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Profile updates</li>
                    <li>• Data export requests</li>
                    <li>• Account deletion</li>
                    <li>• Privacy concerns</li>
                  </ul>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">General Inquiries</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Feature requests</li>
                    <li>• Partnership opportunities</li>
                    <li>• Feedback and suggestions</li>
                    <li>• Platform information</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Response Time */}
            <section className="p-6 border rounded-lg bg-green-500/5">
              <h3 className="text-lg font-semibold mb-3">Response Time</h3>
              <div className="space-y-2 text-muted-foreground">
                <p>📧 <strong>Email:</strong> We aim to respond within 24-48 hours</p>
                <p>🚨 <strong>Critical Issues:</strong> We prioritize urgent technical problems</p>
                <p>💡 <strong>Feature Requests:</strong> We review and consider all suggestions</p>
              </div>
            </section>

            {/* Additional Information */}
            <section className="text-center p-6 bg-secondary/30 rounded-lg">
              <p className="text-muted-foreground mb-4">
                Before contacting us, you might find answers in our{" "}
                <a href="/faq" className="text-primary hover:underline font-medium">FAQ section</a>
                {" "}or by exploring the platform features.
              </p>
              <p className="text-sm text-muted-foreground">
                For privacy-related inquiries, please refer to our{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>.
                <br />
                For terms and conditions, visit our{" "}
                <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <DialogTitle>Feedback & Feature Requests</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Share your experience, report issues, or suggest new features
            </p>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <iframe
              src="https://docs.google.com/forms/d/e/1FAIpQLSdyKAXSGBOh5oVREdR7FLd2T2ZTH1pjtxXjSX3EpqEzYwpGDg/viewform?embedded=true"
              width="100%"
              height="2000"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              className="border-0"
              title="Feedback Form"
            >
              Loading…
            </iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
