'use client';

import React from 'react';
import { Users, Code, Vote, Landmark } from 'lucide-react';

const stats = [
  {
    label: 'Total Members',
    value: '12,482',
    icon: Users,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
  },
  {
    label: 'Active Contributors',
    value: '342',
    icon: Code,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
  },
  {
    label: 'Proposals Passed',
    value: '86',
    icon: Vote,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
  },
  {
    label: 'Community Treasury',
    value: '$1.2M XLM',
    icon: Landmark,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10',
  },
];

const CommunityStats: React.FC = () => {
  return (
    <section className="w-full py-16 bg-[#061a1a]">
      <div className="max-w-[1200px] mx-auto px-12 max-md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`${stat.color}`} size={24} />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-[rgba(180,210,210,0.6)] uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunityStats;
