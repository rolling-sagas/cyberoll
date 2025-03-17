import { useRef, useEffect, useState } from 'react';
import Script from 'next/script';

import { useThemeStore } from '@/components/tailwind/store';

const Editor = ({ code = '', lang = 'javascript', onChange, onError, readOnly = false, onClick = () => {} }) => {
  const theme = useThemeStore((state) => state.theme);
  const editorRef = useRef(null);
  const aceEditorRef = useRef(null);
  const [aceInited, setAceInited] = useState(false)

  useEffect(() => {
    aceEditorRef.current?.session.setMode(`ace/mode/${lang}`);
  }, [lang]);

	const codeChangeHandle = () => {
    const editor = aceEditorRef.current;
		if (!editor) return;
		const session = editor.session;

		if (code !== session.getValue()) {
			const cursorPosition = editor.getCursorPosition();

			// Check if the session is empty
			if (session.getValue().trim() === "") {
				// For empty session, simply setValue to make it the initial history
				session.setValue(code, -1);
			} else {
				// For non-empty session, use replace with undo groups
				session.markUndoGroup();
				session.doc.replace(
					{
						start: { row: 0, column: 0 },
						end: {
							row: session.doc.getAllLines().length - 1,
							column: session.doc.getLine(session.doc.getAllLines().length - 1)
								.length,
						},
					},
					code,
				);
				session.markUndoGroup();
			}

			editor.moveCursorToPosition(cursorPosition);
			editor.renderer.scrollCursorIntoView();
		}
	}

  useEffect(codeChangeHandle, [code]);

	useEffect(() => {
		
	}, [code]);

  useEffect(() => {
    aceEditorRef.current?.setTheme(
      theme === 'dark'
        ? 'ace/theme/github_dark'
        : 'ace/theme/github_light_default'
    );
  }, [theme]);

  useEffect(() => {
    aceEditorRef.current?.setReadOnly(readOnly);
  }, [readOnly]);

	const onAce = () => {
    if (aceInited) return
    setAceInited(true)
		const ace = window.ace;
		ace.config.set(
			'basePath',
			'https://cdn.jsdelivr.net/npm/ace-builds@1.39.0/src-min-noconflict'
		);
		aceEditorRef.current = ace.edit(editorRef.current);
    const editor = aceEditorRef.current;
    // Editor options
    editor.setOptions({
      tabSize: 2,
      fontSize: 12,
      showGutter: true,
      highlightActiveLine: true,
      wrap: false, // Word wrap
      showPrintMargin: false,
    });

		editor.setTheme(
      theme === 'dark'
        ? 'ace/theme/github_dark'
        : 'ace/theme/github_light_default'
    );

    editor.renderer.setPadding(4);
    editor.renderer.setScrollMargin(4);
		editor.setReadOnly(readOnly);
		editor.session.setMode(`ace/mode/${lang}`);
		codeChangeHandle()
		editor.session.on('change', () => {
      onChange?.(editor.session.getValue());
    });

    editor.session.on('changeAnnotation', () => {
      onError?.(editor.session.getAnnotations());
    });
	}

  useEffect(() => {
    if (window.ace) {
      onAce();
    }
  }, [])

  return (
    <>
			<Script onLoad={onAce} src="https://cdn.jsdelivr.net/npm/ace-builds@1.39.0/src-min-noconflict/ace.js"/>
      <div onClick={onClick} ref={editorRef} className="w-full h-full min-h-80" />
    </>
  );
};

export default Editor;
