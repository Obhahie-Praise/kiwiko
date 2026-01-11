import { testimonials } from "../constants/index";

export const testimonialCarouselItems = testimonials.map(
  (t, index) => ({
    id: t.id,
    title: t.name, // person name
    brand: `${t.role} · ${t.company}`,
    description: t.quote,
    tags: ["Founder feedback", "Verified use"], // subtle, not hype
    imageUrl: t.avatar,
    link: "/testimonials", // or "#testimonials"
  })
);