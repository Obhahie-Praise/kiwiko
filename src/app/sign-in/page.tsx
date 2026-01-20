"use client";
import StatsSemiCircle from "@/components/StatsSemiCircle";
import { ArrowLeft, GithubIcon, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AuthClient from "./auth-client";
import { signIn } from "@/lib/auth-client";
import { useState } from "react";

const SignInPage = () => {
  const [isGoogleAuthenticating, setIsGoogleAuthenticating] = useState(false);
  const [isGithubAuthenticating, setIsGithubAuthenticating] = useState(false);
  const handleSocial = async (provider: "google" | "github") => {
    const res = await signIn.social({ provider });
    if (res.error) {
      setIsGoogleAuthenticating(false);
      setIsGithubAuthenticating(false);
    }
  };
  return (
    <div className="flex justify-center items-center overflow-y-hidden min-h-screen">
      <div className="space-y-2">
        <div className="">
          <h1 className="text-3xl font-semibold text-black text-center z-10">
            Continue to Kiwiko
          </h1>
          <p className="text-center">
            Dont have an account?{" "}
            <Link href="sign-in" className="underline">
              Sign In
            </Link>
          </p>
        </div>

        <div className="flex flex-col space-y-2">
          <button
            className="relative"
            onClick={() => {
              handleSocial("github");
            }}
          >
            <GithubIcon
              width={25}
              height={25}
              className="text-white absolute top-1/2 -translate-y-1/2 left-4"
            />
            <p className="font-medium border-2 border-zinc-400 py-3 rounded-lg bg-black text-white">
              Continue with Github
            </p>
            {isGithubAuthenticating ? (
              <LoaderCircle className="animate-spin text-zinc-400 absolute right-4 top-1/2 -translate-y-1/2" />
            ) : (
              ""
            )}
          </button>
          <button className="relative">
            <Image
              src="/google.png"
              alt="google logo"
              width={25}
              height={25}
              className=" absolute top-1/2 -translate-y-1/2 left-4"
            />
            <p className="font-medium border-2 border-zinc-400 py-3 rounded-lg">
              Continue with Google
            </p>
            {isGoogleAuthenticating ? (
              <LoaderCircle className="animate-spin text-zinc-600 absolute right-4 top-1/2 -translate-y-1/2" />
            ) : (
              ""
            )}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="h-px  flex-1 bg-zinc-400" />
          <p className="px-2 text-zinc-400 font-medium">or continue with</p>
          <div className="h-px  flex-1 bg-zinc-400" />
        </div>
        <div className="">
          <AuthClient />
        </div>
      </div>

      {/* <div className="absolute top-120 left-1/2 -translate-x-1/2 -z-10">
        <StatsSemiCircle />
      </div> */}
      <Link
        href="/"
        className="absolute top-10 left-10 p-2 border-2 border-zinc-500 rounded-lg"
      >
        <ArrowLeft />
      </Link>
    </div>
  );
};

export default SignInPage;
