"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { ArrowRight, Copy, RotateCcw, Send } from "lucide-react";
import { Button, Heading, Text } from "@/components/ui";
import {
  createGrowthAdvice,
  createProjectBrief,
  formatProjectBrief,
  type AiMessage,
  type ProjectCategory,
} from "@/lib/ai";
import { cn } from "@/lib/cn";

import { requestAiGuidance } from "@/app/(pages)/ai/actions";

const starters = [
  "Help me choose a service",
  "Scope a project",
  "How could AI help my business?",
  "Analyze my website",
  "Ask a question",
] as const;
const control =
  "border-border bg-surface text-text-primary focus-visible:ring-focus-ring min-h-11 w-full rounded-md border px-(--ds-space-md) py-(--ds-space-sm) outline-none focus-visible:ring-2";

export function AiWorkspace({
  analyzerEnabled,
}: {
  readonly analyzerEnabled: boolean;
}) {
  const [mode, setMode] = useState<"chat" | "scope" | "advisor" | "analyzer">(
    "chat",
  );
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [brief, setBrief] = useState("");
  const [advice, setAdvice] = useState("");

  function submitChat(formData: FormData) {
    const content = String(formData.get("message") ?? "").trim();
    if (!content) return;
    const next = [...messages, { role: "user" as const, content }].slice(-10);
    setMessages(next);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
    startTransition(async () => {
      const result = await requestAiGuidance(next);
      if (result.status === "success")
        setMessages((current) => [
          ...current,
          {
            role: "assistant",
            content:
              `${result.guidance.answer}\n\n${result.guidance.limitation ?? ""}\n\nNext step: ${result.guidance.nextStep}\nSources: ${result.guidance.sources.join(", ")}`.trim(),
          },
        ]);
      else setError(result.message);
    });
  }

  function createScope(formData: FormData) {
    const result = createProjectBrief({
      category: String(formData.get("category")) as ProjectCategory,
      businessType: String(formData.get("businessType")),
      problem: String(formData.get("problem")),
      outcome: String(formData.get("outcome")),
      users: String(formData.get("users")),
      integrations: String(formData.get("integrations")),
      contentReadiness: String(formData.get("contentReadiness")),
    });
    setBrief(formatProjectBrief(result));
  }

  function createAdvice(formData: FormData) {
    const result = createGrowthAdvice({
      challenge: String(formData.get("challenge")),
      repetitiveProcess: String(formData.get("repetitiveProcess")),
      websiteRole: String(formData.get("websiteRole")),
      priority: String(formData.get("priority")),
    });
    setAdvice(
      `${result.label}\n\nCurrent challenge: ${result.currentChallenge}\n\nPossible improvement: ${result.possibleImprovement}\n\nSuggested service: ${result.suggestedService}\nComplexity: ${result.complexity}\nDependencies: ${result.dependencies.join("; ") || "To be clarified"}\n\nNext step: ${result.nextStep}`,
    );
  }

  function handoff(summary: string) {
    sessionStorage.setItem(
      "vilet-ai-handoff",
      JSON.stringify({
        projectSummary: summary.slice(0, 2000),
        goals:
          "Review the preliminary discovery summary and clarify the appropriate next step.",
      }),
    );
  }

  return (
    <div className="border-border bg-card shadow-glow-soft overflow-hidden rounded-xl border">
      <div
        className="border-divider flex flex-wrap gap-2 border-b p-4"
        role="tablist"
        aria-label="Vilét AI tools"
      >
        {(
          [
            ["chat", "Consultant"],
            ["scope", "Project scope"],
            ["advisor", "Growth advisor"],
            ["analyzer", "Website analyzer"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={mode === id}
            onClick={() => setMode(id)}
            className={cn(
              "focus-visible:ring-focus-ring min-h-11 rounded-full px-4 text-sm focus-visible:ring-2",
              mode === id
                ? "bg-accent text-background"
                : "border-border text-text-secondary border",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="tablet:p-8 p-5">
        {mode === "chat" && (
          <div className="space-y-6">
            <div>
              <Heading level={2} variant="heading-3">
                Ask Vilét AI
              </Heading>
              <Text className="mt-2">
                AI-generated guidance based on Vilét’s published services and
                content.
              </Text>
            </div>
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2">
                {starters.map((starter) => (
                  <button
                    key={starter}
                    onClick={() => {
                      if (inputRef.current) {
                        inputRef.current.value = starter;
                        inputRef.current.focus();
                      }
                    }}
                    className="border-border hover:border-accent min-h-11 rounded-full border px-4 text-sm"
                  >
                    {starter}
                  </button>
                ))}
              </div>
            )}
            <ol
              className="max-h-[28rem] space-y-3 overflow-y-auto"
              aria-live="polite"
              aria-label="Conversation"
            >
              {messages.map((message, index) => (
                <li
                  key={`${index}-${message.role}`}
                  className={cn(
                    "max-w-[90%] rounded-lg p-4 whitespace-pre-wrap",
                    message.role === "user"
                      ? "bg-accent/15 ml-auto"
                      : "bg-surface border-border border",
                  )}
                >
                  {message.content}
                </li>
              ))}
            </ol>
            {error && (
              <div
                role="alert"
                className="border-danger/60 bg-danger/10 rounded-md border p-4"
              >
                {error}
              </div>
            )}
            <form action={submitChat} className="space-y-3">
              <label htmlFor="ai-message" className="font-medium">
                Your question
              </label>
              <textarea
                ref={inputRef}
                id="ai-message"
                name="message"
                required
                maxLength={2000}
                rows={3}
                className={control}
              />
              <Button
                type="submit"
                loading={isPending}
                loadingLabel="Vilét AI is preparing guidance"
                trailingIcon={<Send className="size-4" />}
              >
                Send question
              </Button>
            </form>
            <Button
              variant="ghost"
              leadingIcon={<RotateCcw className="size-4" />}
              onClick={() => {
                setMessages([]);
                setError("");
              }}
            >
              Clear conversation
            </Button>
          </div>
        )}
        {mode === "scope" && (
          <ToolForm
            title="Scope a project"
            description="Provide only project-relevant context. You can review and edit the resulting brief."
            action={createScope}
          >
            <Field label="Project category">
              <select
                name="category"
                className={control}
                required
                defaultValue="not-sure"
              >
                <option value="website">Website</option>
                <option value="website-redesign">Website redesign</option>
                <option value="automation">AI or business automation</option>
                <option value="custom-software">Custom software</option>
                <option value="ongoing-support">Ongoing support</option>
                <option value="not-sure">Not sure</option>
              </select>
            </Field>
            <Field label="Business or organization type">
              <input
                name="businessType"
                maxLength={160}
                required
                className={control}
              />
            </Field>
            <Field label="Main problem">
              <textarea
                name="problem"
                maxLength={1000}
                required
                className={control}
              />
            </Field>
            <Field label="Desired outcome">
              <textarea
                name="outcome"
                maxLength={1000}
                required
                className={control}
              />
            </Field>
            <Field label="Intended users (optional)">
              <input name="users" maxLength={300} className={control} />
            </Field>
            <Field label="Required integrations (optional)">
              <input name="integrations" maxLength={500} className={control} />
            </Field>
            <Field label="Content readiness (optional)">
              <input
                name="contentReadiness"
                maxLength={300}
                className={control}
              />
            </Field>
            <Button type="submit">Create preliminary brief</Button>
            {brief && <Result text={brief} onHandoff={() => handoff(brief)} />}
          </ToolForm>
        )}
        {mode === "advisor" && (
          <ToolForm
            title="Business growth advisor"
            description="Explore a practical improvement without assuming AI or custom software is necessary."
            action={createAdvice}
          >
            <Field label="Main operational challenge">
              <textarea
                name="challenge"
                maxLength={1000}
                required
                className={control}
              />
            </Field>
            <Field label="Repetitive process (optional)">
              <textarea
                name="repetitiveProcess"
                maxLength={800}
                className={control}
              />
            </Field>
            <Field label="Current website role">
              <input
                name="websiteRole"
                maxLength={500}
                required
                className={control}
              />
            </Field>
            <Field label="Priority outcome">
              <input
                name="priority"
                maxLength={500}
                required
                className={control}
              />
            </Field>
            <Button type="submit">Create preliminary recommendation</Button>
            {advice && (
              <Result text={advice} onHandoff={() => handoff(advice)} />
            )}
          </ToolForm>
        )}
        {mode === "analyzer" && (
          <div className="space-y-4">
            <Heading level={2} variant="heading-3">
              Website analyzer
            </Heading>
            <Text>
              {analyzerEnabled
                ? "Analyzer activation is configured, but every request still requires authorization confirmation and server-side safety validation."
                : "Website analysis is not active. Vilét will not fetch or analyze a submitted URL until owner, privacy, cost, and security approvals are complete."}
            </Text>
            <Text variant="body-sm">
              A future analysis will inspect only safely retrieved public HTML.
              It will not be a full accessibility, security, SEO, legal, mobile,
              or performance audit.
            </Text>
            <Link
              className="text-accent inline-flex min-h-11 items-center gap-2 underline"
              href="/contact"
            >
              Discuss a website review <ArrowRight className="size-4" />
            </Link>
          </div>
        )}
      </div>
      <div className="border-divider bg-surface border-t p-4">
        <Text variant="body-sm">
          Do not share passwords, payment details, health information,
          confidential client data, or other sensitive information. Final scope,
          pricing, timelines, and recommendations require human review.
        </Text>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="font-medium">{label}</span>
      {children}
    </label>
  );
}
function ToolForm({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action: (data: FormData) => void;
  children: React.ReactNode;
}) {
  return (
    <form action={action} className="space-y-5">
      <div>
        <Heading level={2} variant="heading-3">
          {title}
        </Heading>
        <Text className="mt-2">{description}</Text>
      </div>
      {children}
    </form>
  );
}
function Result({ text, onHandoff }: { text: string; onHandoff: () => void }) {
  return (
    <section
      aria-live="polite"
      className="border-accent/40 bg-accent/5 rounded-lg border p-5"
    >
      <Heading level={3} variant="heading-4">
        Your preliminary summary
      </Heading>
      <pre className="text-text-secondary mt-3 font-sans text-sm break-words whitespace-pre-wrap">
        {text}
      </pre>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          variant="secondary"
          leadingIcon={<Copy className="size-4" />}
          onClick={() => void navigator.clipboard.writeText(text)}
        >
          Copy summary
        </Button>
        <Link
          href="/contact"
          onClick={onHandoff}
          className="bg-accent text-background focus-visible:ring-focus-ring inline-flex min-h-11 items-center rounded-md px-4 font-medium focus-visible:ring-2"
        >
          Review in Contact
        </Link>
      </div>
    </section>
  );
}
