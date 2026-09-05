import React from 'react';
import { PhoneCall, Heart, LifeBuoy, ShieldCheck, ExternalLink, MessageSquare } from 'lucide-react';
import { triggerHapticTap } from '../../services/native/hapticsService';

export const RehabHelplineDirectoryPage: React.FC = () => {
  const hotlines = [
    {
      name: 'Tamil Nadu 108 Emergency Ambulance',
      phone: '108',
      desc: '24/7 immediate medical & acute overdose response with BLS/ALS life support ambulances across all Tamil Nadu districts.',
      badge: 'TN EMERGENCY AMBULANCE',
      accent: 'text-rose-400',
    },
    {
      name: 'Tamil Nadu Police Anti-Drug Helpline (Drug-Free TN)',
      phone: '10581',
      desc: 'Toll-free dedicated police anti-drug helpline to report trafficking, seek guidance, and access de-addiction rehabilitation.',
      badge: 'TN POLICE TOLL-FREE',
      accent: 'text-cyan-400',
    },
    {
      name: 'National Drug De-Addiction Helpline (India)',
      phone: '14446',
      desc: 'Ministry of Social Justice and Empowerment (MoSJE), Govt of India. 24/7 toll-free counseling and treatment referral.',
      badge: 'GOVT OF INDIA / 24-7',
      accent: 'text-teal-400',
    },
    {
      name: 'Tele-MANAS National Mental Health & Substance Helpline',
      phone: '14416',
      desc: '24/7 comprehensive crisis support, psychological first-aid, and de-addiction tele-counseling in Tamil and English.',
      badge: 'MOHFW TELE-MANAS',
      accent: 'text-purple-400',
    },
    {
      name: 'RGGGH Poison Information & Toxicology Centre',
      phone: '1800-425-1122',
      desc: 'Rajiv Gandhi Government General Hospital (Chennai). 24/7 toxicologists for emergency poisoning and toxic substance treatment.',
      badge: 'RGGGH CHENNAI',
      accent: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-4 pb-14 animate-fade-in">
      <div className="flex items-center space-x-2">
        <LifeBuoy className="w-5 h-5 text-teal-400" />
        <h2 className="text-base font-bold text-white tracking-wide">Tamil Nadu Helplines & Care</h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
        All helplines below are toll-free, 100% confidential, and operate 24 hours a day across Tamil Nadu. Tap any card to place an immediate call.
      </div>

      <div className="space-y-3">
        {hotlines.map((hl) => (
          <a
            key={hl.phone}
            href={`tel:${hl.phone.replace(/-/g, '')}`}
            onClick={() => triggerHapticTap()}
            className="block bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-4 space-y-2.5 transition-all active:scale-[0.98]"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold">
                {hl.badge}
              </span>
              <div className="flex items-center space-x-1.5 text-xs font-mono text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>TOLL-FREE 24/7</span>
              </div>
            </div>

            <div>
              <h3 className="text-base font-bold text-white">{hl.name}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{hl.desc}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-mono text-xs">
              <span className={`font-black text-base ${hl.accent}`}>{hl.phone}</span>
              <div className="flex items-center space-x-1.5 bg-teal-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs">
                <PhoneCall className="w-3.5 h-3.5" />
                <span>TAP TO CALL</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
