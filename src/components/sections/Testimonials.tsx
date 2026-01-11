"use client";

import React from "react";
import { testimonials } from "../../constants/index";
import TestimonialCard from "../TestimonialCards";
import ThreeDCarousel from "../lightswind/3d-carousel";
import { testimonialCarouselItems } from "@/utils/mapTestimonialsToCarousel";

const Testimonials = () => {
  return (
    <section id="testimonials" className="mt-40 mx-10 relative">
      <div className="flex items-center justify-center mb-4">
        <div className="px-1.5 py-0.5 text-sm border-2 border-zinc-300 bg-zinc-300 text-black rounded-lg">
          Testimonials
        </div>
      </div>

      <div className="text-center mb-16">
        <h2 className="text-4xl font-medium">
          Don’t just take our word for it
        </h2>
        <p className="text-zinc-500 mt-2">
          Honest feedback from founders and investors using Kiwiko
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
