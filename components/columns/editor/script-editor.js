'use client';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.min.css';

export default function ScriptEditor({ code, onChange, lang }) {
  return (
    <div className="w-full overflow-auto border border-gray-200 rounded h-1 flex-1">
      <div className="w-full h-full">
        <Editor.default
          value={code}
          onValueChange={onChange}
          highlight={(code) => highlight(code, languages[lang])}
          padding={10}
          textareaClassName="outline-none"
        />
      </div>
    </div>
  );
}
