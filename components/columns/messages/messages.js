import './messages.css';
import useStore from '@/stores/editor';
import { onUserAction } from '@/stores/actions/game';
import { setDiceBox, clearRoll } from '@/stores/actions/dice';
import Message from './message';

import { useRef, useEffect } from 'react';

function Messages() {
  const scrollContainer = useRef(null);

  const messages = useStore((state) => state.messages);

  const diceBoxRef = useRef(null);
  const rolling = useStore((state) => state.rolling);
  const lastRoll = useStore((state) => state.lastRoll);

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
      top: scrollContainer.current?.scrollHeight - scrollContainer.current?.offsetHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    console.log('[messages]', messages);
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-full !flex-1 relative -mx-4">
      <div ref={scrollContainer} className="message-container px-4">
        <div className="flex flex-col gap-6">
          {messages?.map((message) => <Message message={message} key={message.id} />)}
        </div>
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
    </div>
  );
}

export default Messages;
