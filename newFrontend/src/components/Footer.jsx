import { ArrowUpRight, Sparkles } from "lucide-react";

const Footer = () => {
  return (
    <>
      <style>{`
        @keyframes gradient-flow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        
        .animated-gradient {
          background: linear-gradient(135deg, #06b6d4, #3b82f6, #8b5cf6, #06b6d4);
          background-size: 300% 300%;
          animation: gradient-flow 6s ease infinite;
        }
        
        .link-hover {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .link-hover::before {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, #06b6d4, #3b82f6);
          transition: width 0.3s ease;
        }
        
        .link-hover:hover::before {
          width: 100%;
        }
        
        .link-hover:hover {
          transform: translateX(4px);
          color: #06b6d4;
        }
        
        .social-bubble {
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .social-bubble:hover {
          transform: translateY(-4px) scale(1.1);
          box-shadow: 0 8px 20px rgba(6, 182, 212, 0.4);
        }
      `}</style>

      <footer className="bg-gray-900 border-t border-gray-800 mt-6 rounded-2xl overflow-hidden relative">
        {/* Subtle animated gradient line at top */}
        <div className="h-0.5 animated-gradient" />
        
        {/* Floating orb background */}
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" 
             style={{ animation: 'float-gentle 12s ease-in-out infinite' }} />
        
        <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Brand Section - 4 cols */}
            <div className="col-span-1 md:col-span-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 animated-gradient rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <span className="text-white font-black text-xl">₹</span>
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tight">MyMoneyPal</h3>
                  <p className="text-xs text-gray-500 font-medium">Financial Intelligence</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Smart finance tracking that actually makes sense. Built for people who value their money and time.
              </p>
              
              {/* Social Icons */}
              <div className="flex items-center gap-2.5">
                <a href="https://x.com/himanshu_29v" className="social-bubble w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center border border-white/10" target="_blank" aria-label="Twitter">
                  <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/himanshu-vaishnav-9878761b6/"  target="_blank" className="social-bubble w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center border border-white/10" aria-label="LinkedIn">
                  <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="https://github.com/himanshuVaishnav29" target="_blank" className="social-bubble w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center border border-white/10" aria-label="GitHub">
                  <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/lens_ogle/" target="_blank" className="social-bubble w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center border border-white/10" aria-label="Instagram">
                  <svg className="w-4 h-4 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.75 2h8.5A5.75 5.75 0 0122 7.75v8.5A5.75 5.75 0 0116.25 22h-8.5A5.75 5.75 0 012 16.25v-8.5A5.75 5.75 0 017.75 2zm0 1.5A4.25 4.25 0 003.5 7.75v8.5A4.25 4.25 0 007.75 20.5h8.5a4.25 4.25 0 004.25-4.25v-8.5A4.25 4.25 0 0016.25 3.5h-8.5zm8.75 2a1 1 0 110 2 1 1 0 010-2zm-4.25 1.25a4.25 4.25 0 110 8.5 4.25 4.25 0 010-8.5zm0 1.5a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links - 2 cols */}
            <div className="col-span-1 md:col-span-2 hidden md:block">
              <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Product
              </h4>
              <ul className="space-y-2.5">
                {['Dashboard', 'Transactions', 'Analytics', 'Reports'].map((item) => (
                  <li key={item}>
                    <a href="#" className="link-hover text-gray-400 text-sm inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company - 2 cols */}
            <div className="col-span-1 md:col-span-2 hidden md:block">
              <h4 className="text-white font-bold text-sm mb-4">Company</h4>
              <ul className="space-y-2.5">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="link-hover text-gray-400 text-sm inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal - 2 cols */}
            <div className="col-span-1 md:col-span-2 hidden md:block">
              <h4 className="text-white font-bold text-sm mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {['Privacy', 'Terms', 'Security', 'Cookies'].map((item) => (
                  <li key={item}>
                    <a href="#" className="link-hover text-gray-400 text-sm inline-block">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA - 2 cols */}
            {/* <div className="col-span-1 md:col-span-2">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 border border-cyan-500/20">
                <h4 className="text-white font-bold text-sm mb-2">Get Started</h4>
                <p className="text-gray-400 text-xs mb-3">Join 10K+ users tracking smarter</p>
                <a href="#" className="inline-flex items-center gap-1.5 text-cyan-400 text-xs font-semibold hover:gap-2 transition-all group">
                  Try for free
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div> */}
            
            <div className="col-span-1 md:col-span-2">
                <div className="rounded-xl p-4 border border-white/10 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] bg-[length:200%_200%] animate-flag-flow flex flex-col justify-center h-32">
                  <h4 className="text-black font-bold text-sm mb-1">
                    Standing tall in a nation of valor and vibrant culture     
                  </h4>
                  {/* <p className="text-black/80 text-xs mb-3">
                    A land of unity in diversity—where every heart beats for the tricolor.
                  </p> */}
                  <a
                    href="https://www.makeinindia.com/"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-black text-xs font-semibold hover:gap-2 transition-all group"
                  >
                    जय हिन्द 
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>

                <style>{`
                  @keyframes flag-flow {
                    0% { background-position: 0 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0 50%; }
                  }
                  .animate-flag-flow {
                    animation: flag-flow 4s ease-in-out infinite;
                  }
                `}</style>
          </div>





          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-gray-500 text-xs">
              © 2024 MyMoneyPal. Built with care in India 🇮🇳
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-400 text-xs">Developed by</span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <a href="https://www.linkedin.com/in/himanshu-vaishnav-9878761b6/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 text-xs font-medium hover:underline">@Himanshu Vaishnav</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;