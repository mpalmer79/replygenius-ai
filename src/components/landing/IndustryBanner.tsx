export default function IndustryBanner() {
  return (
    <section className="py-16 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600 animate-gradient bg-[length:200%_auto] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-wrap items-center justify-center gap-8">
          <img
            src="/dentist.jpg"
            alt="AI review response example for dental practice"
            className="rounded-2xl shadow-2xl max-w-sm w-full object-cover border-4 border-white/20"
          />
          <img
            src="/restaurant.jpg"
            alt="AI review response example for restaurant"
            className="rounded-2xl shadow-2xl max-w-sm w-full object-cover border-4 border-white/20"
          />
        </div>
      </div>
    </section>
  );
}

