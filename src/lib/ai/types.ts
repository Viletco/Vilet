export type AiSource = "Services" | "Process" | "FAQ" | "Contact" | "About";

export interface AiMessage {
  readonly role: "user" | "assistant";
  readonly content: string;
}

export interface AiGuidance {
  readonly answer: string;
  readonly relevantService?: string | null;
  readonly limitation?: string | null;
  readonly nextStep: string;
  readonly sources: readonly AiSource[];
}

export type AiResult =
  | { readonly status: "success"; readonly guidance: AiGuidance }
  | {
      readonly status:
        | "configuration-unavailable"
        | "rate-limited"
        | "timeout"
        | "provider-unavailable"
        | "unsafe-request"
        | "validation-failure"
        | "unexpected-failure";
      readonly message: string;
    };

export interface AiProvider {
  readonly type: "openai";
  generate(input: {
    readonly messages: readonly AiMessage[];
    readonly knowledge: string;
    readonly policy: string;
  }): Promise<AiResult>;
}
