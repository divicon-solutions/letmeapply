import { motion } from 'framer-motion';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const PricingTier = ({ name, price, features, isPro = false, isPopular = false }: {
  name: string;
  price: string;
  features: string[];
  isPro?: boolean;
  isPopular?: boolean;
}) => (
  <div className={`p-6 rounded-lg ${isPro ? 'bg-[rgb(230,244,229)] border-[#15ae5c]' : 'bg-white'} border shadow-sm relative h-full flex flex-col`}>
    {isPopular && (
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
        <span className="bg-[#15ae5c] text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
      </div>
    )}
    <div>
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-3xl font-bold mb-4">{price}</p>
      <ul className="space-y-2 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-[#15ae5c] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
    <div className="mt-auto">
      <button className={`w-full py-2 px-4 rounded ${isPro ? 'bg-[#15ae5c] text-white hover:bg-[#128a4a]' : 'bg-[rgb(230,244,229)] text-[#15ae5c] hover:bg-[#dcf0db]'} transition-colors duration-200`}>
        {isPro ? 'Upgrade Now' : 'Get Started'}
      </button>
    </div>
  </div>
);

const FeatureCarousel = ({ features }: { features: { title: string; description: string; icon: string }[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % features.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, features.length]);

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % features.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div className="relative">
          {/* Feature Cards */}
          <div className="flex gap-8 transition-transform duration-500 ease-in-out transform"
            style={{ transform: `translateX(-${currentIndex * 33.33}%)` }}>
            {features.map((feature, index) => (
              <div key={index} className="w-full md:w-1/3 flex-shrink-0">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-lg bg-white border shadow-sm hover:border-[#15ae5c] hover:shadow-md transition-all duration-200 h-full"
                >
                  <div className="text-[#15ae5c] mb-4 text-4xl">{feature.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center gap-2 mt-8">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentIndex ? 'bg-[#15ae5c] w-4' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TestimonialCard = ({ text, author, role, image }: { text: string; author: string; role: string; image?: string }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200"
  >
    <div className="flex items-start gap-4">
      {image && (
        <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
          <img src={image} alt={author} className="w-full h-full object-cover" />
        </div>
      )}
      <div>
        <p className="text-gray-600 italic mb-4">"{text}"</p>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-gray-500">{role}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="py-4 w-full flex justify-between items-center hover:text-[#15ae5c] transition-colors duration-200"
      >
        <h4 className="text-lg font-semibold text-left">{question}</h4>
        <svg
          className={`w-6 h-6 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-48 pb-4' : 'max-h-0'
          }`}
      >
        <p className="text-gray-600">{answer}</p>
      </div>
    </div>
  );
};

const StatCard = ({ number, label }: { number: string; label: string }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-[#15ae5c] mb-2">{number}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

export default function LandingPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Redirect to profile if user is signed in
  if (user) {
    navigate('/profile');
    return null;
  }

  const features = [
    {
      title: "Automated Form Filling",
      description: "Save time by eliminating manual inputs with our smart autofill technology.",
      icon: "🚀"
    },
    {
      title: "Job Posting Extraction",
      description: "Automatically extract and organize key details from any job posting.",
      icon: "📋"
    },
    {
      title: "AI Resume Generator",
      description: "Create tailored resumes and cover letters powered by AI technology.",
      icon: "📝"
    },
    {
      title: "Smart Job Tracking",
      description: "Keep track of all your applications and their status in one place.",
      icon: "📊"
    },
    {
      title: "Secure Data Storage",
      description: "Your data is encrypted and stored securely in the cloud.",
      icon: "🔒"
    },
    {
      title: "24/7 Support",
      description: "Get help whenever you need it with our responsive support team.",
      icon: "💬"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[#15ae5c]/5 z-0" />
        <div className="max-w-7xl mx-auto px-4 pt-20 pb-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#15ae5c] to-[#128a4a] bg-clip-text text-transparent">
                Apply to Jobs Faster with AI-Powered Autofill!
              </h1>
            </motion.div>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Automate job applications, extract job details, and generate resumes with AI—all in one click.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://chrome.google.com/webstore', '_blank')}
                className="bg-[#15ae5c] hover:bg-[#128a4a] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4L4 8v8l8 4 8-4V8l-8-4zm0 2.5L17 9l-5 2.5L7 9l5-2.5z" />
                </svg>
                Download Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoModalOpen(true)}
                className="bg-[rgb(230,244,229)] text-[#15ae5c] px-8 py-3 rounded-lg font-semibold hover:bg-[#dcf0db] transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18c.62-.39.62-1.29 0-1.69L9.54 5.98C8.87 5.55 8 6.03 8 6.82z" />
                </svg>
                Watch Demo
              </motion.button>
            </div>
            {/* Extension Preview */}
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-4 rounded-lg shadow-lg relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#15ae5c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img src="/extension-preview.gif" alt="LetMeApply in action" className="w-full rounded" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="100K+" label="Active Users" />
            <StatCard number="1M+" label="Applications Submitted" />
            <StatCard number="85%" label="Time Saved" />
            <StatCard number="4.8/5" label="User Rating" />
          </div>
        </div>
      </section> */}

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Features & Benefits</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline your job application process and increase your chances of success.
            </p>
          </div>
          <FeatureCarousel features={features} />
        </div>
      </section>

      {/* Pricing Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the plan that best fits your needs. All plans include our core features.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingTier
              name="Free Tier"
              price="$0"
              features={[
                "Auto-Fill Job Applications",
                "Job Posting Extraction",
                "Basic Resume & Cover Letter Generation",
              ]}
            />
            <PricingTier
              name="Pro Plan"
              price="$9.99/mo"
              features={[
                "Auto-Fill Job Applications",
                "Job Posting Extraction",
                "Basic Resume & Cover Letter Generation",
                "Advanced AI Resume Tailoring",
                "Multiple Resume Variants",
              ]}
              isPro={true}
              isPopular={true}
            />
            <PricingTier
              name="Premium Plan"
              price="$19.99/mo"
              features={[
                "Auto-Fill Job Applications",
                "Job Posting Extraction",
                "Basic Resume & Cover Letter Generation",
                "Advanced AI Resume Tailoring",
                "Multiple Resume Variants",
                "Priority Customer Support",
                "Integration with More Job Boards"
              ]}
            />
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple setup process.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Install Extension", description: "Get LetMeApply from Chrome Web Store", icon: "🔌" },
              { step: "2", title: "Open Job Posting", description: "Extension extracts key details automatically", icon: "🔍" },
              { step: "3", title: "Auto-fill Forms", description: "Apply with a single click", icon: "✨" },
              { step: "4", title: "Track Progress", description: "Manage your job search efficiently", icon: "📈" },
            ].map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="text-center bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="w-12 h-12 bg-[#15ae5c] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Users Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our users have to say.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              text="LetMeApply has completely transformed my job search. I can apply to multiple positions in minutes!"
              author="Sarah Johnson"
              role="Software Engineer"
              image="/testimonials/sarah.jpg"
            />
            <TestimonialCard
              text="The AI resume tailoring feature is a game-changer. My application success rate has doubled."
              author="Michael Chen"
              role="Product Manager"
              image="/testimonials/michael.jpg"
            />
            <TestimonialCard
              text="Best investment for job seekers. Saves hours of time and improves application quality."
              author="Emily Rodriguez"
              role="Marketing Specialist"
              image="/testimonials/emily.jpg"
            />
          </div>
        </div>
      </section> */}

      {/* Integration Partners */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Works With Your Favorite Job Sites</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Seamlessly integrate with all major job boards and company career pages.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-80">
            {/* LinkedIn Logo */}
            <svg viewBox="0 0 24 24" className="h-8 w-auto text-[#0A66C2]" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>

            {/* Workday Logo */}
            <svg viewBox="0 0 88 23" className="h-8 w-auto text-[#0875E1]" fill="currentColor">
              <path d="M18.5,11.5c0-4.1-3.3-7.5-7.5-7.5S3.5,7.3,3.5,11.5s3.3,7.5,7.5,7.5S18.5,15.6,18.5,11.5z M11,15.5 c-2.2,0-4-1.8-4-4s1.8-4,4-4s4,1.8,4,4S13.2,15.5,11,15.5z" />
              <path d="M27.5,4.5h4v14h-4V4.5z" />
              <path d="M35.5,4.5h4v2.3c1.1-1.7,3-2.7,5-2.7c3.9,0,7,3.1,7,7s-3.1,7-7,7c-2,0-3.9-1-5-2.7v8.7h-4V4.5z M43.5,14.5 c1.9,0,3.5-1.6,3.5-3.5S45.4,7.5,43.5,7.5S40,9.1,40,11S41.6,14.5,43.5,14.5z" />
              <path d="M54.5,4.5h4v2.3c1.1-1.7,3-2.7,5-2.7c3.9,0,7,3.1,7,7s-3.1,7-7,7c-2,0-3.9-1-5-2.7v8.7h-4V4.5z M62.5,14.5 c1.9,0,3.5-1.6,3.5-3.5S64.4,7.5,62.5,7.5S59,9.1,59,11S60.6,14.5,62.5,14.5z" />
              <path d="M73.5,0.5h4v18h-4V0.5z" />
              <path d="M81.5,0.5h4v18h-4V0.5z" />
            </svg>

            {/* Greenhouse Logo */}
            <svg viewBox="0 0 243 40" className="h-8 w-auto text-[#3AB549]" fill="currentColor">
              <path d="M20,0C9,0,0,9,0,20s9,20,20,20s20-9,20-20S31,0,20,0z M30,30H10V10h20V30z M15,15h10v10H15V15z" />
            </svg>

            {/* SimplyHired Logo */}
            <svg viewBox="0 0 24 24" className="h-8 w-auto text-[#2164f3]" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600">
              Got questions? We've got answers.
            </p>
          </div>
          <div className="space-y-4">
            <FAQItem
              question="Is LetMeApply free to use?"
              answer="Yes, we offer a free tier with essential features. Premium features are available in our Pro and Premium plans."
            />
            <FAQItem
              question="Which job sites does it support?"
              answer="LetMeApply works with major job portals including LinkedIn, Indeed, Glassdoor, and many more."
            />
            <FAQItem
              question="How does AI customize my resume?"
              answer="Our AI analyzes job descriptions and matches them with your experience, creating tailored resumes that highlight relevant skills."
            />
            <FAQItem
              question="Is my data secure?"
              answer="Yes, we use industry-standard encryption and security measures to protect your data. Your privacy is our top priority."
            />
            <FAQItem
              question="Can I cancel my subscription anytime?"
              answer="Yes, you can cancel your subscription at any time. No questions asked."
            />
            <FAQItem
              question="Do you offer a money-back guarantee?"
              answer="Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service."
            />
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-[#15ae5c] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('/pattern.svg')] bg-repeat" />
        </div>
        <div className="max-w-7xl mx-auto text-center px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Start Applying Smarter – Get LetMeApply Today!</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who are already saving time and getting better results with LetMeApply.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open('https://chrome.google.com/webstore', '_blank')}
                className="bg-white text-[#15ae5c] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Download Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors duration-200"
              >
                View Pricing
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-[#15ae5c]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg">
              {/* Chrome Web Store Icon */}
              <svg viewBox="0 0 24 24" className="h-12 w-12" fill="white">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22c-5.5 0-10-4.5-10-10S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10zm-1-13.5l4 4-4 4-4-4 4-4zm1-3.5c3.9 0 7 3.1 7 7s-3.1 7-7 7-7-3.1-7-7 3.1-7 7-7z" />
              </svg>
              <div className="text-sm">
                <div className="font-semibold text-white">Chrome Web Store</div>
                <div className="text-white/80">Featured Extension</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg">
              {/* Security Icon */}
              <svg viewBox="0 0 24 24" className="h-12 w-12" fill="white">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
              </svg>
              <div className="text-sm">
                <div className="font-semibold text-white">256-bit Encryption</div>
                <div className="text-white/80">Bank-grade Security</div>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg">
              {/* AI Powered Icon */}
              <svg viewBox="0 0 24 24" className="h-12 w-12" fill="white">
                <path d="M21 10.5h-2.5V8c0-.8-.7-1.5-1.5-1.5h-2.5V4c0-.8-.7-1.5-1.5-1.5h-3c-.8 0-1.5.7-1.5 1.5v2.5H6c-.8 0-1.5.7-1.5 1.5v2.5H3c-.8 0-1.5.7-1.5 1.5v3c0 .8.7 1.5 1.5 1.5h2.5V19c0 .8.7 1.5 1.5 1.5h2.5V23h3v-2.5H15c.8 0 1.5-.7 1.5-1.5v-2.5H19c.8 0 1.5-.7 1.5-1.5v-3c0-.8-.7-1.5-1.5-1.5z" />
              </svg>
              <div className="text-sm">
                <div className="font-semibold text-white">AI Powered</div>
                <div className="text-white/80">Latest Technology</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full relative">
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute -top-4 -right-4 bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video">
              <iframe
                src="https://www.youtube.com/embed/your-video-id"
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Copyright */}
      <footer className="py-3 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-3">
          <div className="text-center text-sm text-gray-500">
            © Copyright 2025. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
} 
