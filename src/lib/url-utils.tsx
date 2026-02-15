import { 
  Github, 
  Twitter, 
  Linkedin, 
  Globe, 
  Youtube, 
  Instagram, 
  Facebook, 
  FileCode, 
  Slack, 
  Dribbble, 
  Figma,
  ExternalLink
} from "lucide-react";
import React from "react";

export function getLinkIcon(url: string) {
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseUrl.includes("github.com")) return <Github size={18} />;
  if (lowercaseUrl.includes("twitter.com") || lowercaseUrl.includes("x.com")) return <Twitter size={18} />;
  if (lowercaseUrl.includes("linkedin.com")) return <Linkedin size={18} />;
  if (lowercaseUrl.includes("youtube.com")) return <Youtube size={18} />;
  if (lowercaseUrl.includes("instagram.com")) return <Instagram size={18} />;
  if (lowercaseUrl.includes("facebook.com")) return <Facebook size={18} />;
  if (lowercaseUrl.includes("slack.com")) return <Slack size={18} />;
  if (lowercaseUrl.includes("dribbble.com")) return <Dribbble size={18} />;
  if (lowercaseUrl.includes("figma.com")) return <Figma size={18} />;
  if (lowercaseUrl.includes("gitlab.com") || lowercaseUrl.includes("bitbucket.org")) return <FileCode size={18} />;
  
  return <Globe size={18} />;
}

export function getLinkLabel(url: string) {
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseUrl.includes("github.com")) return "GitHub";
  if (lowercaseUrl.includes("twitter.com") || lowercaseUrl.includes("x.com")) return "Twitter / X";
  if (lowercaseUrl.includes("linkedin.com")) return "LinkedIn";
  if (lowercaseUrl.includes("youtube.com")) return "YouTube";
  if (lowercaseUrl.includes("instagram.com")) return "Instagram";
  if (lowercaseUrl.includes("facebook.com")) return "Facebook";
  if (lowercaseUrl.includes("slack.com")) return "Slack";
  if (lowercaseUrl.includes("dribbble.com")) return "Dribbble";
  if (lowercaseUrl.includes("figma.com")) return "Figma";
  
  try {
    const domain = new URL(url).hostname.replace('www.', '');
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch (e) {
    return "Website";
  }
}
