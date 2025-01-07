'use client';

import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { FaTwitter, FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa';

const socialIcons = {
  twitter: FaTwitter,
  github: FaGithub,
  linkedin: FaLinkedin,
  instagram: FaInstagram,
};

export default function Footer() {
  const settings = useQuery(api.users.getSettings);

  if (!settings) return null;

  const { socialLinks } = settings;

  return (
    <footer className="fixed bottom-0 right-0 p-4">
      <div className="flex gap-4">
        {Object.entries(socialLinks).map(([platform, url]) => {
          if (!url) return null;
          const Icon = socialIcons[platform as keyof typeof socialIcons];
          
          return (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </div>
    </footer>
  );
}
