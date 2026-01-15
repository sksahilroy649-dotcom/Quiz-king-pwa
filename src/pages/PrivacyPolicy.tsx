import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="glass-card rounded-2xl p-6 space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: January 2026</p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-foreground/90">
              Welcome to Quiz King ("we," "our," or "us"). We are committed to protecting your privacy 
              and ensuring a safe gaming experience. This Privacy Policy explains how we collect, use, 
              and protect your information when you use our mobile application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
            <ul className="list-disc list-inside text-foreground/90 space-y-2">
              <li><strong>Account Information:</strong> Email address and password when you create an account</li>
              <li><strong>Game Data:</strong> Your quiz scores, coins earned, and game progress</li>
              <li><strong>Device Information:</strong> Device type, operating system, and unique device identifiers</li>
              <li><strong>Usage Data:</strong> How you interact with our app, including features used and time spent</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-foreground/90 space-y-2">
              <li>To provide and maintain our gaming services</li>
              <li>To save your game progress and rewards</li>
              <li>To process withdrawals and referral bonuses</li>
              <li>To send important notifications about your account</li>
              <li>To improve our app and user experience</li>
              <li>To prevent fraud and ensure security</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Data Storage and Security</h2>
            <p className="text-foreground/90">
              We use industry-standard security measures to protect your data. Your information is stored 
              securely on cloud servers with encryption. We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Third-Party Services</h2>
            <p className="text-foreground/90">
              Our app may contain links to social media platforms (Instagram, YouTube, Telegram). 
              These platforms have their own privacy policies, and we encourage you to review them. 
              We are not responsible for the privacy practices of third-party services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Children's Privacy</h2>
            <p className="text-foreground/90">
              Our app is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you believe we have collected information 
              from a child under 13, please contact us immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Your Rights</h2>
            <ul className="list-disc list-inside text-foreground/90 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of your data</li>
              <li>Request deletion of your account</li>
              <li>Opt-out of promotional communications</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Changes to This Policy</h2>
            <p className="text-foreground/90">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Contact Us</h2>
            <p className="text-foreground/90">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="text-primary font-medium">quizking.support@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;