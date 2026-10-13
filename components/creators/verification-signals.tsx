"use client"

/**
 * Creator Verification Signals  (Bonus feature — 5%)
 * ---------------------------------------------------------------------------
 * Standalone component file. Goes beyond "connected social accounts exist" by
 * rendering AI-tool and workflow verification badges, per-signal states
 * (verified / pending / unverified), a 0–100 trust score and a legend.
 *
 * Exports:
 *   types      Platform, VerificationType, VerificationStatus,
 *              VerificationSignal, Creator
 *   helpers    trustScore(), verificationTier(), hasVerified(), verifiedTools()
 *   ui         VerificationBadge, CreatorCard, VerificationLegend
 *   meta       PLATFORM_META, SIGNAL_META
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  BadgeCheck,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  Circle,
  Clock,
  Bot,
  Wrench,
  Layers,
  Users,
  Star,
  Award,
  Crown,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
} from "lucide-react"

/* -------------------------------------------------------------------------- */
/* Types                                                                       */
/* -------------------------------------------------------------------------- */

export type Platform = "instagram" | "twitter" | "linkedin" | "facebook" | "youtube"

export type VerificationType = "identity" | "tool" | "workflow" | "account"
export type VerificationStatus = "verified" | "pending" | "unverified"

export type VerificationSignal = {
  id: string
  type: VerificationType
  label: string
  detail: string
  status: VerificationStatus
  verifiedAt?: string
  issuer?: string
}

export type Creator = {
  id: string
  name: string
  handle: string
  niche: string
  bio: string
  initials: string
  avatarGradient: string
  followers: number
  engagement: number
  rating: number
  platforms: Platform[]
  tools: string[]
  models: string[]
  skills: string[]
  signals: VerificationSignal[]
}

export const PLATFORM_META: Record<Platform, { label: string; icon: typeof Instagram; color: string }> = {
  instagram: { label: "Instagram", icon: Instagram, color: "text-pink-400" },
  twitter: { label: "Twitter / X", icon: Twitter, color: "text-sky-300" },
  linkedin: { label: "LinkedIn", icon: Linkedin, color: "text-blue-400" },
  facebook: { label: "Facebook", icon: Facebook, color: "text-blue-500" },
  youtube: { label: "YouTube", icon: Youtube, color: "text-red-400" },
}

export const SIGNAL_META: Record<
  VerificationType,
  { icon: typeof Bot; label: string; accent: string }
> = {
  identity: { icon: BadgeCheck, label: "Identity", accent: "text-neon-cyan border-neon-cyan/40 bg-neon-cyan/10" },
  tool: { icon: Wrench, label: "AI Tool", accent: "text-neon-purple border-neon-purple/40 bg-neon-purple/10" },
  workflow: { icon: Layers, label: "Workflow", accent: "text-neon-green border-neon-green/40 bg-neon-green/10" },
  account: { icon: CheckCircle2, label: "Account", accent: "text-neon-blue border-neon-blue/40 bg-neon-blue/10" },
}

/* -------------------------------------------------------------------------- */
/* Scoring helpers                                                             */
/* -------------------------------------------------------------------------- */

/** 0–100 trust score derived from the creator's verification signals. */
export function trustScore(creator: Creator): number {
  const weights: Record<VerificationType, number> = { identity: 25, tool: 30, workflow: 30, account: 15 }
  let score = 0
  for (const signal of creator.signals) {
    if (signal.status === "verified") score += weights[signal.type]
    else if (signal.status === "pending") score += weights[signal.type] * 0.4
  }
  return Math.min(100, Math.round(score))
}

export function verificationTier(score: number): { label: string; className: string } {
  if (score >= 85) return { label: "Verified Creator", className: "text-neon-green border-neon-green/50 bg-neon-green/10 glow-cyan" }
  if (score >= 55) return { label: "Partially Verified", className: "text-neon-yellow border-neon-yellow/40 bg-neon-yellow/10" }
  return { label: "Unverified", className: "text-muted-foreground border-white/15 bg-white/5" }
}

export function hasVerified(creator: Creator, type?: VerificationType): boolean {
  return creator.signals.some((s) => s.status === "verified" && (!type || s.type === type))
}

export function verifiedTools(creator: Creator): string[] {
  return creator.signals
    .filter((s) => s.type === "tool" && s.status === "verified")
    .map((s) => s.label.replace("Verified: ", ""))
}

/* -------------------------------------------------------------------------- */
/* Single verification badge                                                   */
/* -------------------------------------------------------------------------- */

export function VerificationBadge({ signal }: { signal: VerificationSignal }) {
  const meta = SIGNAL_META[signal.type]
  const Icon = signal.status === "verified" ? meta.icon : signal.status === "pending" ? Clock : Circle

  if (signal.status === "unverified") {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2">
        <Circle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-white/25" />
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-muted-foreground">{meta.label} not verified</p>
          <p className="truncate text-[11px] text-white/25">{signal.detail}</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-lg border px-2.5 py-2 transition-all",
        signal.status === "verified" ? meta.accent : "border-neon-yellow/40 bg-neon-yellow/10 text-neon-yellow"
      )}
      title={signal.issuer ? `Issued by ${signal.issuer}${signal.verifiedAt ? ` · ${signal.verifiedAt}` : ""}` : signal.detail}
    >
      <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", signal.status === "pending" && "animate-pulse")} />
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold">{signal.label}</p>
        <p className="truncate text-[11px] opacity-70">
          {signal.status === "pending" ? "Verification in progress" : signal.detail}
        </p>
        {signal.status === "verified" && signal.verifiedAt && (
          <p className="mt-0.5 flex items-center gap-1 text-[10px] uppercase tracking-wide opacity-60">
            <ShieldCheck className="h-3 w-3" /> {signal.issuer} · {signal.verifiedAt}
          </p>
        )}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Creator card (stats + connected accounts + verification signals)            */
/* -------------------------------------------------------------------------- */

export function CreatorCard({ creator }: { creator: Creator }) {
  const score = trustScore(creator)
  const tier = verificationTier(score)
  const vTools = verifiedTools(creator)
  const connectedAccounts = creator.signals.find((s) => s.type === "account")

  return (
    <Card className="glass-card relative flex flex-col gap-0 overflow-hidden transition-all hover:border-neon-cyan/40 hover:shadow-glow-cyan">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent" />

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white", creator.avatarGradient)}>
            {creator.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <CardTitle className="truncate text-base">{creator.name}</CardTitle>
              {hasVerified(creator, "identity") && <BadgeCheck className="h-4 w-4 shrink-0 text-neon-cyan" aria-label="Identity verified" />}
            </div>
            <CardDescription className="truncate">
              {creator.handle} · {creator.niche}
            </CardDescription>
          </div>
          <div className="shrink-0 text-right">
            <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", tier.className)}>
              {tier.label}
            </span>
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{creator.bio}</p>

        {/* Trust meter — verification score derived from signals */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
            <div
              className={cn("h-full rounded-full transition-all", score >= 85 ? "bg-neon-green" : score >= 55 ? "bg-neon-yellow" : "bg-white/30")}
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" /> {score}/100
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] py-2">
            <p className="text-sm font-semibold text-neon-cyan">
              {creator.followers >= 1000 ? `${(creator.followers / 1000).toFixed(0)}K` : creator.followers}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Followers</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] py-2">
            <p className="text-sm font-semibold text-neon-green">{creator.engagement}%</p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Engage.</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] py-2">
            <p className="flex items-center justify-center gap-1 text-sm font-semibold text-neon-yellow">
              <Star className="h-3 w-3 fill-current" /> {creator.rating}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Rating</p>
          </div>
        </div>

        {/* Connected social accounts */}
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <Users className="h-3.5 w-3.5" /> Connected accounts
            {connectedAccounts?.status === "verified" && <CheckCircle2 className="h-3.5 w-3.5 text-neon-green" />}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {creator.platforms.map((p) => {
              const meta = PLATFORM_META[p]
              const Icon = meta.icon
              return (
                <span key={p} className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-foreground/80">
                  <Icon className={cn("h-3.5 w-3.5", meta.color)} /> {meta.label}
                  <CheckCircle2 className="h-3 w-3 text-neon-green" aria-label="Connected" />
                </span>
              )
            })}
          </div>
        </div>

        {/* Verification signals — AI tool + workflow badges */}
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            <ShieldAlert className="h-3.5 w-3.5" /> Verification signals
            <span className="ml-auto font-normal normal-case tracking-normal">
              {creator.signals.filter((s) => s.status === "verified").length}/{creator.signals.length} verified
            </span>
          </p>
          <div className="flex flex-col gap-1.5">
            {creator.signals.map((signal) => (
              <VerificationBadge key={signal.id} signal={signal} />
            ))}
          </div>
        </div>

        {/* Capability chips — tools get a badge when that tool is verified */}
        <div className="mt-auto space-y-2 border-t border-white/10 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {creator.tools.map((tool) => (
              <span key={tool} className="flex items-center gap-1 rounded-md border border-neon-purple/30 bg-neon-purple/10 px-2 py-0.5 text-[11px] text-neon-purple">
                <Wrench className="h-3 w-3" /> {tool}
                {vTools.includes(tool) && <BadgeCheck className="h-3 w-3" aria-label="Tool verified" />}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {creator.models.map((model) => (
              <span key={model} className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground">
                <Bot className="h-3 w-3" /> {model}
              </span>
            ))}
            {creator.skills.map((skill) => (
              <span key={skill} className="rounded-md border border-neon-cyan/25 bg-neon-cyan/10 px-2 py-0.5 text-[11px] text-neon-cyan">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Legend — explains every signal type                                         */
/* -------------------------------------------------------------------------- */

export function VerificationLegend() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Award className="h-4 w-4 text-neon-yellow" /> How verification signals work
      </p>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {(["identity", "tool", "workflow", "account"] as VerificationType[]).map((type) => {
          const meta = SIGNAL_META[type]
          const Icon = meta.icon
          return (
            <div key={type} className={cn("rounded-lg border px-3 py-2", meta.accent)}>
              <p className="flex items-center gap-1.5 text-xs font-semibold">
                <Icon className="h-3.5 w-3.5" /> {meta.label}
              </p>
              <p className="mt-0.5 text-[11px] opacity-70">
                {type === "identity" && "Government ID + selfie match on file."}
                {type === "tool" && "AI tool linked officially and its usage audited."}
                {type === "workflow" && "End-to-end AI workflow reproduced and approved."}
                {type === "account" && "Social accounts connected with live tokens."}
              </p>
            </div>
          )
        })}
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
        <Crown className="h-3.5 w-3.5 text-neon-cyan" /> Trust score = identity 25 + AI tool 30 + workflow 30 + connected accounts 15.
        Scores of 85+ are shown as “Verified Creator”.
      </p>
    </div>
  )
}
