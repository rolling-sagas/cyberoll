'use-client';

import { nanoid } from 'nanoid';
import MarkdownView from './views/markdown-view';
import InputTextView from './views/input-text-view';
import InputSelectView from './views/input-select-view';
import InputRollView from './views/input-roll-view';
import ButtonView from './views/button-view';
import { onUserAction } from '@/stores/actions/game';

export default function MessageContent({ content }) {
  return (
    <div className="message-content">
      {typeof content === 'object' ? (
        <div className="views">
          {content.views?.map((view) => {
            const key = nanoid();
            switch (view.type) {
              case 'md':
                return <MarkdownView view={view} key={key} id={key} />;
              case 'input.text':
                return (
                  <InputTextView
                    view={view}
                    key={key}
                    onClick={(inputState) => {
                      onUserAction({
                        name: 'submit',
                        params: { name: view.name, value: inputState },
                      });
                    }}
                  />
                );
              case 'input.select':
                return (
                  <InputSelectView
                    view={view}
                    key={key}
                    onClick={(opt) => {
                      onUserAction({
                        name: 'submit',
                        params: { name: view.name, value: opt },
                      });
                    }}
                  />
                );
              case 'input.roll':
                return <InputRollView view={view} key={key} />;
              case 'btn':
                return (
                  <ButtonView
                    view={view}
                    key={key}
                    onClick={() =>
                      onUserAction({
                        name: view.action,
                        params: view.params,
                      })
                    }
                  />
                );
            }
          })}
        </div>
      ) : (
        <p className="plain-text">{content}</p>
      )}
    </div>
  );
}
