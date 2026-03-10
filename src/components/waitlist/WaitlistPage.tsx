"use client";

import Image from "next/image";
import React, { useState } from "react";
import Aurora from "../Aurora";
import TopHeaderLights from "./TopHeaderLights";
import { CalendarClock, Copyright, Gem, Twitter, Users } from "lucide-react";
import Link from "next/link";
import UpdatesUI from "./UpdatesUI";
import SuccessModal from "./SuccessModal";
import { joinWaitlistAction } from "@/actions/waitlist.actions";
import { incrementWaitlistPageViewAction } from "@/actions/metrics.actions";
import { toast } from "@/hooks/use-toast";
import { useSearchParams } from "next/navigation";


const WaitlistPage = () => {
  const [email, setEmail] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchParams = useSearchParams();
  const source = searchParams.get("source");

  React.useEffect(() => {
    incrementWaitlistPageViewAction();
  }, []);

  const handleJoinWaitlist = async () => {
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("email", email);
    if (source) {
      formData.append("source", source);
    }

    try {
      const result = await joinWaitlistAction(formData);
      if (result.success) {
        setIsSuccess(true);
        setIsDuplicate(result.isDuplicate || false);
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {

      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black relative overflow-x-hidden w-full min-h-screen">
      {isSuccess && (
        <SuccessModal 
          email={email} 
          isDuplicate={isDuplicate}
          onClose={() => {
            setIsSuccess(false);
            setIsDuplicate(false);
            setEmail("");
          }} 
        />
      )}
      <div className="absolute top-4 right-4 flex space-x-2 md:space-x-4 text-xs md:text-sm z-10">
        <Link
          href="/"
          className="text-zinc-200 bg-zinc-800/60 font-normal flex items-center gap-2 px-3 md:px-6 py-1.5 md:py-2 rounded-lg"
        >
          <p className="hidden sm:inline">Engage </p>
          <p className="sm:hidden">X</p>
          <Twitter size={14} strokeWidth={1.8} />
        </Link>
        <UpdatesUI />
      </div>
      <div className="absolute top-0 w-full left-1/2 -translate-1/2">
        <Aurora amplitude={2} colorStops={["#f97316", "#ea580c"]} />
        {/* <TopHeaderLights /> */}
      </div>
      <header className="flex justify-center px-10 py-12 relative">
        <div className="bg-linear-to-b from-zinc-900 to-black rounded-full p-2">
          <div className="bg-linear-to-b from-zinc-800 to-black rounded-full p-2">
            <Image
              src="/neutral-logo.svg"
              alt="logo"
              width={100}
              height={100}
              className="object-contain rounded-full border-2 border-zinc-900"
            />
          </div>
        </div>
      </header>
      <main className="px-6 md:px-20 pb-10">
        <div className="relative">
          <div className="absolute -top-5 left-20 hidden md:block">
            <div className="relative">
              <div className="absolute -top-20 bg-linear-to-b from-zinc-400 to-black w-px h-150" />
              <div className="absolute -left-20 bg-linear-to-r from-zinc-400 to-black w-150 h-px" />
              <div className="" />
            </div>
          </div>
          <span className="uppercase flex justify-center text-zinc-400 text-[10px] md:text-xs font-medium pb-2">
            Kiwiko startup discovery
          </span>
          <h1 className="text-center tracking-tighter bg-linear-to-b from-zinc-500 via-zinc-400 to-zinc-100 bg-clip-text text-transparent text-4xl sm:text-5xl md:text-[4.5rem] font-medium leading-none">
            Join the waitlist for the <br /> the future of{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-b from-orange-500 to-orange-400 special-font italic font-medium">
              Startup discovery!{" "}
            </span>
          </h1>
          <p className="text-zinc-400 text-medium text-center mx-auto max-w-2xl py-6 text-lg">
            Recieve all the latest news and updates as well as early access to
            the beta. <br />{" "}
            <span className="font-medium text-zinc-300">
              Joining the waitlist gives you a free{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-orange-500 to-orange-400 font-semibold special-font italic">
                {" "}
                pro account
              </span>{" "}
              for a year after launch!
            </span>{" "}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="w-full sm:w-auto font-semibold bg-zinc-200/10 backdrop-blur-md text-zinc-200 px-4.5 py-2.5  border border-transparent rounded-lg outline-zinc-300/40 outline-[0.2px] focus:outline-zinc-100 focus:border-zinc-200 focus:border transition"
            placeholder="your@email.com"
            size={35}
          />
          <button 
            onClick={handleJoinWaitlist}
            disabled={isLoading}
            className="w-full sm:w-auto bg-white rounded-lg text-black font-medium py-2.5 px-6 hover:bg-zinc-200 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Joining..." : "Join waitlist"}
          </button>
        </div>
        <div className="flex items-center justify-center my-5">
          <div className="">
            <div className="relative">
              <img
                src="https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="h-7 w-7 rounded-full border-2 border-zinc-700 absolute top-0 left-0"
              />
              <img
                src="https://images.unsplash.com/photo-1595211877493-41a4e5f236b3?q=80&w=715&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="h-7 w-7 rounded-full border-2 border-zinc-700 absolute top-0 left-4"
              />
              <img
                src="https://images.unsplash.com/photo-1580518324671-c2f0833a3af3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt=""
                className="h-7 w-7 rounded-full border-2 border-zinc-700 absolute top-0 left-8"
              />
            </div>
            <p className="text-white/60 text-sm my-2 ml-18">
              Join 500+ already onboard!
            </p>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -bottom-20 right-0 bg-linear-to-t from-zinc-400 to-black w-px h-150 hidden md:block" />
          <div className="absolute -right-20 bg-linear-to-l from-zinc-400 to-black w-150 h-px hidden md:block" />
          <div className="" />
        </div>
        <div className="w-full max-w-2xl h-px bg-zinc-800 my-12 md:my-20 mx-auto" />
        <div />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl h-70 border border-zinc-700 p-8 group">
            <CalendarClock
              strokeWidth={1.4}
              className="w-10 h-10 text-zinc-300 mb-4 group-hover:text-orange-400 duration-300 group-hover:scale-110"
            />
            <h3 className="text-2xl text-zinc-200 special-font font-semibold py-4">
              Get Early Access Before Public Launch
            </h3>
            <p className="font-medium text-zinc-400 tracking-wide">
              Be among the first founders to use Kiwiko’s structured funding
              tools — and shape the product before everyone else joins.
            </p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl h-70 border border-zinc-700 p-8 group">
            <Gem
              strokeWidth={1.4}
              className="w-10 h-10 text-zinc-300 mb-4 group-hover:text-orange-400 duration-300 group-hover:scale-110"
            />
            <h3 className="text-2xl text-zinc-200 special-font font-semibold py-4">
              Unlock 1 Year of Pro
            </h3>
            <p className="font-medium text-zinc-400 tracking-wide">
              Waitlist members receive complimentary premium access when we
              launch. No hidden catches. Just early belief rewarded.
            </p>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-md rounded-xl h-70 border border-zinc-700 p-8 group">
            <Users
              strokeWidth={1.4}
              className="w-10 h-10 text-zinc-300 mb-4 group-hover:text-orange-400 duration-300 group-hover:scale-110"
            />
            <h3 className="text-2xl text-zinc-200 special-font font-semibold py-4">
              Join a Curated Founder Circle
            </h3>
            <p className="font-medium text-zinc-400 tracking-wide">
              Connect with serious builders preparing for structured funding
              rounds — before the noise of public launch.
            </p>
          </div>
        </div>
      </main>
      <footer className="text-center text-sm text-zinc-500 pt-10 font-medium space-y-1 pb-2">
        <p className="font-medium">
          <span className="text-orange-400 special-font">Kiwiko</span> is coming
          to the venture industry soon!{" "}
          <Copyright size={14} strokeWidth={2} className="text-zinc-500 inline" />{" "}
          {new Date().getFullYear()}{" "}
        </p>
      </footer>
    </div>
  );
};

export default WaitlistPage;

