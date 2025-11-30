import { useEffect, useState } from "react";
import { TrendingUp, Sparkles, Flame, Target } from "lucide-react";

/* ---------- Animated Background Orbs ---------- */
const FloatingOrbs = ({ color1, color2 }) => (
  <div className="absolute inset-0 overflow-hidden">
    <div
      className="absolute w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full blur-3xl opacity-30 animate-float"
      style={{
        background: `radial-gradient(circle, ${color1}, ${color2})`,
        top: "-10%",
        right: "-10%",
        animationDelay: "0s",
        animationDuration: "8s"
      }}
    />
    <div
      className="absolute w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-full blur-3xl opacity-25 animate-float"
      style={{
        background: `radial-gradient(circle, ${color2}, ${color1})`,
        bottom: "-15%",
        left: "-10%",
        animationDelay: "2s",
        animationDuration: "10s"
      }}
    />
  </div>
);

/* ---------- Particle Effects ---------- */
const ParticleField = ({ color, count = 20 }) => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-1 rounded-full animate-particle"
        style={{
          background: color,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${5 + Math.random() * 10}s`,
        }}
      />
    ))}
  </div>
);

/* ---------- Enhanced Slides ---------- */
const slides = [
  {
    id: 1,
    title: "Smart Money Moves",
    subtitle: "Build wealth, one habit at a time",
    content: "Small consistent actions compound into extraordinary results. Save ₹100 daily, and watch your future transform.",
    gradient: "from-emerald-400 via-teal-500 to-cyan-500",
    icon: TrendingUp,
    orb1: "#10b981",
    orb2: "#06b6d4",
    stats: { label: "Daily Impact", value: "₹100" }
  },
  {
    id: 2,
    title: "Investment Magic",
    subtitle: "Let time multiply your money",
    content: "Compounding is your superpower. Start small today, and let mathematics work its magic over decades.",
    gradient: "from-violet-400 via-purple-500 to-fuchsia-500",
    icon: Sparkles,
    orb1: "#8b5cf6",
    orb2: "#d946ef",
    stats: { label: "Growth Rate", value: "12% avg" }
  },
  {
    id: 3,
    title: "Stop Burning Cash",
    subtitle: "Track before you wreck",
    content: "Awareness is the first step to financial freedom. Every tracked rupee is a rupee that works for you, not against you.",
    gradient: "from-orange-400 via-rose-500 to-pink-500",
    icon: Flame,
    orb1: "#f97316",
    orb2: "#ec4899",
    stats: { label: "Avg Waste", value: "₹3,500/month" }
  },
  {
    id: 4,
    title: "Precision Insights",
    subtitle: "Data-driven decisions",
    content: "Transform raw data into actionable intelligence. See patterns, predict trends, and optimize your financial strategy.",
    gradient: "from-blue-400 via-indigo-500 to-purple-500",
    icon: Target,
    orb1: "#3b82f6",
    orb2: "#6366f1",
    stats: { label: "Accuracy", value: "99.9%" }
  },
  {
    id: 5,
    title: "Financial Freedom",
    subtitle: "Your journey starts here",
    content: "Take control of your finances today for a worry-free tomorrow. Every step you take brings you closer to true freedom.",
    gradient: "from-green-400 via-lime-500 to-yellow-500",
    icon: Sparkles,
    orb1: "#22c55e",
    orb2: "#eab308",
    stats: { label: "Freedom Score", value: "++" }
  },
  {
    id: 6,
    title: "Budget Like a Pro",
    subtitle: "Master your money flow",
    content: "A well-planned budget is the foundation of financial success. Allocate wisely, spend mindfully, and save consistently.",
    gradient: "from-teal-400 via-cyan-500 to-blue-500",
    icon: Target,
    orb1: "#14b8a6",
    orb2: "#3b82f6",
    stats: { label: "Budget Adherence", value: "95%" }
  }
];

export default function FinanceCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToSlide = (index) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const currentSlide = slides[current];
  const Icon = currentSlide.icon;

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes particle {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.3; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateX(${direction === 1 ? '50px' : '-50px'}) scale(0.95);
          }
          to { 
            opacity: 1; 
            transform: translateX(0) scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .animate-float { animation: float ease-in-out infinite; }
        .animate-particle { animation: particle linear infinite; }
        .animate-slide-in { animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-pulse-slow { animation: pulse 3s ease-in-out infinite; }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .text-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,1), rgba(255,255,255,0.8));
          background-size: 200% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }
        
        .dot-indicator {
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .dot-indicator:hover {
          transform: scale(1.3);
        }
      `}</style>

      <div
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        className="relative w-full h-72 sm:h-80 md:h-96 lg:h-[28rem] xl:h-96 rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl"
      >
        {/* Animated Background */}
        <FloatingOrbs color1={currentSlide.orb1} color2={currentSlide.orb2} />
        <ParticleField color={currentSlide.orb1} count={15} />
        
        {/* Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-br ${currentSlide.gradient} opacity-20 transition-all duration-1000`} />
        
        {/* Content Container */}
        <div className="relative h-full flex items-center justify-center px-3 sm:px-6 md:px-8 lg:px-12 xl:px-16 z-10">
          
          {/* Left Section - Icon (Hidden on mobile and tablet) */}
          <div className="hidden lg:flex items-center justify-center mr-8">
            <div className="glass-card rounded-3xl p-6 lg:p-8 animate-slide-in">
              <Icon className="w-16 h-16 lg:w-24 lg:h-24 text-white animate-pulse-slow" strokeWidth={1.5} />
            </div>
          </div>
          
          {/* Center Section - Content */}
          <div className="flex-1 max-w-3xl text-center lg:text-left animate-slide-in">
            {/* Mobile Icon (Only visible on mobile and tablet) */}
            <div className="lg:hidden flex justify-center mb-4">
              <div className="glass-card rounded-2xl p-4">
                <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-white/90" strokeWidth={1.5} />
              </div>
            </div>
            
            {/* Stat Badge */}
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-3 sm:mb-4">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs sm:text-xs font-semibold text-white/90">
                {currentSlide.stats.label}: <span className="text-emerald-300">{currentSlide.stats.value}</span>
              </span>
            </div>
            
            {/* Title */}
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black text-white mb-2 leading-tight px-1 sm:px-0">
              <span className="text-shimmer">{currentSlide.title}</span>
            </h2>
            
            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg lg:text-xl font-medium text-white/70 mb-2 sm:mb-3 md:mb-4 lg:mb-6 px-1 sm:px-0">
              {currentSlide.subtitle}
            </p>
            
            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-white/60 leading-relaxed mb-3 sm:mb-4 md:mb-6 max-w-lg lg:max-w-xl mx-auto lg:mx-0 px-1 sm:px-0">
              {currentSlide.content}
            </p>
            
            {/* CTA Button */}
{/* <button className="glass-card rounded-full px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white hover:bg-white/10 transition-all duration-300 hover:scale-105 active:scale-95 hidden sm:inline-flex">
  Explore Insights →
</button> */}

          </div>
        </div>
        
        {/* Progress Indicators */}
        <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 sm:gap-2 md:gap-3 z-20">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goToSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`dot-indicator h-1 sm:h-1.5 md:h-2 rounded-full transition-all ${
                idx === current 
                  ? 'w-6 sm:w-8 md:w-12 bg-white shadow-lg shadow-white/50' 
                  : 'w-1 sm:w-1.5 md:w-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => goToSlide((current - 1 + slides.length) % slides.length)}
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 glass-card rounded-full p-2 sm:p-3 hover:bg-white/10 transition-all z-20 group"
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button
          onClick={() => goToSlide((current + 1) % slides.length)}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 glass-card rounded-full p-2 sm:p-3 hover:bg-white/10 transition-all z-20 group"
          aria-label="Next slide"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </>
  );
}