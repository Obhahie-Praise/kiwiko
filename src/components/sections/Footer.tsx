import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-zinc-100">
      <div className="mx-auto max-w-7xl px-6 py-15">
        <div className="grid gap-16 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4 space-y-8">
            <div className="flex items-center gap-2">
               <Image src="/neutral-logo.svg" alt="logo" width={24} height={24} />
               <h3 className="text-xl font-black italic uppercase tracking-tighter">Kiwiko</h3>
            </div>
            <p className="text-zinc-500 font-bold text-lg leading-relaxed max-w-sm">
              The high-conviction infrastructure for verifiable venture execution.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest italic">
               <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
               Audited Data Only
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-12">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Protocol</h4>
                <ul className="space-y-2">
                  <li><Link href="#activity" className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-500 transition-colors">Activity</Link></li>
                  <li><Link href="#features" className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-500 transition-colors">Features</Link></li>
                  <li><Link href="#testimonials" className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-500 transition-colors">Testimonials</Link></li>
                </ul>
             </div>

             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Ecosystem</h4>
                <ul className="space-y-2">
                  <li><Link href="/resources" className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-500 transition-colors">Resources</Link></li>
                  <li><Link href="/discover" className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-500 transition-colors">Ventures</Link></li>
                  <li><Link href="/principles" className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-500 transition-colors">Principles</Link></li>
                </ul>
             </div>

             <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Legal</h4>
                <ul className="space-y-2">
                  <li><Link href="/privacy" className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-500 transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-500 transition-colors">Terms</Link></li>
                  <li><Link href="/contact" className="text-xs font-black uppercase tracking-widest text-zinc-900 hover:text-emerald-500 transition-colors">Contact</Link></li>
                </ul>
             </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-24 pt-12 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-6 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              <span>© {new Date().getFullYear()} KIWIKO CORP</span>
              <span className="text-zinc-200">/</span>
              <span>EST. 2024</span>
           </div>
           
           <div className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.3em] flex items-center gap-3 italic">
              Built for the <span className="bg-zinc-900 text-white px-2 py-0.5 rounded">Venture industry</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

