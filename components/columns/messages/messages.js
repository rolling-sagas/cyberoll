import './messages.css';
import useStore from '@/stores/editor';
import { onUserAction } from '@/stores/actions/game';
import { setDiceBox, clearRoll } from '@/stores/actions/dice';
import Message from './message';
import { MESSAGE_STATUS } from '@/utils/const';
import CircleIconButton from '@/components/buttons/circle-icon-button';
import { ArrowDown01Icon } from '@hugeicons/react';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';

function Messages() {
  const scrollContainer = useRef(null);

  const messages = useStore((state) => state.messages);

  const diceBoxRef = useRef(null);
  const rolling = useStore((state) => state.rolling);
  const lastRoll = useStore((state) => state.lastRoll);
  const playMode = useStore((state) => state.playMode);
  const bottomRef = useRef(null);
  const [showGoBottom, setShowGoBottom] = useState(false);

  const renderMessages = useMemo(
    () => (playMode ? messages.filter((m) => m.role !== 'system') : messages),
    [messages, playMode]
  );

  const [dividers, setDividers] = useState([]);
  const [minHeight, setMinHeight] = useState(0);

  useEffect(() => {
    if (diceBoxRef.current) {
      const canvas = diceBoxRef.current.getElementsByTagName('canvas');
      if (canvas.length === 0) {
        console.log('refreshed...', diceBoxRef.current);
        setDiceBox(diceBoxRef.current);
      }
    }
  }, [diceBoxRef.current]);

  const scrollToBottom = () => {
    scrollContainer.current?.scrollTo({
      top:
        scrollContainer.current?.scrollHeight -
        scrollContainer.current?.offsetHeight,
      left: 0,
      behavior: 'smooth',
    });
  };

  const scrollHandler = useCallback(() => {
    dividers.forEach((header, index) => {
      if (dividers[index + 1]) {
        const nextHeaderTop =
          dividers[index + 1].getBoundingClientRect().top -
          scrollContainer.current.getBoundingClientRect().top;
        const headerHeight = header.clientHeight;
        if (nextHeaderTop <= headerHeight) {
          header.style.top = `${nextHeaderTop - headerHeight - 1}px`;
        } else {
          header.style.top = '0';
        }
      }
    });
    const container = scrollContainer.current
    if (container) {
      if (container.scrollTop + container.offsetHeight + 300 < container.scrollHeight ) {
        setShowGoBottom(true);
      } else {
        setShowGoBottom(false);
      }
    }
  }, [scrollContainer, dividers]);

  useEffect(() => {
    const container = scrollContainer.current;
    if (container) {
      container.addEventListener('scroll', scrollHandler);
      return () => container.removeEventListener('scroll', scrollHandler);
    }
  }, [scrollContainer, scrollHandler]);

  const calcMinHeight = useCallback(
    (messages = [], dividers = []) => {
      const lastMessage = messages[messages.length - 1];
      const hasDivider = dividers.length && lastMessage?.role !== 'divider';
      let minHeight = scrollContainer.current?.offsetHeight;
      if (hasDivider) {
        minHeight -= dividers[dividers.length - 1]?.offsetHeight || 0;
      }
      const messageEles = document.querySelectorAll('.message-item');
      if (
        messageEles[messageEles.length - 2] !== dividers[dividers.length - 1]
      ) {
        minHeight -= messageEles[messageEles.length - 2]?.offsetHeight || 0;
      }
      setMinHeight(minHeight);
      if (
        lastMessage?.status === MESSAGE_STATUS.generating &&
        lastMessage.content === 'Generating...'
      ) {
        setTimeout(scrollToBottom, 0);
      }
    },
    [scrollContainer]
  );

  useEffect(() => {
    console.log('[messages]', renderMessages);
    const dividers = document.querySelectorAll('.divider');
    setDividers(dividers);
    calcMinHeight(renderMessages, dividers);
  }, [renderMessages]);

  useEffect(() => {
    setTimeout(scrollToBottom, 0);
  }, [bottomRef]);

  return (
    <div className="h-full !flex-1 relative -mx-6">
      <div ref={scrollContainer} className="message-container">
        <div className="flex flex-col">
          {renderMessages?.map((message, i) => (
            <Message
              message={message}
              key={message.id}
              style={
                i === renderMessages?.length - 1 && message.role !== 'divider'
                  ? { minHeight }
                  : null
              }
            />
          ))}
        </div>
        {renderMessages?.length ? (
          <div ref={bottomRef} className="hidden"></div>
        ) : null}
      </div>
      <div
        ref={diceBoxRef}
        id="dice-box"
        className={`dice-box ${rolling > 0 ? 'active' : ''}`}
        onClick={async () => {
          if (rolling === 2) {
            await clearRoll();
            onUserAction({ name: 'roll', params: lastRoll });
          }
        }}
      >
        {lastRoll?.value && (
          <div className="roll-result">
            <div className="number">{lastRoll.value}</div>
          </div>
        )}
      </div>
      <CircleIconButton
        onClick={scrollToBottom}
        className={`absolute bottom-2 left-1/2 h-7 w-7 -ml-3.5 z-2 ${showGoBottom ? '' : 'hidden'}`}
        icon={<ArrowDown01Icon size={20} />}
      />
    </div>
  );
}

export default Messages;
