import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { useThemeStore } from "@/components/tailwind/store";
import { useState, useEffect } from 'react';

export default function CodeEditor({ value, onChange, lang }) {
  const theme = useThemeStore((state) => state.theme);
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDark(true);
    } else {
      setIsDark(false);
    }
  }, [theme]);

  if (lang === "js") {
    return <CodeMirror value={value}
      extensions={[javascript()]}
      className="rounded-md"
      onChange={onChange}
      basicSetup={onChange !== undefined ? true : { lineNumbers: false, foldGutter: false }}
      editable={onChange !== undefined}
      theme={isDark ? "dark" : "light"}
    />;
  }

  if (lang === "json") {
    return <CodeMirror value={value}
      extensions={[json()]}
      className="rounded-md"
      basicSetup={onChange !== undefined ? true : { lineNumbers: false, foldGutter: false }}
      onChange={onChange}
      editable={onChange !== undefined}
      theme={isDark ? "dark" : "light"}
    />
  }

  return <CodeMirror value={value}
    extensions={[]}
    onChange={onChange}
    basicSetup={onChange !== undefined ? true : { lineNumbers: false, foldGutter: false }}
    editable={onChange !== undefined}
    theme={isDark ? "dark" : "light"}
  />;
}
