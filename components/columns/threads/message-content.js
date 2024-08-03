import { CinnamonRollIcon } from "@hugeicons/react";
import { useEffect } from "react";

export default function MessageContent({ content, raw = false }) {
  if (raw) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  try {
    const parsed = JSON.parse(content);

    return (
      <div className="flex flex-col w-full">
        {parsed.narration && (
          <div className="whitespace-pre-wrap">{parsed.narration}</div>
        )}

        <ul className="flex flex-col gap-2 mt-4 items-end">
          {parsed.choices && (
            <li className="font-semibold">Make your choice</li>
          )}
          {parsed.choices &&
            parsed.choices.length > 0 &&
            parsed.choices.map((c, i) => (
              <li className="flex flex-row" key={i}>
                {c.skill && (
                  <div
                    className="flex flex-row items-center gap-1 border
                  p-2 rounded-l-xl flex-1"
                  >
                    <CinnamonRollIcon size={24} className="min-w-6 min-h-6" />
                    <span className="text-rs-text-tertiary capitalize whitespace-nowrap">
                      {c.skill.name.split("_").join(" ")}
                    </span>
                  </div>
                )}
                <div
                  className={`bg-rs-background-hover flex flex-row-reverse 
                w-fit rounded-r-xl p-2 
                border-y border-r ${c.skill ? "" : "border-l rounded-l-xl"}`}
                >
                  {c.content}
                </div>
              </li>
            ))}
        </ul>
      </div>
    );
  } catch (e) {
    console.error(e);
  }
}
