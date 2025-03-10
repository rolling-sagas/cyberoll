'use client';

import Picker from 'emoji-picker-react';
import { useState, useRef } from 'react';
import { SmileIcon } from '@hugeicons/react';
import { Textarea } from '@/components/ui/textarea';
import { createComment } from '@/service/comment';
import Spinner from '../spinner';

export default function AddComments({ sid, onAdd }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);

  const onEmojiClick = (emojiData, _) => {
    setComment(comment + emojiData.emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const toggleShowEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!comment || loading) return;
      try {
        setLoading(true)
        await createComment({
          storyId: sid,
          content: comment,
        });
        setComment('')
        onAdd()
      } finally {
        setLoading(false)
      }
    }
  };

  return (
    <div className="relative mx-6 my-4">
      <Picker
        className="!absolute left-0 top-4 -translate-y-full"
        open={showEmojiPicker}
        onEmojiClick={onEmojiClick}
      />
      <div className="flex items-center gap-1">
        <SmileIcon size={24} onClick={toggleShowEmojiPicker} />
        <Textarea
          ref={textareaRef}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {
        loading ? <Spinner className="absolute top-1/2 -translate-y-1/2 left-0" /> : null
      }
    </div>
  );
}
