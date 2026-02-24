"use client";

import React from "react";
import ThreeDCarousel from "../lightswind/3d-carousel";
import { testimonialCarouselItems } from "@/utils/mapTestimonialsToCarousel";

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 mx-10 relative">
      <div className="flex flex-col items-center text-center mb-20 px-6">
        <div className="px-3 py-1 text-xs font-semibold tracking-[0.15em] bg-zinc-900 text-white rounded-full border border-zinc-800 mb-4">
          Testimonials{" "}
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-zinc-900 mb-4 uppercase hero-font">
          trustworthy <span className="text-zinc-400">feedback.</span>
        </h2>
        <p className="text-zinc-500 font-semibold max-w-lg">
          Unfiltered feedback from the founders and institutional allocators
          building atop the Kiwiko Engine.
        </p>
      </div>

      <ThreeDCarousel
        items={testimonialCarouselItems}
        autoRotate={false}
        cardHeight={320}
        isMobileSwipe={true}
      />
    </section>
  );
};

export default Testimonials;
