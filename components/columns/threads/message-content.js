import { useEffect, useState } from "react";
import Image from "next/image";
import { getImageUrlById } from "@/components/images/utils";
import { ArrayToKeyValue } from "./message-item";

function parseMarkdown(content) {
  const reg = /\*\*(.+?)\*\*/g;
  // search for **bold** pattern and replace it with <strong>bold</strong>
  return { __html: content.replaceAll(reg, "<strong>$1</strong>") };
}

if (typeof String.prototype.parseFunction != "function") {
  String.prototype.parseFunction = function() {
    var funcReg = /function *\(([^()]*)\)[ \n\t]*{(.*)}/gim;
    var match = funcReg.exec(this.replace(/\n/g, " "));

    if (match) {
      return new Function(match[1].split(","), match[2]);
    }

    return null;
  };
}

export default function MessageContent({ content, props, onSend, onCall }) {

  function callFunction(functionName, content) {
    switch (functionName) {
      case "send":
        onSend({ data: [content] });
        break;
      default:
        // console.log("props", props.properties);
        // const [name, difficulty, label] = args;
        const funcProp = props.find(
          (prop) => prop.name === functionName && prop.type === "func",
        );

        if (!funcProp) {
          console.warn("Function not found:", functionName);
          return;
        }

        onCall(functionName, content)
        // console.log("funcProp", funcProp.value);
        // const func = funcProp.value.parseFunction();

        // const res = func(content, ArrayToKeyValue(props));

        //if (res.send) {
        //  onSend({ data: res.send, update: res.update });
        //}
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
              onClick={() => callFunction(extra.click, content)}
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
      case "img":
        const prop = props.find((prop) => prop.name === content.value)
        if (prop) {
          const obj = JSON.parse(prop.value)
          return (
            <li key={key}>
              <Image src={getImageUrlById(obj.id)}
                width={720}
                height={360}
                className="w-full h-full rounded-xl"
                alt={obj.desc}
              />
            </li>
          )
        }
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
            onClick={() => callFunction(content.click, content)}
          >
            {content.label}
          </li>
        );
      case "list":
        return (
          <ul key={key} className="flex flex-col gap-2">
            {content.items.map((v, i) =>
              parse(v, key + "-" + i, { click: content.click }))}
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
