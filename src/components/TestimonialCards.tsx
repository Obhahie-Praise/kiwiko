import React from "react";

const TestimonialCard = ({ testimonial }: any) => {
  return (
    <div className="w-90 h-65 bg-white border border-zinc-200 rounded-xl p-6 flex flex-col justify-between shadow-sm transition-transform duration-300 hover:translate-z-10">
      <p className="text-sm text-zinc-700 leading-relaxed">
        “{testimonial.quote}”
      </p>

      <div className="flex items-center gap-3 mt-6">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full grayscale"
        />
        <div>
          <p className="text-sm font-medium text-zinc-900">
            {testimonial.name}
          </p>
          <p className="text-xs text-zinc-500">
            {testimonial.role} · {testimonial.company}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
