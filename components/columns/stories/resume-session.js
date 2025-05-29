'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useState } from 'react';

export default function ResumeSession({ story, onCancel, onStart }) {
  const [sessId, setSessId] = useState(story.storySessions[0].id);

  return (
    <div className="rounded-2xl bg-background pb-6">
      <div className="border-b-1 h-14 flex items-center justify-between">
        <span className="ml-6 cursor-pointer" onClick={onCancel}>
          Cancel
        </span>
        <strong className="text-center">Resume or Restart</strong>
        <span className="mr-6 opacity-0">Cancel</span>
      </div>
      <RadioGroup
        value={sessId}
        className="px-6 my-6 gap-3 max-h-96 overflow-y-auto"
        onValueChange={setSessId}
      >
        {story.storySessions.map((s, i) => (
          <div className="flex items-center space-x-2" key={s.id}>
            <RadioGroupItem value={s.id} id={s.id} />
            <Label htmlFor={s.id} className="cursor-pointer">
              Saved {i + 1}: Last played: {new Date(s.updatedAt).toDateString()}
            </Label>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <RadioGroupItem value={story.id} id={story.id} />
          <Label htmlFor={story.id} className="cursor-pointer">
            Start a new game
          </Label>
        </div>
      </RadioGroup>
      <div className="mx-6">
        <Button className="rounded-xl w-full" onClick={() => onStart(sessId)}>
          Start
        </Button>
      </div>
    </div>
  );
}
