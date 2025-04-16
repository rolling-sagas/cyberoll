'use client';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-toml';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.min.css';
import './script-editor.css';

export default function ScriptEditor({
  code = '',
  onChange = () => {},
  lang = 'js',
  className = '',
}) {
  return (
    <div
      className={`w-full overflow-auto border border-gray-200 rounded h-1 flex-auto ${className} min-h-32`}
    >
      <div className="w-full h-full">
        <Editor.default
          value={code}
          onValueChange={onChange}
          highlight={(code) =>
            highlight(code, languages[lang], lang)
              .split('\n')
              .map((line) => `<span class="editor-line-number">${line}</span>`)
              .join('\n')
          }
          padding={10}
          textareaClassName="outline-none"
          className="editor"
          placeholder="Type your code here..."
        />
      </div>
    </div>
  );
}
