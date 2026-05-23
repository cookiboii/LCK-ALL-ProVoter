"use client";

import { useState, useEffect, useMemo } from "react";
import { Player, Role, TeamCode } from "../components/types";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Zap, Sword, Crosshair, Heart, X, Plus, Search, 
  Trophy, Share2, RefreshCw, Star, Users, Check, ExternalLink, ArrowRight,
  Globe
} from "lucide-react";

export type Lang = "en" | "ko";

export const TRANSLATIONS = {
  en: {
    officialBadge: "LCK Official All-Pro Selection",
    title: "LCK ALL-PRO VOTER",
    description: "Select your All-Pro 1st, 2nd, and 3rd teams for the LCK 2026 Season and vote for your MVP and Rookie of the Split.",
    shareRoster: "Share Roster",
    downloadCard: "Download Card",
    reset: "Reset",
    firstTeam: "ALL-PRO 1ST TEAM",
    secondTeam: "ALL-PRO 2ND TEAM",
    thirdTeam: "ALL-PRO 3RD TEAM",
    addPlayer: "Add",
    mvpTitle: "Player of the Split (MVP)",
    rookieTitle: "Rookie of the Split",
    selectMvpEmpty: "Select All-Pro players first",
    selectMvpPrompt: "Select MVP from selected All-Pros...",
    selectRookiePrompt: "Select Rookie of the Split...",
    modalTitle: "Select {role} Candidate",
    modalSubtitle: "Assigning to {tier} All-Pro Team",
    searchPlaceholder: "Search player name...",
    allTeams: "ALL",
    currentSlot: "Current Slot",
    moveFrom: "Move from {tier}",
    select: "Select",
    noCandidates: "No candidates match the search filters",
    tryResetFilter: "Try selecting another team or resetting the query",
    resetToast: "Selections reset successfully.",
    copySuccessToast: "Copied roster text to clipboard!",
    copyFailToast: "Failed to copy text.",
    generatingToast: "Generating your high-quality All-Pro card...",
    downloadToast: "All-Pro image downloaded!",
    exportFailToast: "Failed to export image.",
    shareHeader: "🏆 LCK 2026 Season All-Pro Teams 🏆",
    shareMvp: "👑 Player of the Split (MVP): {name}",
    shareRookie: "⭐ Rookie of the Split: {name}",
    shareFooter: "Create your own All-Pro roster at LCK All-Pro Voter!",
    emptySlot: "Empty",
    notSelected: "Not selected",
    footerText: "LCK All-Pro Selector 2026. Made with ❤️. LCK is a registered trademark of League of Legends Champions Korea & Riot Games.",
    rosterRef: "Roster Reference (Namu.wiki)"
  },
  ko: {
    officialBadge: "LCK 공식 올프로 선정",
    title: "LCK 올프로 투표",
    description: "LCK 2026 시즌의 올프로 1st, 2nd, 3rd 팀을 선택하고, 이번 스플릿의 MVP와 루키를 선정해 보세요.",
    shareRoster: "로스터 공유",
    downloadCard: "카드 다운로드",
    reset: "초기화",
    firstTeam: "올프로 퍼스트 팀",
    secondTeam: "올프로 세컨드 팀",
    thirdTeam: "올프로 서드 팀",
    addPlayer: "추가",
    mvpTitle: "스플릿 MVP (최우수 선수)",
    rookieTitle: "신인상 (Rookie of the Split)",
    selectMvpEmpty: "올프로 선수를 먼저 선택해 주세요",
    selectMvpPrompt: "선정된 올프로 중에서 MVP 선택...",
    selectRookiePrompt: "루키 오브 더 스플릿 선택...",
    modalTitle: "{role} 후보 선택",
    modalSubtitle: "{tier} 올프로 팀에 배정 중",
    searchPlaceholder: "선수 이름 검색...",
    allTeams: "전체",
    currentSlot: "선택된 슬롯",
    moveFrom: "{tier}에서 이동",
    select: "선택",
    noCandidates: "검색 필터와 일치하는 선수가 없습니다",
    tryResetFilter: "다른 팀을 선택하거나 검색어를 초기화해 보세요",
    resetToast: "선택 항목이 초기화되었습니다.",
    copySuccessToast: "로스터 텍스트가 클립보드에 복사되었습니다!",
    copyFailToast: "텍스트 복사에 실패했습니다.",
    generatingToast: "고화질 올프로 카드를 생성 중입니다...",
    downloadToast: "올프로 이미지가 다운로드되었습니다!",
    exportFailToast: "이미지 내보내기에 실패했습니다.",
    shareHeader: "🏆 LCK 2026 시즌 올프로 팀 🏆",
    shareMvp: "👑 스플릿 MVP: {name}",
    shareRookie: "⭐ 신인상 (Rookie of the Split): {name}",
    shareFooter: "LCK 올프로 투표기에서 나만의 올프로 로스터를 완성해 보세요!",
    emptySlot: "비어 있음",
    notSelected: "미선택",
    footerText: "LCK 올프로 셀렉터 2026. 제작: ❤️. LCK는 League of Legends Champions Korea 및 Riot Games의 등록 상표입니다.",
    rosterRef: "참가팀 로스터 참고 (나무위키)"
  }
};

type Tier = "1st" | "2nd" | "3rd";
const TIERS: Tier[] = ["1st", "2nd", "3rd"];
const ROLES: Role[] = ["TOP", "JUG", "MID", "ADC", "SPT"];

const TIER_METADATA: Record<Tier, { label: string; color: string; borderClass: string; textClass: string; glowClass: string; badgeBg: string }> = {
  "1st": { 
    label: "ALL-PRO 1ST TEAM", 
    color: "#fbbf24", 
    borderClass: "border-amber-400/40 hover:border-amber-400/80", 
    textClass: "text-amber-400", 
    glowClass: "shadow-[0_0_20px_rgba(245,158,11,0.15)] bg-amber-950/5", 
    badgeBg: "bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950" 
  },
  "2nd": { 
    label: "ALL-PRO 2ND TEAM", 
    color: "#cbd5e1", 
    borderClass: "border-slate-400/40 hover:border-slate-400/80", 
    textClass: "text-slate-300", 
    glowClass: "shadow-[0_0_20px_rgba(203,213,225,0.1)] bg-slate-900/10", 
    badgeBg: "bg-gradient-to-r from-slate-400 to-slate-300 text-slate-950" 
  },
  "3rd": { 
    label: "ALL-PRO 3RD TEAM", 
    color: "#b45309", 
    borderClass: "border-amber-700/40 hover:border-amber-700/80", 
    textClass: "text-amber-600", 
    glowClass: "shadow-[0_0_20px_rgba(180,83,9,0.08)] bg-amber-950/5", 
    badgeBg: "bg-gradient-to-r from-amber-700 to-amber-600 text-white" 
  },
};

const TEAMS: Record<TeamCode, { name: string; fullName: string; color: string; bgClass: string; borderClass: string; textClass: string; gradient: string }> = {
  GEN: { name: "GEN", fullName: "Gen.G", color: "#AA8A35", bgClass: "bg-[#AA8A35]/10", borderClass: "border-[#AA8A35]/30", textClass: "text-[#d4af37]", gradient: "from-[#AA8A35]/15 to-[#AA8A35]/5" },
  T1: { name: "T1", fullName: "T1", color: "#E2012B", bgClass: "bg-[#E2012B]/10", borderClass: "border-[#E2012B]/30", textClass: "text-[#ff385c]", gradient: "from-[#E2012B]/15 to-[#E2012B]/5" },
  HLE: { name: "HLE", fullName: "Hanwha Life Esports", color: "#FF6B00", bgClass: "bg-[#FF6B00]/10", borderClass: "border-[#FF6B00]/30", textClass: "text-[#ff8c3a]", gradient: "from-[#FF6B00]/15 to-[#FF6B00]/5" },
  DK: { name: "DK", fullName: "Dplus KIA", color: "#00D2C4", bgClass: "bg-[#00D2C4]/10", borderClass: "border-[#00D2C4]/30", textClass: "text-[#2efceb]", gradient: "from-[#00D2C4]/15 to-[#00D2C4]/5" },
  KT: { name: "KT", fullName: "KT Rolster", color: "#ED1C24", bgClass: "bg-[#ED1C24]/10", borderClass: "border-[#ED1C24]/30", textClass: "text-[#ff474d]", gradient: "from-[#ED1C24]/15 to-[#ED1C24]/5" },
  FOX: { name: "FOX", fullName: "BNK FEARX", color: "#F7E600", bgClass: "bg-[#F7E600]/10", borderClass: "border-[#F7E600]/30", textClass: "text-[#f7e600]", gradient: "from-[#F7E600]/15 to-[#F7E600]/5" },
  NS: { name: "NS", fullName: "Nongshim RedForce", color: "#DE2F2F", bgClass: "bg-[#DE2F2F]/10", borderClass: "border-[#DE2F2F]/30", textClass: "text-[#ff5e5e]", gradient: "from-[#DE2F2F]/15 to-[#DE2F2F]/5" },
  DRX: { name: "DRX", fullName: "Kiwoom DRX", color: "#0090FF", bgClass: "bg-[#0090FF]/10", borderClass: "border-[#0090FF]/30", textClass: "text-[#3fa9ff]", gradient: "from-[#0090FF]/15 to-[#0090FF]/5" },
  BRO: { name: "BRO", fullName: "Hanjin BRION", color: "#007A3E", bgClass: "bg-[#007A3E]/10", borderClass: "border-[#007A3E]/30", textClass: "text-[#00b35b]", gradient: "from-[#007A3E]/15 to-[#007A3E]/5" },
  DNS: { name: "DNS", fullName: "DN SOOPers", color: "#00E3A5", bgClass: "bg-[#00E3A5]/10", borderClass: "border-[#00E3A5]/30", textClass: "text-[#1affc6]", gradient: "from-[#00E3A5]/15 to-[#00E3A5]/5" },
};

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  TOP: <Shield className="w-5 h-5" />,
  JUG: <Zap className="w-5 h-5" />,
  MID: <Sword className="w-5 h-5" />,
  ADC: <Crosshair className="w-5 h-5" />,
  SPT: <Heart className="w-5 h-5" />
};

export default function Home() {
  const [lang, setLang] = useState<Lang>("ko");
  const [players, setPlayers] = useState<Player[]>([]);
  const [allPro, setAllPro] = useState<Record<Tier, Record<Role, Player | null>>>({
    "1st": { TOP: null, JUG: null, MID: null, ADC: null, SPT: null },
    "2nd": { TOP: null, JUG: null, MID: null, ADC: null, SPT: null },
    "3rd": { TOP: null, JUG: null, MID: null, ADC: null, SPT: null },
  });
  
  const [mvp, setMvp] = useState<Player | null>(null);
  const [rookie, setRookie] = useState<Player | null>(null);
  const [activeSlot, setActiveSlot] = useState<{ tier: Tier; role: Role } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [teamFilter, setTeamFilter] = useState<TeamCode | "ALL">("ALL");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    // Language
    const savedLang = localStorage.getItem("lck-allpro-lang");
    if (savedLang === "en" || savedLang === "ko") {
      setLang(savedLang);
    }

    // Selections
    const savedAllPro = localStorage.getItem("lck-allpro-roster");
    if (savedAllPro) {
      try {
        setAllPro(JSON.parse(savedAllPro));
      } catch (e) {
        console.error(e);
      }
    }

    // MVP & Rookie
    const savedMvp = localStorage.getItem("lck-allpro-mvp");
    if (savedMvp) {
      try {
        setMvp(JSON.parse(savedMvp));
      } catch (e) {
        console.error(e);
      }
    }

    const savedRookie = localStorage.getItem("lck-allpro-rookie");
    if (savedRookie) {
      try {
        setRookie(JSON.parse(savedRookie));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    if (players.length > 0) {
      localStorage.setItem("lck-allpro-roster", JSON.stringify(allPro));
      localStorage.setItem("lck-allpro-mvp", mvp ? JSON.stringify(mvp) : "");
      localStorage.setItem("lck-allpro-rookie", rookie ? JSON.stringify(rookie) : "");
    }
  }, [allPro, mvp, rookie, players]);

  const toggleLang = () => {
    const next = lang === "en" ? "ko" : "en";
    setLang(next);
    localStorage.setItem("lck-allpro-lang", next);
  };

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    fetch("/data/players.json")
      .then((res) => res.json())
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Failed to load players", err));
  }, []);

  const getPlayerSelection = (playerId: string) => {
    for (const tier of TIERS) {
      for (const role of ROLES) {
        if (allPro[tier][role]?.id === playerId) {
          return { tier, role };
        }
      }
    }
    return null;
  };

  const handleSelectPlayer = (player: Player) => {
    if (!activeSlot) return;
    const { tier, role } = activeSlot;

    const existing = getPlayerSelection(player.id);

    setAllPro((prev) => {
      const updated = {
        "1st": { ...prev["1st"] },
        "2nd": { ...prev["2nd"] },
        "3rd": { ...prev["3rd"] }
      };

      if (existing) {
        updated[existing.tier][existing.role] = null;
      }

      updated[tier][role] = player;
      return updated;
    });

    setActiveSlot(null);
  };

  const handleRemovePlayer = (tier: Tier, role: Role) => {
    const playerToRemove = allPro[tier][role];
    if (!playerToRemove) return;

    if (mvp?.id === playerToRemove.id) setMvp(null);
    if (rookie?.id === playerToRemove.id) setRookie(null);

    setAllPro((prev) => ({
      ...prev,
      [tier]: {
        ...prev[tier],
        [role]: null,
      },
    }));
  };

  const handleReset = () => {
    setAllPro({
      "1st": { TOP: null, JUG: null, MID: null, ADC: null, SPT: null },
      "2nd": { TOP: null, JUG: null, MID: null, ADC: null, SPT: null },
      "3rd": { TOP: null, JUG: null, MID: null, ADC: null, SPT: null },
    });
    setMvp(null);
    setRookie(null);
    localStorage.removeItem("lck-allpro-roster");
    localStorage.removeItem("lck-allpro-mvp");
    localStorage.removeItem("lck-allpro-rookie");
    triggerToast(t.resetToast);
  };

  const selectedPlayersList = useMemo(() => {
    const list: Player[] = [];
    TIERS.forEach((tier) => {
      ROLES.forEach((role) => {
        const p = allPro[tier][role];
        if (p) list.push(p);
      });
    });
    return list;
  }, [allPro]);

  const eligibleRookies = useMemo(() => {
    return players.filter((p) => p.isRookie);
  }, [players]);

  const candidates = useMemo(() => {
    if (!activeSlot) return [];
    return players.filter((p) => {
      if (p.role !== activeSlot.role) return false;
      if (teamFilter !== "ALL" && p.team !== teamFilter) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [players, activeSlot, teamFilter, searchQuery]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCopyText = () => {
    let text = `${t.shareHeader}\n\n`;

    TIERS.forEach((tier) => {
      const tierLabel = t[tier === "1st" ? "firstTeam" : tier === "2nd" ? "secondTeam" : "thirdTeam"];
      text += `✨ ${tierLabel} ✨\n`;
      ROLES.forEach((role) => {
        const player = allPro[tier][role];
        text += `- ${role}: ${player ? `${player.name} (${player.team})` : t.emptySlot}\n`;
      });
      text += `\n`;
    });

    text += `${t.shareMvp.replace("{name}", mvp ? `${mvp.name} (${mvp.team})` : t.notSelected)}\n`;
    text += `${t.shareRookie.replace("{name}", rookie ? `${rookie.name} (${rookie.team})` : t.notSelected)}\n\n`;
    text += `${t.shareFooter}`;

    navigator.clipboard.writeText(text)
      .then(() => triggerToast(t.copySuccessToast))
      .catch(() => triggerToast(t.copyFailToast));
  };

  return (
    <>
      {/* Ambient Background Glows & Grid */}
      <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">
        {/* Tech Grid Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
        
        {/* Floating Nebula Orbs */}
        <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] bg-amber-500/10 rounded-full blur-[140px] animate-float-1"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[65vw] h-[65vw] bg-blue-600/15 rounded-full blur-[180px] animate-float-2"></div>
        <div className="absolute top-[35%] left-[25%] w-[45vw] h-[45vw] bg-purple-600/8 rounded-full blur-[130px] animate-float-3"></div>
        
        {/* Diagonal Tech Laser Beams */}
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-amber-500/10 to-transparent rotate-12 transform origin-top"></div>
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-blue-500/10 to-transparent rotate-12 transform origin-top"></div>
      </div>

      <main className="min-h-screen py-12 px-4 max-w-7xl mx-auto flex flex-col gap-10 font-outfit text-slate-100">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-50 bg-slate-900 border border-amber-500/40 text-amber-300 font-bold px-6 py-3.5 rounded-xl shadow-[0_10px_30px_rgba(245,158,11,0.2)] backdrop-blur-md flex items-center gap-3"
          >
            <Trophy className="w-5 h-5 text-amber-400 animate-bounce" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-center glass-panel p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -z-10 -translate-x-1/3 translate-y-1/3"></div>
        <div className="z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-black tracking-widest uppercase border border-amber-500/20 mb-4">
            <Trophy className="w-3.5 h-3.5" /> {t.officialBadge}
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight premium-gradient-text drop-shadow-sm mb-3">
            {t.title}
          </h1>
          <p className="text-slate-400 font-inter text-base max-w-xl">
            {t.description}
          </p>
        </div>

        {/* Global actions */}
        <div className="mt-8 md:mt-0 flex flex-wrap justify-center gap-3 z-10">
          <button 
            onClick={toggleLang}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <Globe className="w-4 h-4 text-amber-400 animate-pulse" /> {lang === "en" ? "한국어" : "English"}
          </button>
          <button 
            onClick={handleCopyText}
            className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:-translate-y-0.5"
          >
            <Share2 className="w-4 h-4 text-blue-400" /> {t.shareRoster}
          </button>
          <button 
            onClick={handleReset}
            className="px-4 py-3 bg-red-950/20 hover:bg-red-950/40 text-red-400 border border-red-900/30 hover:border-red-900/50 rounded-xl text-sm font-bold transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> {t.reset}
          </button>
        </div>
      </motion.header>

      {/* Roster Selection Board */}
      <section 
        className="glass-panel p-6 md:p-8 flex flex-col gap-8 border-slate-800/80 bg-slate-950/50 relative overflow-hidden"
      >
        {/* Subtle Watermark on Export */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none z-0">
          <Trophy className="w-[500px] h-[500px]" />
        </div>

        {TIERS.map((tier) => {
          const meta = TIER_METADATA[tier];
          const tierLabel = t[tier === "1st" ? "firstTeam" : tier === "2nd" ? "secondTeam" : "thirdTeam"];
          return (
            <div key={tier} className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-6 rounded-full" style={{ backgroundColor: meta.color }}></div>
                <h3 className={`text-lg font-black tracking-widest ${meta.textClass}`}>{tierLabel}</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {ROLES.map((role) => {
                  const player = allPro[tier][role];
                  const teamMeta = player ? TEAMS[player.team] : null;

                  return (
                    <div
                      key={role}
                      onClick={() => !player && setActiveSlot({ tier, role })}
                      className={`relative h-56 flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-300 ${
                        player 
                          ? `${teamMeta?.bgClass} backdrop-blur-sm cursor-default overflow-hidden group` 
                          : `border-dashed ${meta.borderClass} ${meta.glowClass} cursor-pointer hover:-translate-y-1`
                      }`}
                      style={player ? {
                        boxShadow: `0 0 20px ${teamMeta?.color}15`,
                        border: `1px solid ${teamMeta?.color}40`
                      } : {}}
                    >
                      {/* Background large role or team watermark */}
                      {player ? (
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 to-slate-950/80 -z-10"></div>
                      ) : (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800/20 w-24 h-24 flex items-center justify-center pointer-events-none">
                          {ROLE_ICONS[role]}
                        </div>
                      )}

                      {/* Header slot tags */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 z-10">
                        {ROLE_ICONS[role]} {role}
                      </div>

                      {player ? (
                        <div className="w-full h-full flex flex-col items-center justify-between pt-6 relative">
                          
                          {/* Remove button (displays on hover) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemovePlayer(tier, role);
                            }}
                            className="absolute -top-1 -right-1 p-1 bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border border-red-500/20 shadow-md z-20"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          {/* Team Name Watermark in card center */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800/15 text-5xl font-black select-none pointer-events-none">
                            {player.team}
                          </div>

                          {/* Player visual body */}
                          <div className="flex-1 flex flex-col items-center justify-center w-full py-4">
                            <h4 className="text-xl font-black text-white text-center w-full truncate px-1 leading-tight tracking-tight group-hover:text-amber-400 group-hover:scale-105 transition-all duration-300">
                              {player.name}
                            </h4>
                          </div>

                          {/* Player Info Badge */}
                          <div className="w-full flex justify-center mt-1">
                            <span className={`text-[10px] font-black px-3 py-1 rounded-md border tracking-wider uppercase ${teamMeta?.bgClass} ${teamMeta?.borderClass} ${teamMeta?.textClass}`}>
                              {player.team}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-500 pointer-events-none">
                          <Plus className="w-6 h-6 mb-2 text-slate-400 animate-pulse" />
                          <span className="text-xs font-black tracking-widest uppercase">{t.addPlayer} {role}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Special Awards Row (MVP and Rookie) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80 relative z-10">
          
          {/* Player of the Split (MVP) */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-black text-slate-400 tracking-wider uppercase">{t.mvpTitle}</h4>
            </div>
            
            <div className="relative">
              {mvp ? (
                <div className={`flex items-center justify-between p-4 rounded-xl border bg-slate-900/60 backdrop-blur-sm ${TEAMS[mvp.team].borderClass}`}>
                  <div className="flex items-center gap-4">
                    <div>
                      <h5 className="font-black text-lg text-white leading-none mb-1">{mvp.name}</h5>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${TEAMS[mvp.team].bgClass} ${TEAMS[mvp.team].borderClass} ${TEAMS[mvp.team].textClass}`}>
                          {mvp.team}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {mvp.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setMvp(null)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-red-500/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <select
                  disabled={selectedPlayersList.length === 0}
                  value=""
                  onChange={(e) => {
                    const selected = selectedPlayersList.find((p) => p.id === e.target.value);
                    if (selected) setMvp(selected);
                  }}
                  className={`w-full py-3.5 px-4 bg-slate-900 border rounded-xl outline-none text-slate-300 font-bold transition-all text-sm appearance-none cursor-pointer ${
                    selectedPlayersList.length === 0 
                      ? "border-slate-800 opacity-50 cursor-not-allowed" 
                      : "border-slate-700 focus:border-amber-500"
                  }`}
                >
                  <option value="" disabled>
                    {selectedPlayersList.length === 0 
                      ? t.selectMvpEmpty 
                      : t.selectMvpPrompt}
                  </option>
                  {selectedPlayersList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.team} - {p.role})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          {/* Rookie of the Split */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-4 h-4 text-blue-400 animate-pulse" />
              <h4 className="text-sm font-black text-slate-400 tracking-wider uppercase">{t.rookieTitle}</h4>
            </div>

            <div className="relative">
              {rookie ? (
                <div className={`flex items-center justify-between p-4 rounded-xl border bg-slate-900/60 backdrop-blur-sm ${TEAMS[rookie.team].borderClass}`}>
                  <div className="flex items-center gap-4">
                    <div>
                      <h5 className="font-black text-lg text-white leading-none mb-1">{rookie.name}</h5>
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${TEAMS[rookie.team].bgClass} ${TEAMS[rookie.team].borderClass} ${TEAMS[rookie.team].textClass}`}>
                          {rookie.team}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                          {rookie.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setRookie(null)}
                    className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors cursor-pointer border border-red-500/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <select
                  value=""
                  onChange={(e) => {
                    const selected = eligibleRookies.find((p) => p.id === e.target.value);
                    if (selected) setRookie(selected);
                  }}
                  className="w-full py-3.5 px-4 bg-slate-900 border border-slate-700 focus:border-blue-500 rounded-xl outline-none text-slate-300 font-bold transition-all text-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>{t.selectRookiePrompt}</option>
                  {eligibleRookies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.team} - {p.role})
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

        </div>

      </section>

      {/* Player Selection Drawer/Modal */}
      <AnimatePresence>
        {activeSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            
            {/* Click outside to close */}
            <div 
              className="absolute inset-0"
              onClick={() => setActiveSlot(null)}
            ></div>

            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-4xl glass-panel bg-slate-900 border-slate-800 text-slate-100 overflow-hidden flex flex-col max-h-[85vh] relative z-10"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
                <div>
                  <h3 className="text-xl font-black text-white flex items-center gap-2">
                    {t.modalTitle.replace("{role}", activeSlot.role)}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-black text-amber-500">
                    {t.modalSubtitle.replace("{tier}", t[activeSlot.tier === "1st" ? "firstTeam" : activeSlot.tier === "2nd" ? "secondTeam" : "thirdTeam"])}
                  </p>
                </div>
                <button
                  onClick={() => setActiveSlot(null)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filtering Controls */}
              <div className="p-5 border-b border-slate-800 bg-slate-900/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all text-sm font-medium"
                  />
                </div>

                {/* Team Filters */}
                <div className="flex flex-wrap gap-1.5 justify-center w-full sm:w-auto">
                  <button
                    onClick={() => setTeamFilter("ALL")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                      teamFilter === "ALL" 
                        ? "bg-amber-500 text-slate-950" 
                        : "bg-slate-800 text-slate-300 hover:bg-slate-750"
                    }`}
                  >
                    {t.allTeams}
                  </button>
                  {Object.keys(TEAMS).map((code) => (
                    <button
                      key={code}
                      onClick={() => setTeamFilter(code as TeamCode)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                        teamFilter === code 
                          ? `${TEAMS[code as TeamCode].bgClass} ${TEAMS[code as TeamCode].borderClass} ${TEAMS[code as TeamCode].textClass} border` 
                          : "bg-slate-800 text-slate-400 hover:bg-slate-750"
                      }`}
                    >
                      {code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Candidate Grid */}
              <div className="flex-1 overflow-y-auto p-6 bg-slate-950/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {candidates.map((player) => {
                    const selectedInfo = getPlayerSelection(player.id);
                    const isSelectedElsewhere = !!selectedInfo;
                    const isSelectedCurrent = selectedInfo?.tier === activeSlot.tier && selectedInfo?.role === activeSlot.role;
                    const teamMeta = TEAMS[player.team];

                    return (
                      <div
                        key={player.id}
                        onClick={() => !isSelectedCurrent && handleSelectPlayer(player)}
                        className={`p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer relative overflow-hidden group ${
                          isSelectedCurrent
                            ? "border-amber-500/50 bg-amber-500/5"
                            : isSelectedElsewhere
                            ? "border-slate-800 bg-slate-900/30 opacity-70 hover:opacity-100 hover:border-slate-700"
                            : "border-slate-800 bg-slate-900/60 hover:border-slate-600 hover:-translate-y-0.5 hover:shadow-lg"
                        }`}
                      >
                        {/* Team Accent Gradient on Hover */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${teamMeta.gradient} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none -z-10`}></div>

                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div>
                              <h4 className="font-black text-white text-base leading-none mb-1 group-hover:text-amber-400 transition-colors">
                                {player.name}
                              </h4>
                              <div className="flex items-center gap-1.5">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase ${teamMeta.bgClass} ${teamMeta.borderClass} ${teamMeta.textClass}`}>
                                  {player.team}
                                </span>
                                {player.isRookie && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 bg-blue-950 text-blue-300 border border-blue-900/40 rounded flex items-center gap-0.5">
                                    <Star className="w-2.5 h-2.5 fill-blue-400 text-blue-400" /> ROOKIE
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>


                        </div>

                        <div className="pt-3 border-t border-slate-800/60 flex items-center justify-end text-xs">
                          
                          {isSelectedCurrent ? (
                            <span className="text-amber-400 font-black flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> {t.currentSlot}
                            </span>
                          ) : isSelectedElsewhere ? (
                            <span className="text-blue-400 font-black flex items-center gap-1 group-hover:underline">
                              {t.moveFrom.replace("{tier}", t[selectedInfo?.tier === "1st" ? "firstTeam" : selectedInfo?.tier === "2nd" ? "secondTeam" : "thirdTeam"])}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-black group-hover:text-white flex items-center gap-1">
                              {t.select} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {candidates.length === 0 && (
                    <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                      <Search className="w-10 h-10 text-slate-700 mb-3" />
                      <div className="text-sm font-bold text-slate-400">{t.noCandidates}</div>
                      <div className="text-xs mt-1">{t.tryResetFilter}</div>
                    </div>
                  )}
                </div>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="text-center py-6 text-xs text-slate-500 flex flex-col gap-2">
        <div>
          {t.footerText}
        </div>
        <div className="flex items-center justify-center gap-3 mt-1">
          <a href="https://namu.wiki/w/League%20of%20Legends%20Champions%20Korea/%EC%B0%B8%EA%B0%80%ED%8C%80%20%EB%A1%9C%EC%8A%A4%ED%84%B0" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 font-bold">
            {t.rosterRef} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>

    </main>
  </>
  );
}
