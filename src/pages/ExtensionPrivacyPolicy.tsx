import React from 'react';

const ExtensionPrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <h1 className="text-4xl font-bold mb-6">
          Privacy Policy
        </h1>
        
        <h2 className="text-xl font-semibold mt-6 mb-4">
          Last Updated: February 14, 2025
        </h2>

        <p className="text-gray-700 mt-4 mb-6">
          Welcome to LetMeApply's Privacy Policy. Your privacy is important to us, and we are committed to protecting your personal information.
        </p>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">1. Information We Collect</h3>
          <p className="text-gray-700">
            Our extension collects only the necessary information required to enhance your job application process:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Basic profile information you choose to provide</li>
            <li>Job application related data you input through the extension</li>
            <li>Technical information necessary for the extension's functionality</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">2. How We Use Your Information</h3>
          <p className="text-gray-700">
            We use your information solely to:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Facilitate automatic job application form filling</li>
            <li>Improve our extension's functionality</li>
            <li>Provide technical support when needed</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">3. Data Storage and Security</h3>
          <p className="text-gray-700">
            We store your data securely on Render Cloud, a modern cloud infrastructure provider. We implement multiple layers of security measures to protect your information:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>SSL/TLS encryption for all data transmissions</li>
            <li>Secure cloud infrastructure with automatic security patches</li>
            <li>Regular security monitoring and updates</li>
            <li>Automated backup and disaster recovery systems</li>
            <li>Secure authentication and access control mechanisms</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">4. Data Sharing</h3>
          <p className="text-gray-700">
            We do not sell, trade, or otherwise transfer your personal information to third parties. Your data is used exclusively for the extension's functionality.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">5. Your Rights</h3>
          <p className="text-gray-700">You have the right to:</p>
          <ul className="list-disc ml-6 mt-2 text-gray-700">
            <li>Access your personal data</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of any future communications</li>
            <li>Update or correct your information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">6. Changes to Privacy Policy</h3>
          <p className="text-gray-700">
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
          </p>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold mb-4">7. Contact Us</h3>
          <p className="text-gray-700">
            If you have any questions about this Privacy Policy, please contact us at support@letmeapply.com
          </p>
        </section>
      </div>
    </div>
  );
};

export default ExtensionPrivacyPolicy;