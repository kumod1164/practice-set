import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
          <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground mb-4">
              By accessing and using UPSC Practice Platform, you accept and agree to be bound by the terms and 
              provisions of this agreement. If you do not agree to these terms, please do not use our platform.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground mb-4">
              UPSC Practice Platform provides an online test preparation service for UPSC aspirants, including:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Practice questions and mock tests</li>
              <li>Performance analytics and progress tracking</li>
              <li>Topic-wise practice sessions</li>
              <li>Previous year questions (PYQs)</li>
              <li>Personalized study recommendations</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">3. User Accounts</h2>
            <p className="text-muted-foreground mb-2">To use our platform, you must:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Create an account using valid credentials</li>
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Be responsible for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">4. User Conduct</h2>
            <p className="text-muted-foreground mb-2">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Share your account credentials with others</li>
              <li>Use the platform for any illegal purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Copy, distribute, or modify our content without permission</li>
              <li>Use automated tools to scrape or download content</li>
              <li>Interfere with the proper functioning of the platform</li>
              <li>Impersonate any person or entity</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
            <p className="text-muted-foreground mb-4">
              All content on UPSC Practice Platform, including questions, explanations, analytics, and software, 
              is owned by us or our licensors and is protected by copyright, trademark, and other intellectual 
              property laws. You may not reproduce, distribute, or create derivative works without our express permission.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">6. Test Content and Accuracy</h2>
            <p className="text-muted-foreground mb-4">
              While we strive to provide accurate and up-to-date content, we do not guarantee the accuracy, 
              completeness, or reliability of any questions, answers, or explanations. The content is for 
              educational purposes only and should not be considered as official UPSC material.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">7. Subscription and Payments</h2>
            <p className="text-muted-foreground mb-4">
              Currently, UPSC Practice Platform is provided free of charge. We reserve the right to introduce 
              paid features or subscriptions in the future, with advance notice to users.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">8. Service Availability</h2>
            <p className="text-muted-foreground mb-4">
              We strive to maintain 24/7 availability but do not guarantee uninterrupted access. 
              We may suspend or terminate the service for maintenance, updates, or other reasons without prior notice.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
            <p className="text-muted-foreground mb-4">
              UPSC Practice Platform is provided "as is" without warranties of any kind. We shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Any direct, indirect, or consequential damages</li>
              <li>Loss of data or interruption of service</li>
              <li>Errors or inaccuracies in content</li>
              <li>Results of your UPSC examination</li>
              <li>Third-party actions or content</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">10. Termination</h2>
            <p className="text-muted-foreground mb-4">
              We reserve the right to suspend or terminate your account at any time for violation of these terms 
              or for any other reason. You may also delete your account at any time through your account settings.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
            <p className="text-muted-foreground mb-4">
              We may modify these terms at any time. Continued use of the platform after changes constitutes 
              acceptance of the modified terms. We will notify users of significant changes via email or platform notification.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">12. Governing Law</h2>
            <p className="text-muted-foreground mb-4">
              These terms shall be governed by and construed in accordance with the laws of India. 
              Any disputes shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">13. Contact Information</h2>
            <p className="text-muted-foreground mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-muted-foreground">
              Email: <a href="mailto:kumodsharma1164@gmail.com" className="text-primary hover:underline">kumodsharma1164@gmail.com</a>
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3">14. Severability</h2>
            <p className="text-muted-foreground mb-4">
              If any provision of these terms is found to be unenforceable or invalid, that provision shall be 
              limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
