import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';

export default function CodeEditor({ value, onChange, lang }) {
  if (lang === "js") {
    return <CodeMirror value={value}
      extensions={[javascript()]}
      onChange={onChange} />;
  }

  if (lang === "json") {
    return <CodeMirror value={value}
      extensions={[json()]}
      onChange={onChange} />;
  }

  return <CodeMirror value={value}
    extensions={[]}
    onChange={onChange} />;
}
