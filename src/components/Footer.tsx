import React from 'react';
import { ShieldCheck, Award, Zap, Heart, Recycle, Globe } from 'lucide-react';

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="bg-slate-900 text-white border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top Partner Strip */}
        <div className="border-b border-slate-800 pb-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">STRATEGIC PARTNERS:</span>
            <span>ActiveSG · Health Promotion Board (HPB) · Singapore Food Agency (SFA) · OneMap</span>
          </div>

          <div className="flex items-center gap-4 text-emerald-400 font-semibold">
            <span className="flex items-center gap-1">
              <Recycle className="w-4 h-4" /> 100% Biodegradable Eco-Trays
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> SFA Grade A Certified
            </span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
          
          {/* Brand info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#006948] flex items-center justify-center text-white font-bold">
                <Zap className="w-4 h-4 fill-white" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-white">
                KINETIC<span className="text-emerald-400">FUEL</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Clinical sports recovery meals dispensed hot & ready or chilled from smart automated lockers across Singapore sports centres.
            </p>
            <div className="text-[11px] text-slate-500">
              Singapore Central Kitchen: 14 Senoko Way, SFA Lic #CK-2024-8891
            </div>
          </div>

          {/* Nav links */}
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-slate-300">Navigation</h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button onClick={() => onNavClick('meals')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Recovery Meals Menu
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('why-better')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Why Better Than Cooking
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('pods')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  ActiveSG Pods Network
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('scanner')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  AI Meal Photo Scanner
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('calculator')} className="hover:text-emerald-400 transition-colors cursor-pointer">
                  Recovery Macro Planner
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Standards */}
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-slate-300">Clinical Formulation</h5>
            <ul className="space-y-1.5 text-slate-400">
              <li>HPB Healthier Choice Endorsement</li>
              <li>3.0g+ Leucine Threshold for mTOR Trigger</li>
              <li>Vacuum Blast-Chilled (3°C) Preservation</li>
              <li>Thermal Dispenser (65°C) ActiveSG Pods</li>
              <li>Zero Refined Seed Oils or Added MSG</li>
            </ul>
          </div>

          {/* MCP & Developer */}
          <div className="space-y-2">
            <h5 className="font-bold uppercase tracking-wider text-slate-300">API & MCP Connectivity</h5>
            <p className="text-slate-400 leading-relaxed">
              Built for integrations with Whoop, Garmin, Apple Health, and external sports booking bots.
            </p>
            <button
              onClick={() => onNavClick('mcp')}
              className="inline-flex items-center gap-1.5 text-emerald-400 font-bold hover:underline cursor-pointer"
            >
              <span>Explore MCP Tool Schema</span>
              <span>→</span>
            </button>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © {new Date().getFullYear()} Kinetic Fuel Singapore Pte. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-3">
            <span>Privacy Policy</span>
            <span>·</span>
            <span>Food Hygiene Standards</span>
            <span>·</span>
            <span>ActiveSG Partnership Terms</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
