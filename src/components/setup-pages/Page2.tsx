import { ChevronLeft, ChevronRight, Target, Info, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

const Page2 = ({
  position,
  userRole,
  setCatergory,
  catergory,
  setProjectDesc,
  projectDesc,
  setProjectName,
  projectName,
}: {
  position: string;
  userRole: string;
  catergory: string;
  setCatergory: React.Dispatch<React.SetStateAction<string>>;
  projectName: string;
  setProjectName: React.Dispatch<React.SetStateAction<string>>;
  projectDesc: string;
  setProjectDesc: React.Dispatch<React.SetStateAction<string>>;
}) => {
  useEffect(() => {
    if (userRole === "") {
      redirect("/onboarding/setup?page=1");
    }
  }, []);

  const isComplete = projectName && projectDesc && catergory;
  const categories = ["AI", "Fintech", "Health", "Dev tools", "Web 3", "Other"];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Visual Sidebar */}
      <div className="hidden lg:flex lg:w-1/3 bg-zinc-900 p-16 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-zinc-800 rounded-full blur-[100px] -z-10 opacity-50" />
        
        <div className="space-y-4 relative z-10">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-zinc-900 italic font-black">P2</div>
          <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-tight">
            Venture <br /> <span className="text-zinc-500">Definitions.</span>
          </h2>
          <p className="text-zinc-400 font-bold text-lg leading-relaxed">
            Initialize your venture metadata. Clarity is the first signal of execution.
          </p>
        </div>

        <div className="space-y-6 relative z-10">
           <div className="flex items-center gap-3 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
              <Target size={16} className="text-emerald-500" />
              Primary Metadata Layer
           </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16 lg:p-24 relative">
        <div className="w-full max-w-xl space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] italic">Step 02 / 08</span>
            <h1 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tighter">Core Signals.</h1>
          </div>

          <div className="space-y-10">
            {/* Project Name */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Info size={12} /> Venture Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Zurixmedia"
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-bold text-zinc-900"
              />
            </div>

            {/* Category */}
            <div className="space-y-4">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid size={12} /> Industry Sector
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCatergory(cat)}
                    className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      catergory === cat 
                        ? "bg-zinc-900 text-white border-zinc-900 shadow-lg shadow-zinc-200" 
                        : "bg-white text-zinc-500 border-zinc-100 hover:border-zinc-300"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2.5">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Single Sentence Pitch</label>
              <textarea
                value={projectDesc}
                onChange={(e) => setProjectDesc(e.target.value)}
                placeholder="The high-momentum infrastructure for..."
                className="w-full px-6 py-4 bg-zinc-50 border border-zinc-200 rounded-2xl outline-none focus:ring-2 focus:ring-zinc-900/5 focus:border-zinc-900 transition-all font-bold text-zinc-900 min-h-[120px] resize-none"
              />
            </div>
          </div>

          {/* Navigation */}
          <div className="pt-10 flex items-center justify-between border-t border-zinc-100">
            <Link
              href={`/onboarding/setup?page=${Number(position) - 1}`}
              className="group flex items-center gap-3 text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-zinc-900 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center group-hover:bg-zinc-100 transition-colors">
                <ChevronLeft size={16} />
              </div>
              Back
            </Link>

            <Link
              href={isComplete ? `/onboarding/setup?page=${Number(position) + 1}` : "#"}
              className={`group flex items-center gap-3 px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                isComplete 
                  ? "bg-zinc-900 text-white shadow-xl shadow-zinc-200 hover:bg-black" 
                  : "bg-zinc-100 text-zinc-300 cursor-not-allowed"
              }`}
            >
              Next Step
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page2;

