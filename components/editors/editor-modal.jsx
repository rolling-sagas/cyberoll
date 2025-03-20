import { useState, useRef, useEffect } from 'react';

import CodeEditor from './editor';
import { Button } from '@/app/components/ui/button';

import { useMemo, useCallback } from 'react';

import { useAlertStore } from '@/components/modal/alert-placeholder';
import Alert from '@/components/modal/alert';
import { useModalStore } from '@/components/modal/dialog-placeholder';
import { js } from 'js-beautify';

// import Script from 'next/script';

export default function EditorModal({
  value = '',
  title = '',
  lang = 'javascript',
	onSave = () => {},
	titleReadOnly = false,
	langList = ['toml'],
}) {
  const openAlert = useAlertStore((state) => state.open);

  const closeModal = useModalStore((state) => state.close);
  const inputRef = useRef();

  const [content, setContent] = useState(value);
  const [name, setName] = useState(title);
  const [errors, setErrors] = useState([]);

  const canSave = useMemo(() => {
    return (
      name.trim().length > 0 &&
      content.trim().length > 0 &&
      errors.filter((err) => err.type === 'error').length === 0
    );
  });

  const onFormat = useCallback(async () => {
    let formatted;
    switch (lang) {
      // case 'toml':
      //   formatted = await prettier.format(content, {
      //     parser: 'toml',
      //     plugins: [parserToml],
      //   });
      //   setContent(formatted);
      //   break;
      case 'javascript':
        formatted = js(content, {
          indent_size: 2,
        }).trim();
        setContent(formatted);
        break;
      default:
        break;
    }
  }, [lang, content]);

  function save() {
    try {
			onSave(content);
    } catch (e) {
      openAlert(
        <Alert title="Can't save" message={e.message} confirmLabel="OK" />
      );
    }
  }

  useEffect(() => {
    if (!content) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [inputRef.current]);

  return (
    <div
      className="flex flex-col max-w-[640px] min-w-[420px] w-full max-h-[calc(100%-24px)] h-full rs-bg-primary rounded-3xl border bg-background"
      onClick={(evt) => evt.stopPropagation()}
    >
      <div className="w-full h-[60px] border-b-[0.5px] grid grid-cols-[minmax(64px,100px)_minmax(0,1fr)_minmax(64px,100px)] content-center">
        <button
          className="justify-self-start w-full h-full"
          onClick={closeModal}
        >
          <div className="flex items-center justify-start ml-5 text-[17px] font-[400]">
            Close
          </div>
        </button>
        <div className="font-semibold justify-self-center w-full">
          <input
						readOnly={titleReadOnly}
            ref={inputRef}
            type="text"
            className="w-full text-center outline-none font-[16px]"
            value={name}
            onClick={(evt) => evt.target.select()}
            onChange={(evt) => setName(evt.target.value)}
          />
        </div>
        <button className="justify-self-start w-full h-full" onClick={onFormat}>
          <div className="flex items-center justify-start ml-5 text-[17px] font-[400]">
            Format
          </div>
        </button>
      </div>
      <div className="flex-grow">
        <CodeEditor
          lang={lang}
          code={content}
          onChange={setContent}
          onError={setErrors}
        />
      </div>
      <div className="flex items-center p-6">
        <div className="flex-grow">
          <span className="text-gray-500">{lang}</span>
        </div>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={save}
          disabled={!canSave}
        >
          Save
        </Button>
      </div>
      {/* <Script src="https://cdn.jsdelivr.net/npm/prettier@3.5.3" />
				<Script src="https://cdn.jsdelivr.net/npm/prettier@3.5.3/plugins/babel.js" />
				<Script src="https://cdn.jsdelivr.net/npm/prettier@3.5.3/plugins/estree.js" /> */}
      {/* <Script src="https://cdn.jsdelivr.net/npm/prettier-plugin-toml@2.0.2" /> */}
    </div>
  );
}
