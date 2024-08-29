import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { useThemeStore } from "@/components/tailwind/store";
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import { tokyoNightDay } from '@uiw/codemirror-theme-tokyo-night-day';
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
      onChange={onChange}
      theme={isDark ? tokyoNight : tokyoNightDay}
    />;
  }

  if (lang === "json") {
    return <CodeMirror value={value}
      extensions={[json()]}
      onChange={onChange}
      theme={isDark ? tokyoNight : tokyoNightDay}
    />
  }

  return <CodeMirror value={value}
    extensions={[]}
    onChange={onChange}
    theme={isDark ? tokyoNight : tokyoNightDay}
  />;
}
