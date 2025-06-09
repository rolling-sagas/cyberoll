'use-client';
import { Button } from '@/app/components/ui/button';
import CheckboxView from '@/components/columns/messages/checkbox';
import { useEffect, useState } from 'react';

const viewExample = {
  type: 'input.multiSelect',
  name: 'player_skills',
  label: 'Select two skills that define your expertise as a Scientist:',
  select: 2,
  options: [
    { value: 'biology', label: 'Biology' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'physics', label: 'Physics' },
    { value: 'geology', label: 'Geology' },
  ],
};

// TODO: implement this view
export default function InputMultiSelectView({ view, onClick }) {
  const [selectedValues, setSelectedValues] = useState([]);

  useEffect(() => {
    console.log({ selectedValues });
    console.log({ view });
  }, [selectedValues]);

  const toggleValue = (val) => {
    console.log(val);
    setSelectedValues((prev) => {
      if (prev.includes(val)) {
        return prev.filter((v) => v !== val);
      } else if (!view.select || prev.length < view.select) {
        return [...prev, val];
      }
      return prev;
    });
  };

  const isSubmitDisabled = view.select
    ? selectedValues.length < view.select
    : false;

  return (
    <div className="action-view">
      {view.label ? <div className="mb-4">{view.label}</div> : null}
      <div className="flex flex-col gap-4">
        {view.options?.map((opt, idx) => (
          <CheckboxView
            key={idx}
            label={opt.label}
            checked={selectedValues.includes(opt.value)}
            onChange={() => {
              console.log('onChange', opt.value);
              toggleValue(opt.value);
            }}
          />
        ))}
        <Button
          variant="outline"
          onClick={() => onClick(selectedValues)}
          disabled={isSubmitDisabled}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}
