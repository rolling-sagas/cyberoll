'use-client';

import { onUserAction } from '@/stores/actions/game';
import { msgViewType } from '@/utils/message';
import { getImageUrlByName } from '@/utils/utils';
import ButtonView from './views/button-view';
import ImageView from './views/image-view';
import InputMultiSelectView from './views/input-multi-select-view';
import InputRollView from './views/input-roll-view';
import InputSelectView from './views/input-select-view';
import InputTextView from './views/input-text-view';
import MarkdownView from './views/markdown-view';

export default function MessageContent({
  content,
  components,
  playMode = true,
}) {
  try {
    // 如果 content 是字符串，直接渲染
    if (typeof content === 'string') {
      return (
        <div className="message-content">
          <p>{content}</p>
        </div>
      );
    }

    // 如果 content 是对象且包含 views 属性
    if (
      content &&
      typeof content === 'object' &&
      Array.isArray(content.views)
    ) {
      return (
        <div className="message-content">
          <div className="views">
            {content.views.map((view, key) => {
              try {
                if (!view || !view.type) {
                  console.error('Invalid view object:', view);
                  return null;
                }

                switch (view.type) {
                  case msgViewType.md:
                    return (
                      <MarkdownView
                        playMode={playMode}
                        view={view}
                        key={key}
                        id={key}
                      />
                    );
                  case msgViewType.input.text:
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
                  case msgViewType.input.select:
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
                  case msgViewType.input.multiSelect:
                    return (
                      <InputMultiSelectView
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
                  case msgViewType.input.roll:
                    return <InputRollView view={view} key={key} />;
                  case msgViewType.img:
                    return (
                      <ImageView
                        url={getImageUrlByName(view.name, components)}
                        key={key}
                        name={view.name}
                      />
                    );
                  case msgViewType.btn:
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
                  default:
                    console.error('Unknown view type:', view.type);
                    return null;
                }
              } catch (viewError) {
                console.error(
                  'Error rendering view:',
                  viewError,
                  'View:',
                  view
                );
                return null;
              }
            })}
          </div>
        </div>
      );
    }

    // 如果 content 是其他类型，转换为字符串显示
    console.warn('Unexpected content type:', typeof content);
    return (
      <div className="message-content">
        <p>{String(content)}</p>
      </div>
    );
  } catch (error) {
    console.error('Error in MessageContent:', error);
    return (
      <div className="message-content text-red-500">
        <p>Error rendering message content</p>
      </div>
    );
  }
}
