import type { FaqRecord } from "@/content";
import { Disclosure } from "./disclosure";

export function FaqList({ items }: { readonly items: readonly FaqRecord[] }) {
  return (
    <div>
      {items.map((item) => {
        if (item.answer.format === "rich-text")
          throw new Error(`FAQ ${item.id} needs a rich-text renderer.`);
        return (
          <Disclosure
            key={item.id}
            id={`answer-${item.id}`}
            question={item.question}
          >
            {item.answer.value}
          </Disclosure>
        );
      })}
    </div>
  );
}
