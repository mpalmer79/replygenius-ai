
const features = [
  {
    iconSrc: '/ai-response.png',
    iconAlt: 'AI-Powered Responses icon',
    bgColor: 'bg-primary-50',
    title: 'AI-Powered Responses',
    description: 'Generate personalized, human-sounding responses in seconds. Our AI learns your brand voice and tone.',
  },
  {
    iconSrc: '/platform-support.png',
    iconAlt: 'Multi-Platform Support icon',
    bgColor: 'bg-green-50',
    title: 'Multi-Platform Support',
    description: 'Manage reviews from Google, Yelp, Facebook, and TripAdvisor all in one unified dashboard.',
  },
  {
    iconSrc: '/brand-voice.png',
    iconAlt: 'Custom Brand Voice icon',
    bgColor: 'bg-purple-50',
    title: 'Custom Brand Voice',
    description: 'Train the AI to match your unique personality, tone, and communication style perfectly.',
  },
  {
    iconSrc: '/sentiment-analysis.png',
    iconAlt: 'Sentiment Analysis icon',
    bgColor: 'bg-yellow-50',
    title: 'Sentiment Analysis',
    description: 'Automatically detect negative reviews and prioritize urgent responses to protect your reputation.',
  },
  {
    iconSrc: '/approval-workflow.png',
    iconAlt: 'Approval Workflow icon',
    bgColor: 'bg-red-50',
    title: 'Approval Workflow',
    description: 'Review and edit AI responses before posting. Full control with one-click approval.',
  },
  {
    iconSrc: '/reports.png',
    iconAlt: 'Analytics & Reports icon',
    bgColor: 'bg-indigo-50',
    title: 'Analytics & Reports',
    description: 'Track response rates, sentiment trends, and review volume with detailed analytics.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need to Manage Reviews</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Powerful features designed specifically for local businesses</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={feature.title} className="card card-hover group text-center" style={{ animationDelay: `${index * 100}ms` }}>
              <div
                className={`w-48 h-48 ${feature.bgColor} rounded-3xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 feature-icon overflow-hidden mx-auto`}
              >
                <img
                  src={feature.iconSrc}
                  alt={feature.iconAlt}
                  className="w-full h-full object-contain scale-[1.55]"
                  loading="lazy"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
