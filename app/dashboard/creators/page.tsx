"use client"

/**
 * Creator Search & Filtering  (Feature — 25%)
 * ---------------------------------------------------------------------------
 * Searchable creator catalog with filter facets for AI tool / model / skill /
 * platform, sorting, a workflow-verified-only mode and an empty state.
 * Verification UI is imported from components/creators/verification-signals.
 *
 * Route: /dashboard/creators
 */

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import {
  Creator,
  CreatorCard,
  Platform,
  VerificationLegend,
  PLATFORM_META,
  hasVerified,
  trustScore,
} from "@/components/creators/verification-signals"
import {
  Search,
  X,
  Filter,
  RotateCcw,
  Users,
  Sparkles,
  Eye,
  ShieldCheck,
  Zap,
  Bot,
  Wrench,
  Layers,
} from "lucide-react"

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

type SortKey = "followers" | "engagement" | "rating" | "verified"

/* -------------------------------------------------------------------------- */
/* Filter facet definition                                                     */
/* -------------------------------------------------------------------------- */

const FACETS = [
  { key: "tools", title: "AI Tool", icon: Wrench, options: ["ChatGPT", "Claude", "Midjourney", "Runway", "ElevenLabs", "Descript", "Canva AI", "Pika"] },
  { key: "models", title: "Model", icon: Bot, options: ["GPT-4o", "Claude 3.5 Sonnet", "SDXL", "Flux 1.1", "Llama 3.1", "Veo 2"] },
  { key: "skills", title: "Skill", icon: Sparkles, options: ["Short-form Video", "Copywriting", "Thumbnails", "Thread Writing", "Voiceover", "Meme Marketing", "Product Demos"] },
  { key: "platforms", title: "Platform", icon: Layers, options: ["instagram", "twitter", "linkedin", "facebook", "youtube"] },
] as const

const SORTS: { key: SortKey; label: string }[] = [
  { key: "followers", label: "Followers" },
  { key: "engagement", label: "Engagement" },
  { key: "rating", label: "Rating" },
  { key: "verified", label: "Most verified" },
]

/* -------------------------------------------------------------------------- */
/* Catalog data                                                                */
/* -------------------------------------------------------------------------- */

const CREATORS: Creator[] = [
  {
    id: "c1",
    name: "Aarav Mehta",
    handle: "@aaravcreates",
    niche: "Growth Marketing",
    bio: "Builds repeatable short-form growth loops for D2C brands.",
    initials: "AM",
    avatarGradient: "from-pink-500 to-rose-500",
    followers: 482000,
    engagement: 6.4,
    rating: 4.9,
    platforms: ["instagram", "twitter", "linkedin"],
    tools: ["ChatGPT", "Runway", "Canva AI"],
    models: ["GPT-4o", "Veo 2"],
    skills: ["Short-form Video", "Copywriting", "Thread Writing"],
    signals: [
      { id: "c1-i", type: "identity", label: "Identity verified", detail: "Gov ID + selfie match via UniPost KYC", status: "verified", verifiedAt: "12 Mar 2026", issuer: "UniPost Trust" },
      { id: "c1-t", type: "tool", label: "Verified: ChatGPT", detail: "Connected through official OAuth — 148 generations audited", status: "verified", verifiedAt: "02 Apr 2026", issuer: "UniPost ToolCheck" },
      { id: "c1-w", type: "workflow", label: "Workflow verified", detail: "7-step caption → edit → schedule pipeline reproduced", status: "verified", verifiedAt: "18 Apr 2026", issuer: "UniPost WorkflowAudit" },
      { id: "c1-a", type: "account", label: "3 social accounts", detail: "Instagram, Twitter and LinkedIn connected & token-checked", status: "verified" },
    ],
  },
  {
    id: "c2",
    name: "Sofia Lindqvist",
    handle: "@sofia.builds",
    niche: "AI Art Direction",
    bio: "Editorial-grade AI imagery for fashion and lifestyle campaigns.",
    initials: "SL",
    avatarGradient: "from-purple-500 to-indigo-500",
    followers: 268000,
    engagement: 8.1,
    rating: 4.8,
    platforms: ["instagram"],
    tools: ["Midjourney", "Canva AI"],
    models: ["SDXL", "Flux 1.1"],
    skills: ["Thumbnails", "Copywriting"],
    signals: [
      { id: "c2-i", type: "identity", label: "Identity verified", detail: "Gov ID + selfie match via UniPost KYC", status: "verified", verifiedAt: "27 Jan 2026", issuer: "UniPost Trust" },
      { id: "c2-t", type: "tool", label: "Verified: Midjourney", detail: "Discord bot sessions linked — 92 jobs audited", status: "verified", verifiedAt: "11 Mar 2026", issuer: "UniPost ToolCheck" },
      { id: "c2-w", type: "workflow", label: "Workflow verified", detail: "Prompt library → upscale → schedule pipeline", status: "pending", verifiedAt: "Review queued", issuer: "UniPost WorkflowAudit" },
      { id: "c2-a", type: "account", label: "1 social account", detail: "Instagram connected & token-checked", status: "verified" },
    ],
  },
  {
    id: "c3",
    name: "Daniel Okafor",
    handle: "@danwrites",
    niche: "B2B Thought Leadership",
    bio: "Turns founder interviews into high-signal LinkedIn posts.",
    initials: "DO",
    avatarGradient: "from-blue-500 to-cyan-500",
    followers: 121000,
    engagement: 5.2,
    rating: 4.7,
    platforms: ["linkedin", "twitter"],
    tools: ["Claude", "ChatGPT", "Descript"],
    models: ["Claude 3.5 Sonnet", "GPT-4o"],
    skills: ["Thread Writing", "Copywriting", "Voiceover"],
    signals: [
      { id: "c3-i", type: "identity", label: "Identity verified", detail: "Gov ID + selfie match via UniPost KYC", status: "verified", verifiedAt: "05 Feb 2026", issuer: "UniPost Trust" },
      { id: "c3-t", type: "tool", label: "Verified: Claude", detail: "API key scoped to UniPost — 210 generations audited", status: "verified", verifiedAt: "09 Apr 2026", issuer: "UniPost ToolCheck" },
      { id: "c3-t2", type: "tool", label: "Verified: Descript", detail: "Connected through official OAuth — 44 renders audited", status: "verified", verifiedAt: "09 Apr 2026", issuer: "UniPost ToolCheck" },
      { id: "c3-a", type: "account", label: "2 social accounts", detail: "LinkedIn and Twitter connected & token-checked", status: "verified" },
    ],
  },
  {
    id: "c4",
    name: "Mei Tanaka",
    handle: "@meimakes",
    niche: "Reels & Shorts",
    bio: "Vertical video editor shipping 30 reels a month for creators.",
    initials: "MT",
    avatarGradient: "from-teal-500 to-emerald-500",
    followers: 940000,
    engagement: 9.3,
    rating: 5.0,
    platforms: ["instagram", "youtube", "facebook"],
    tools: ["Runway", "ElevenLabs", "Descript"],
    models: ["Veo 2", "Llama 3.1"],
    skills: ["Short-form Video", "Voiceover", "Product Demos"],
    signals: [
      { id: "c4-i", type: "identity", label: "Identity verified", detail: "Gov ID + selfie match via UniPost KYC", status: "verified", verifiedAt: "30 Nov 2025", issuer: "UniPost Trust" },
      { id: "c4-t", type: "tool", label: "Verified: Runway", detail: "Connected through official OAuth — 310 renders audited", status: "verified", verifiedAt: "21 Feb 2026", issuer: "UniPost ToolCheck" },
      { id: "c4-t2", type: "tool", label: "Verified: ElevenLabs", detail: "API key scoped to UniPost — 76 voices audited", status: "verified", verifiedAt: "21 Feb 2026", issuer: "UniPost ToolCheck" },
      { id: "c4-w", type: "workflow", label: "Workflow verified", detail: "Batch edit → caption → 3-platform schedule reproduced", status: "verified", verifiedAt: "03 Mar 2026", issuer: "UniPost WorkflowAudit" },
      { id: "c4-a", type: "account", label: "3 social accounts", detail: "Instagram, YouTube and Facebook connected", status: "verified" },
    ],
  },
  {
    id: "c5",
    name: "Lucas Ferreira",
    handle: "@lucasposts",
    niche: "Meme Marketing",
    bio: "Runs meme pages that convert — culture-first brand content.",
    initials: "LF",
    avatarGradient: "from-amber-500 to-orange-500",
    followers: 67000,
    engagement: 11.7,
    rating: 4.4,
    platforms: ["instagram", "twitter", "facebook"],
    tools: ["ChatGPT", "Canva AI"],
    models: ["GPT-4o"],
    skills: ["Meme Marketing", "Copywriting"],
    signals: [
      { id: "c5-i", type: "identity", label: "Identity verified", detail: "Gov ID + selfie match via UniPost KYC", status: "verified", verifiedAt: "18 Dec 2025", issuer: "UniPost Trust" },
      { id: "c5-a", type: "account", label: "3 social accounts", detail: "Instagram, Twitter and Facebook connected", status: "verified" },
      { id: "c5-t", type: "tool", label: "Verified: ChatGPT", detail: "Awaiting OAuth re-link to audit generations", status: "pending", verifiedAt: "Review queued", issuer: "UniPost ToolCheck" },
      { id: "c5-w", type: "workflow", label: "Workflow verified", detail: "No workflow documentation submitted yet", status: "unverified" },
    ],
  },
  {
    id: "c6",
    name: "Priya Raghavan",
    handle: "@priya.scales",
    niche: "Product-Led Content",
    bio: "Ships launch narratives and comparison pages that rank.",
    initials: "PR",
    avatarGradient: "from-violet-500 to-fuchsia-500",
    followers: 203000,
    engagement: 4.9,
    rating: 4.8,
    platforms: ["linkedin", "twitter", "youtube"],
    tools: ["Claude"],
    models: ["Claude 3.5 Sonnet"],
    skills: ["Copywriting", "Thread Writing", "Product Demos"],
    signals: [
      { id: "c6-i", type: "identity", label: "Identity verified", detail: "Gov ID + selfie match via UniPost KYC", status: "verified", verifiedAt: "07 Mar 2026", issuer: "UniPost Trust" },
      { id: "c6-t", type: "tool", label: "Verified: Claude", detail: "API key scoped to UniPost — 188 generations audited", status: "verified", verifiedAt: "25 Mar 2026", issuer: "UniPost ToolCheck" },
      { id: "c6-w", type: "workflow", label: "Workflow verified", detail: "Research → draft → human-edit → schedule reproduced", status: "verified", verifiedAt: "02 Apr 2026", issuer: "UniPost WorkflowAudit" },
      { id: "c6-a", type: "account", label: "3 social accounts", detail: "LinkedIn, Twitter and YouTube connected", status: "verified" },
    ],
  },
  {
    id: "c7",
    name: "Noah Becker",
    handle: "@noahbecker",
    niche: "Podcast Clips",
    bio: "Repurposes long-form podcasts into platform-native clips.",
    initials: "NB",
    avatarGradient: "from-rose-500 to-red-500",
    followers: 145000,
    engagement: 7.6,
    rating: 4.6,
    platforms: ["youtube", "instagram"],
    tools: ["Descript", "Pika"],
    models: ["Llama 3.1", "Veo 2"],
    skills: ["Short-form Video", "Voiceover"],
    signals: [
      { id: "c7-i", type: "identity", label: "Identity verified", detail: "Gov ID + selfie match via UniPost KYC", status: "verified", verifiedAt: "22 Oct 2025", issuer: "UniPost Trust" },
      { id: "c7-t", type: "tool", label: "Verified: Descript", detail: "Connected through official OAuth — 120 renders audited", status: "verified", verifiedAt: "14 Jan 2026", issuer: "UniPost ToolCheck" },
      { id: "c7-w", type: "workflow", label: "Workflow verified", detail: "Transcript → clip → auto-caption pipeline reproduced", status: "pending", verifiedAt: "Review queued", issuer: "UniPost WorkflowAudit" },
      { id: "c7-a", type: "account", label: "2 social accounts", detail: "YouTube and Instagram connected", status: "verified" },
    ],
  },
  {
    id: "c8",
    name: "Hannah Weiss",
    handle: "@hannahpixels",
    niche: "Thumbnail Design",
    bio: "A/B-tested thumbnails for education and finance channels.",
    initials: "HW",
    avatarGradient: "from-cyan-500 to-blue-500",
    followers: 58000,
    engagement: 6.8,
    rating: 4.5,
    platforms: ["youtube"],
    tools: ["Midjourney", "Canva AI"],
    models: ["Flux 1.1", "SDXL"],
    skills: ["Thumbnails"],
    signals: [
      { id: "c8-i", type: "identity", label: "Identity verified", detail: "Gov ID + selfie match via UniPost KYC", status: "unverified" },
      { id: "c8-t", type: "tool", label: "Verified: Midjourney", detail: "Discord bot sessions linked — 61 jobs audited", status: "verified", verifiedAt: "19 Feb 2026", issuer: "UniPost ToolCheck" },
      { id: "c8-a", type: "account", label: "1 social account", detail: "YouTube connected & token-checked", status: "verified" },
    ],
  },
  {
    id: "c9",
    name: "Kwame Asante",
    handle: "@kwamedrops",
    niche: "Music & Culture",
    bio: "Artist campaigns, release-day content and fan community ops.",
    initials: "KA",
    avatarGradient: "from-green-500 to-emerald-500",
    followers: 331000,
    engagement: 10.2,
    rating: 4.9,
    platforms: ["instagram", "twitter", "youtube", "facebook"],
    tools: ["ElevenLabs", "Runway", "ChatGPT"],
    models: ["GPT-4o", "Veo 2"],
    skills: ["Voiceover", "Short-form Video", "Meme Marketing"],
    signals: [
      { id: "c9-i", type: "identity", label: "Identity verified", detail: "Gov ID + selfie match via UniPost KYC", status: "verified", verifiedAt: "03 Sep 2025", issuer: "UniPost Trust" },
      { id: "c9-t", type: "tool", label: "Verified: ElevenLabs", detail: "API key scoped to UniPost — 58 voices audited", status: "verified", verifiedAt: "30 Jan 2026", issuer: "UniPost ToolCheck" },
      { id: "c9-t2", type: "tool", label: "Verified: Runway", detail: "Connected through official OAuth — 204 renders audited", status: "verified", verifiedAt: "30 Jan 2026", issuer: "UniPost ToolCheck" },
      { id: "c9-w", type: "workflow", label: "Workflow verified", detail: "Concept → generate → review → 4-platform schedule", status: "verified", verifiedAt: "12 Feb 2026", issuer: "UniPost WorkflowAudit" },
      { id: "c9-a", type: "account", label: "4 social accounts", detail: "Instagram, Twitter, YouTube and Facebook connected", status: "verified" },
    ],
  },
  {
    id: "c10",
    name: "Elena Rossi",
    handle: "@elenacoaches",
    niche: "Career Coaching",
    bio: "Carousel-first career advice for early-career professionals.",
    initials: "ER",
    avatarGradient: "from-fuchsia-500 to-purple-500",
    followers: 89000,
    engagement: 5.7,
    rating: 4.3,
    platforms: ["linkedin", "instagram"],
    tools: ["ChatGPT", "Canva AI"],
    models: ["GPT-4o", "Llama 3.1"],
    skills: ["Copywriting", "Thumbnails"],
    signals: [
      { id: "c10-i", type: "identity", label: "Identity verified", detail: "KYC submission not started", status: "unverified" },
      { id: "c10-t", type: "tool", label: "Verified: ChatGPT", detail: "No official connection recorded", status: "unverified" },
      { id: "c10-w", type: "workflow", label: "Workflow verified", detail: "No workflow documentation submitted yet", status: "unverified" },
      { id: "c10-a", type: "account", label: "2 social accounts", detail: "LinkedIn and Instagram connected", status: "verified" },
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* Facet chip                                                                  */
/* -------------------------------------------------------------------------- */

function FacetChip({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-all",
        active
          ? "border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan glow-cyan"
          : "border-white/10 bg-white/5 text-muted-foreground hover:border-white/25 hover:text-foreground"
      )}
    >
      {children}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Page                                                                        */
/* -------------------------------------------------------------------------- */

export default function CreatorsPage() {
  const [query, setQuery] = useState("")
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({
    tools: [],
    models: [],
    skills: [],
    platforms: [],
  })
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>("followers")

  const toggleFilter = (facet: string, value: string) => {
    setActiveFilters((prev) => {
      const current = prev[facet] ?? []
      return {
        ...prev,
        [facet]: current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
      }
    })
  }

  const clearAll = () => {
    setQuery("")
    setActiveFilters({ tools: [], models: [], skills: [], platforms: [] })
    setVerifiedOnly(false)
  }

  const activeCount =
    Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0) +
    (query.trim() ? 1 : 0) +
    (verifiedOnly ? 1 : 0)

  /* ---- Search + multi-facet filtering + sorting ---- */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = CREATORS.filter((creator) => {
      if (q) {
        const haystack = [
          creator.name,
          creator.handle,
          creator.niche,
          creator.bio,
          ...creator.tools,
          ...creator.models,
          ...creator.skills,
          ...creator.platforms,
        ]
          .join(" ")
          .toLowerCase()
        if (!haystack.includes(q)) return false
      }

      const { tools, models, skills, platforms } = activeFilters
      if (tools.length && !tools.some((t) => creator.tools.includes(t))) return false
      if (models.length && !models.some((m) => creator.models.includes(m))) return false
      if (skills.length && !skills.some((s) => creator.skills.includes(s))) return false
      if (platforms.length && !platforms.some((p) => creator.platforms.includes(p as Platform))) return false
      if (verifiedOnly && !hasVerified(creator, "workflow")) return false

      return true
    })

    return filtered.sort((a, b) => {
      if (sort === "followers") return b.followers - a.followers
      if (sort === "engagement") return b.engagement - a.engagement
      if (sort === "rating") return b.rating - a.rating
      return trustScore(b) - trustScore(a)
    })
  }, [query, activeFilters, verifiedOnly, sort])

  const verifiedCount = CREATORS.filter((c) => trustScore(c) >= 85).length

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Users className="h-6 w-6 text-neon-cyan" /> Creator Directory
          </h1>
          <p className="text-sm text-muted-foreground">
            Search the catalog, filter by AI tool, model and skill, and hire creators with verified tool + workflow signals.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5">
            <Eye className="h-3.5 w-3.5 text-neon-cyan" /> {CREATORS.length} creators
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-neon-green/40 bg-neon-green/10 px-3 py-1.5 text-neon-green">
            <ShieldCheck className="h-3.5 w-3.5" /> {verifiedCount} verified
          </span>
          <span className="flex items-center gap-1.5 rounded-lg border border-neon-purple/40 bg-neon-purple/10 px-3 py-1.5 text-neon-purple">
            <Zap className="h-3.5 w-3.5" /> {CREATORS.filter((c) => c.tools.length > 0).length} AI-tool linked
          </span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* ---------------- Filter sidebar ---------------- */}
        <aside className="h-fit space-y-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <Filter className="h-4 w-4 text-neon-cyan" /> Filters
            </h2>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-neon-pink"
              >
                <RotateCcw className="h-3.5 w-3.5" /> Clear ({activeCount})
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search creators, tools, skills…"
              aria-label="Search creators"
              className="pl-9 pr-9"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Facet groups: tool / model / skill / platform */}
          {FACETS.map((facet) => (
            <div key={facet.key}>
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                <facet.icon className="h-3.5 w-3.5" /> {facet.title}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {facet.options.map((option) => (
                  <FacetChip
                    key={option}
                    active={(activeFilters[facet.key] ?? []).includes(option)}
                    onClick={() => toggleFilter(facet.key, option)}
                  >
                    {facet.key === "platforms" ? PLATFORM_META[option as Platform].label : option}
                  </FacetChip>
                ))}
              </div>
            </div>
          ))}

          {/* Verified-only toggle */}
          <div className="flex items-center justify-between rounded-lg border border-neon-green/30 bg-neon-green/5 p-3">
            <Label htmlFor="verified-only" className="flex cursor-pointer items-center gap-2 text-xs font-medium">
              <ShieldCheck className="h-4 w-4 text-neon-green" />
              Workflow-verified only
            </Label>
            <Switch id="verified-only" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
          </div>
        </aside>

        {/* ---------------- Results ---------------- */}
        <section className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{results.length}</span> of {CREATORS.length} creators
              {query.trim() && (
                <>
                  {" "}
                  matching <span className="text-neon-cyan">“{query.trim()}”</span>
                </>
              )}
            </p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Sort</span>
              {SORTS.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setSort(option.key)}
                  className={cn(
                    "rounded-md border px-2.5 py-1 text-xs font-medium transition-all",
                    sort === option.key
                      ? "border-neon-cyan/60 bg-neon-cyan/15 text-neon-cyan"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {results.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] py-16 text-center">
              <Search className="h-8 w-8 text-white/20" />
              <p className="text-sm font-medium">No creators match your filters</p>
              <p className="max-w-sm text-xs text-muted-foreground">
                Try removing a tool, model or skill filter — or switch off “Workflow-verified only”.
              </p>
              <Button variant="outline" size="sm" onClick={clearAll}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reset filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {results.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          )}

          <VerificationLegend />
        </section>
      </div>
    </div>
  )
}
