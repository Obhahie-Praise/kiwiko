import React from 'react'
import Image from 'next/image'
import { Github, Mail, Linkedin, Twitter, Facebook } from 'lucide-react'

const FounderCard = ({ 
  name, 
  motive, 
  role, 
  imageSrc, 
  socials 
}: { 
  name: string; 
  motive: string; 
  role: string; 
  imageSrc: string; 
  socials: { type: 'x' | 'tiktok' | 'github' | 'mail' | 'facebook' | 'linkedin', href: string }[] 
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'x': return <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.6874 3.0625L12.6907 8.77425L8.37045 3.0625H2.11328L9.58961 12.8387L2.50378 20.9375H5.53795L11.0068 14.6886L15.7863 20.9375H21.8885L14.095 10.6342L20.7198 3.0625H17.6874ZM16.6232 19.1225L5.65436 4.78217H7.45745L18.3034 19.1225H16.6232Z"></path></svg>
      case 'github': return <Github size={18} />;
      case 'mail': return <Mail size={18} />;
      case 'facebook': return <Facebook size={18} />;
      case 'linkedin': return <Linkedin size={18} />;
      case 'tiktok': return <svg width={18} height={18} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8.24537V15.5C16 19.0899 13.0899 22 9.5 22C5.91015 22 3 19.0899 3 15.5C3 11.9101 5.91015 9 9.5 9C10.0163 9 10.5185 9.06019 11 9.17393V12.3368C10.5454 12.1208 10.0368 12 9.5 12C7.567 12 6 13.567 6 15.5C6 17.433 7.567 19 9.5 19C11.433 19 13 17.433 13 15.5V2H16C16 4.76142 18.2386 7 21 7V10C19.1081 10 17.3696 9.34328 16 8.24537Z"></path></svg>;
      default: return null;
    }
  }

  return (
    <div className="group relative p-8 rounded-[2rem] border border-zinc-100 bg-white hover:border-zinc-900 transition-all duration-700 hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)]">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
        <div className="relative w-50 h-50 shrink-0 overflow-hidden rounded-2xl grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out shadow-2xl shadow-zinc-200 group-hover:shadow-none">
          <Image 
            src={imageSrc} 
            alt={name} 
            fill 
            className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
          />
        </div>
        
        <div className="flex-1 space-y-4 pt-2">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-zinc-500 group-hover:text-zinc-900 transition-colors">
              {role}
            </span>
            <h3 className="text-3xl font-bold text-zinc-900 hero-font tracking-tighter leading-none">{name}</h3>
          </div>
          
          <p className="text-zinc-600 font-semibold max-w-[400px] leading-relaxed italic">
            "{motive}"
          </p>

          <div className="absolute bottom-4 right-8 w-fit flex items-center justify-center md:justify-start gap-6">
            {socials.map((social, idx) => (
              <a 
                key={idx} 
                href={social.href} 
                className="text-zinc-400 hover:text-zinc-900 transform hover:scale-125 transition-all duration-300"
              >
                {getIcon(social.type)}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const About = () => {
  return (
    <section id="about" className="w-full py-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Standard Centered Header */}
        <div className="flex flex-col items-center text-center mb-20 px-6">
          <div className="px-4 py-1.5 text-xs font-bold tracking-[0.2em] bg-zinc-900 text-white rounded-full mb-6 shadow-lg shadow-zinc-200">
            About
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-zinc-900 mb-6 uppercase hero-font">
            The minds behind 
          </h2>
          <p className="text-zinc-500 font-semibold max-w-xl leading-relaxed">
            Kiwiko was born from a singular vision: to bring radical transparency and high-momentum connectivity to the venture ecosystem.
          </p>
        </div>

        {/* Horizontal Founder Cards Stack */}
        <div className="max-w-4xl mx-auto space-y-8">
          <FounderCard 
            name="Obhahie Praise"
            role="Co-Founder & Developer"
            imageSrc="/ceo-headshot.jpg"
            motive="I wanted to build a place where founders could prove their velocity through data, not just pitch decks."
            socials={[
              { type: 'x', href: '#' },
              { type: 'tiktok', href: '#' },
              { type: 'github', href: '#' },
              { type: 'mail', href: '#' }
            ]}
          />
          
          <FounderCard 
            name="Bryan Agbai"
            role="Co-Founder & Designer"
            imageSrc="/ceo-siluette.jpeg"
            motive="Our goal is to eliminate the noise in venture capital and let execution speak for itself."
            socials={[
              { type: 'x', href: '#' },
              { type: 'facebook', href: '#' },
              { type: 'mail', href: '#' },
              { type: 'linkedin', href: '#' }
            ]}
          />
        </div>   
      </div>   
    </section>
  )
}

export default About