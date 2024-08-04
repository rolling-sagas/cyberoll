import { CinnamonRollIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

function SkillCheck({ name, difficulty }) {
  return (
    <span className="inline-flex flex-row items-center gap-1 mx-1">
      [
      <span>
        <CinnamonRollIcon size={15} />
      </span>
      <span className="capitalize font-semibold">
        {name.split("_").join(" ")}
      </span>
      ]
    </span>
  );
}

function parse(content) {
  const reg = /\*\*(.+?)\*\*/g;
  // search for **bold** pattern and replace it with <strong>bold</strong>
  return { __html: content.replaceAll(reg, "<strong>$1</strong>") };
}

export default function MessageContent({
  content,
  onChoiceSelect,
  actionNeeded,
}) {
  const [parsed, setParsed] = useState(null);

  useEffect(() => {
    try {
      setParsed(JSON.parse(content));
    } catch (e) {
      console.log(e.message);
      setParsed({ narration: content });
    }
  }, [content]);

  if (parsed) {
    return (
      <div>
        {parsed.narration && (
          <div
            className={`rounded-xl p-2 -ml-2 
              ${parsed.skill ? "bg-rs-background-hover cursor-pointer" : ""}`}
            onClick={() => {
              if (parsed.skill && onChoiceSelect) {
                onChoiceSelect(parsed);
              }
            }}
          >
            {parsed.skill && <SkillCheck name={parsed.skill.name} />}
            <span dangerouslySetInnerHTML={parse(parsed.narration)} />
          </div>
        )}

        {parsed.user && <span dangerouslySetInnerHTML={parse(parsed.user)} />}

        {parsed.choices && (
          <ul className="flex flex-col gap-2 my-2 items-start">
            <li className="font-semibold">Make your choice</li>
            {parsed.choices.length > 0 &&
              parsed.choices.map((c, i) => (
                <li
                  className="flex flex-row"
                  key={i}
                  onClick={() => {
                    if (onChoiceSelect) {
                      onChoiceSelect(c);
                    }
                  }}
                >
                  <div
                    className={`bg-rs-background-hover rounded-xl 
                              p-2 -ml-2 cursor-pointer`}
                  >
                    {c.skill && <SkillCheck name={c.skill.name} />}
                    {c.content}
                  </div>
                </li>
              ))}
          </ul>
        )}

        {actionNeeded && !parsed.choices && !parsed.skill && (
          <div
            className="bg-rs-background-hover rounded-xl 
            p-2 -ml-2 cursor-pointer w-fit"
            onClick={() => {
              if (onChoiceSelect) {
                onChoiceSelect({ content: "Continue." });
              }
            }}
          >
            Continue
          </div>
        )}
      </div>
    );
  }

  return null;
}
