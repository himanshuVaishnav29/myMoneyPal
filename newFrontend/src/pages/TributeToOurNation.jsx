import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TributeToOurNation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </Link>
      </div>

      {/* Main Section */}
      <div className="flex-1 px-6 flex flex-col items-center justify-center text-center">
        {/* Animated Flag */}
        <div className="relative mb-8">
          <img
            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnA0NHpjcjE0Y2tlZTh3M2luZTl5OXFtbzJ2dGh5cW1kMHR1amNhdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/9Gnbm29r7ftUA/giphy.gif"
            alt="Indian Flag"
            className="w-56 rounded-lg shadow-xl border border-white/10"
          />
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-10 blur-xl"></div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-clip-text text-transparent mb-4 drop-shadow-lg">
          भारत माता की जय
        </h1>

        {/* Short Message */}
        <p className="text-gray-300 text-lg md:text-xl max-w-xl leading-relaxed">
          Let's take a moment to be proud of our nation — a land of incredible
          diversity, unity, culture, and timeless values.
        </p>

        {/* Divider */}
        <div className="w-32 h-[2px] bg-gradient-to-r from-[#FF9933] via-white to-[#138808] my-6 opacity-70"></div>

        {/* Quote */}
        <p className="text-xl italic text-gray-200 max-w-2xl">
          “May our tricolor always fly high.”  
        </p>
        {/* <p className="text-[#138808] font-semibold mt-2">— Mahatma Gandhi</p> */}
      </div>

      {/* Footer Branding */}
      <div className="text-center py-4 text-sm text-gray-400 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        A small initiative by <span className="text-white font-semibold">MyMoneyPal</span> 🇮🇳
      </div>
    </div>
  );
};

export default TributeToOurNation;
