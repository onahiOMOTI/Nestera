'use client';

import React from 'react';
import { Twitter, MessageSquare, ExternalLink } from 'lucide-react';

const socialUpdates = [
  {
    platform: 'X (Twitter)',
    icon: Twitter,
    author: '@NesteraHQ',
    content: "Big milestone today! We've officially crossed $10M in TVL across our decentralized savings pools. Thank you to our incredible community! 🚀 #Stellar #Soroban #DeFi",
    date: '2h ago',
    link: '#',
    color: 'text-blue-400',
  },
  {
    platform: 'Telegram',
    icon: MessageSquare,
    author: 'Nestera Community',
    content: 'The new governance proposal NP-84 is now live for voting. Head over to the Governance Hub to cast your vote and shape the future of yield optimization!',
    date: '5h ago',
    link: '#',
    color: 'text-cyan-400',
  },
  {
    platform: 'X (Twitter)',
    icon: Twitter,
    author: '@NesteraHQ',
    content: "Join us for an AMA session this Thursday at 6PM UTC with our lead developers to discuss the Q3 Roadmap. Don't miss out! 🎙️",
    date: 'Yesterday',
    link: '#',
    color: 'text-blue-400',
  },
];

const SocialFeeds: React.FC = () => {
  return (
    <section className="w-full py-20 bg-[#061a1a]">
      <div className="max-w-[1200px] mx-auto px-12 max-md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-white mb-4">Stay in the Loop</h2>
          <p className="text-[1.1rem] text-[rgba(180,210,210,0.7)] max-w-2xl mx-auto">
            Follow our latest updates across social platforms to never miss a community event or platform milestone.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {socialUpdates.map((update, i) => (
            <div
              key={i}
              className="flex flex-col p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative platform icon background */}
              <update.icon className="absolute -bottom-6 -right-6 opacity-5 text-white" size={120} />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white/5 ${update.color}`}>
                    <update.icon size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{update.platform}</div>
                    <div className="text-xs text-[rgba(180,210,210,0.5)]">{update.author}</div>
                  </div>
                </div>
                <div className="text-xs text-[rgba(180,210,210,0.5)]">{update.date}</div>
              </div>

              <p className="text-[0.95rem] leading-relaxed text-[rgba(255,255,255,0.85)] mb-8 flex-1">
                {update.content}
              </p>

              <a
                href={update.link}
                className="flex items-center gap-2 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors w-fit"
              >
                View Post <ExternalLink size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialFeeds;
