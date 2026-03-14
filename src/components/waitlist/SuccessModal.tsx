import { Check, Mail, X } from "lucide-react";
import React from "react";

const SuccessModal = ({ email, isDuplicate, onClose }: { email: string; isDuplicate?: boolean; onClose: () => void }) => {
  return (
    <div className="absolute top-100 -translate-1/2 left-1/2 w-120 bg-black/60 backdrop-blur-2xl z-20">
      <div className="bg-black/10 border border-zinc-700 rounded-xl pt-20 px-4 pb-4 relative overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg border-2 border-zinc-800 hover:bg-zinc-800 transition-colors"
        >
          <X strokeWidth={2} size={20} className="text-zinc-400" />
        </button>
        <div className="bg-linear-to-b from-zinc-800 to-black rounded-full p-4 w-fit mx-auto">
          <div className="bg-linear-to-b from-zinc-700 to-black rounded-full p-4">
            <div className={`bg-linear-to-b ${isDuplicate ? 'from-red-400 to-red-950' : 'from-green-400 to-green-950'} rounded-full w-20 h-20 text-zinc-200 flex items-center justify-center`}>
              <p className="bg-linear-to-b from-orange-400 to-white bg-clip-text text z-1">
                {isDuplicate ? <X size={55} strokeWidth={3} /> : <Check size={55} strokeWidth={3} />}
              </p>
            </div>
          </div>
        </div>
        <h3 className="text-center font-medium text-4xl px-10 pt-3 tracking-tighter bg-linear-to-b from-zinc-200 to-zinc-300/60 text-transparent bg-clip-text">
          {isDuplicate ? "You're already on our waitlist" : "We've added you to our waitlist!"}
        </h3>
        <p className="text-zinc-400 text-center font-medium pt-1 pb-10">
          Go to your email and verify your identity
        </p>
        <div className="bg-linear-to-b to-zinc-800/80 from-zinc-900 rounded-xl px-4 pt-4  pb-2">
          <div className="bg-black/80 rounded-xl border border-green-700 flex items-center justify-between py-3 px-5 font-medium">
            <div className="text-zinc-300 flex items-center gap-3">
              <Mail size={16} strokeWidth={2.2} />
              <p className="">{email}</p>
            </div>
            <p className="text-xs font-semibold text-zinc-600">#708</p>
          </div>
          <div className="font-medium text-sm text-zinc-400 text-center pt-2">
            <span className="font-semibold text-orange-400 special-font tracking-wide italic">
              Kiwiko
            </span>{" "}
            is coming to the venture industry soon!
          </div>
        </div>
        <div className="absolute -top-40 -z-1 left-1/2 -translate-x-1/2 bg-white/30 blur-3xl rounded-[150%] w-50 h-100" />
      </div>
    </div>
  );
};


export default SuccessModal;
