'use client';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-[#F5F0E9] to-[#E8D5B5] backdrop-blur-sm flex items-center justify-center z-[999]">
      <div className="flex flex-col items-center gap-8">
        {/* Coffee cup with steam animation */}
        <div className="relative w-32 h-32">
          {/* Cup body */}
          <div className="absolute inset-0 w-full h-3/4 bg-gradient-to-b from-white to-[#E8D5B5] rounded-b-2xl border-[6px] border-[#5D4037] shadow-lg">
            {/* Coffee liquid */}
            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-b from-[#5D4037] to-[#3E2723] rounded-b-2xl animate-wave overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#5D4037]/30 to-transparent"></div>
              <div className="absolute top-0 left-0 w-full h-4 bg-[#5D4037]/40 animate-foam"></div>
            </div>
          </div>
          
          {/* Cup handle */}
          <div className="absolute -right-4 top-6 w-8 h-12 border-6 border-[#5D4037] rounded-full"></div>
          
          {/* Steam animation */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex flex-col items-center">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="w-3 h-12 bg-[#F5F0E9]/90 rounded-full mb-1 animate-steam opacity-70"
                style={{ 
                  animationDelay: `${i * 0.3}s`,
                  filter: "blur(4px)"
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* Text content */}
        <div className="flex flex-col items-center gap-3">
          <h3 className="text-2xl font-bold text-[#3E2723] animate-pulse">
              Preparing coffee...
          </h3>
          <p className="text-[#5D4037] text-center max-w-md">
            Good coffee takes time<br/>
            Please wait a moment
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="w-48 h-1.5 bg-[#D7CCC8] rounded-full overflow-hidden mt-2">
          <div className="h-full bg-gradient-to-r from-[#5D4037] to-[#3E2723] rounded-full animate-progress"></div>
        </div>
        
        {/* Coffee beans decoration */}
        <div className="flex gap-3 mt-4">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-3 h-4 bg-[#5D4037] rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes wave {
          0%, 100% { 
            clip-path: polygon(0 40%, 100% 30%, 100% 100%, 0% 100%);
          }
          50% { 
            clip-path: polygon(0 50%, 100% 40%, 100% 100%, 0% 100%);
          }
        }
        
        @keyframes steam {
          0% { 
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          100% { 
            transform: translateY(-30px) scale(0.8);
            opacity: 0;
          }
        }
        
        @keyframes foam {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
        
        .animate-steam {
          animation: steam 2s ease-out infinite;
        }
        
        .animate-foam {
          animation: foam 4s linear infinite;
        }
        
        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
        
        .animate-bounce {
          animation: bounce 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}