// import { CinnamonRollIcon, DeadIcon, NextIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";

function parseMarkdown(content) {
  const reg = /\*\*(.+?)\*\*/g;
  // search for **bold** pattern and replace it with <strong>bold</strong>
  return { __html: content.replaceAll(reg, "<strong>$1</strong>") };
}

if (typeof String.prototype.parseFunction != "function") {
  String.prototype.parseFunction = function () {
    var funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gim;
    var match = funcReg.exec(this.replace(/\n/g, " "));

    if (match) {
      return new Function(match[1].split(","), match[2]);
    }

    return null;
  };
}

export default function MessageContent({ content, props, onSend }) {
  function callFunction(params) {
    let functionName = null;
    let args = [];

    if (typeof params === "string" || params instanceof String) {
      functionName = params;
    } else if (params.constructor === Array && params.length > 0) {
      functionName = params[0];
      if (params.length > 1) {
        args = params.slice(1);
      }
    }

    // console.log(params);
    // console.log(params);

    switch (functionName) {
      case "send":
        onSend({ data: args });
        break;
      default:
        // console.log("props", props.properties);
        // const [name, difficulty, label] = args;
        const funcProp = props.properties.find(
          (prop) => prop.name === functionName,
        );

        if (!funcProp) {
          console.warn("Function not found:", functionName);
          return;
        }
        // console.log("funcProp", funcProp.value);
        const func = funcProp.value.parseFunction();
        const res = func(...args);

        if (res.update) {
        }

        if (res.send) {
          onSend({ data: res.send });
        }
        break;
    }
  }

  function parse(content, key, extra) {
    switch (content.type) {
      case "md":
        if (extra && extra.click) {
          return (
            <li
              key={key}
              className="cursor-pointer p-2 bg-rs-background-1 rounded-xl"
              onClick={() => callFunction([...extra.click, content])}
              dangerouslySetInnerHTML={parseMarkdown(content.value)}
            />
          );
        }
        return (
          <li
            key={key}
            dangerouslySetInnerHTML={parseMarkdown(content.value)}
          />
        );
      case "pm":
        return (
          <li
            key={key}
            className="text-rs-text-secondary"
            dangerouslySetInnerHTML={parseMarkdown(content.value)}
          />
        );
      case "btn":
        return (
          <li
            key={key}
            className="flex flex-row items-center bg-rs-background-1
            rounded-xl p-2 cursor-pointer"
            onClick={() => callFunction([...content.click, content.label])}
          >
            {content.label}
          </li>
        );
      case "list":
        return (
          <ul key={key} className="flex flex-col gap-2">
            {content.items.map((v, i) => parse(v, i, { click: content.click }))}
          </ul>
        );
    }
  }
  const [parsed, setParsed] = useState(null);

  useEffect(() => {
    try {
      setParsed(JSON.parse(content));
    } catch (e) {
      // console.log(e.message);
      setParsed({ narration: content });
    }
  }, [content]);

  if (parsed && parsed.data && parsed.data.map) {
    // console.log(parsed.data);
    return (
      <ul className="flex flex-col gap-2">
        {parsed.data.map((item, index) => {
          return parse(item, index);
        })}
      </ul>
    );
  }

  return null;
}
