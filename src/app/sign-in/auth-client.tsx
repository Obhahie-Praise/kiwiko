"use client";
import { authCallBack } from "@/lib/actions/auth-client";
import { signIn } from "@/lib/auth-client";
import { EyeClosedIcon, EyeIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";

const AuthClient = () => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [seePassword, setSeePassword] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setError(null);

    const res = await signIn.email({ email, password });

    if (res.error) {
      setError(res.error.message || "Something went wrong.");
      setIsAuthenticating(false);
    } else {
      return;
    }
  };
  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <div className="flex flex-col space-y-1">
        <label htmlFor="email" className="font-medium">
          Email
        </label>
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          id="email"
          placeholder="johndoe@gmail.com"
          className="border border-zinc-500 p-2 rounded-lg focus:outline-2 transition-all"
          required
        />
      </div>
      <div className="flex flex-col space-y-1">
        <label htmlFor="password" className="font-medium">
          Password
        </label>
        <div className="flex items-center border border-zinc-500 p-2 rounded-lg focus:outline-2 transition-all">
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={seePassword ? "text" : "password"}
            id="password"
            className="focus:outline-none flex-1"
            minLength={8}
            placeholder="min 8 char"
            required
          />
          <div
            className="px-2 cursor-pointer text-zinc-500"
            onClick={() => setSeePassword(!seePassword)}
          >
            {seePassword ? <EyeIcon /> : <EyeClosedIcon />}
          </div>
        </div>
      </div>

      <button
        className="text-center w-full py-3 font-medium mt-4 bg-black text-white rounded-lg flex items-center justify-center"
        onClick={authCallBack}
      >
        {isAuthenticating ? (
          <LoaderCircle className="animate-spin" width={30} height={30} />
        ) : (
          "Sign in"
        )}
      </button>
      <div className="w-full relative text-center">
        {error && (
          <p className="absolute w-full top-3 text-red-500 bg-red-500/20 py-1.5 border border-red-500 rounded-lg">
            {error}
          </p>
        )}
      </div>
    </form>
  );
};

export default AuthClient;
