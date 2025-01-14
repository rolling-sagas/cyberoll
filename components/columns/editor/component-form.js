'use client';

import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { COMPONENT_TYPE } from '@/utils/const';

import ScriptEditor from './script-editor';
import { setEditingComponent } from '@/stores/actions/component';
import useStore from '@/stores/editor';
import ImageAutoUploader from '../components/image-auto-uploader';

export default function ComponentForm({ isFuncTab = false }) {
  const editingComponent = useStore((state) => state.editingComponent);

  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label className="mb-1" htmlFor="component-name">
          Unique Name:
        </Label>
        <Input
          id="component-name"
          value={editingComponent?.name || ''}
          placeholder="Unique component name"
          onChange={(evt) => {
            setEditingComponent({
              ...editingComponent,
              name: evt.target.value,
            });
          }}
        />
      </div>
      {
        !isFuncTab ? <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className="mb-1" htmlFor="component-type">
            Type:
          </Label>
          <Select
            value={editingComponent?.type}
            onValueChange={(type) =>
              setEditingComponent({
                ...editingComponent,
                value: '',
                type,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select component type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(COMPONENT_TYPE)
                .filter(([_, type]) => type !== COMPONENT_TYPE.Function)
                .map(([name, type]) => (
                  <SelectItem key={type} value={type}>
                    {name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div> : null
      }
      <Label>Value:</Label>
      {editingComponent?.type === COMPONENT_TYPE.Toml ||
        editingComponent?.type === COMPONENT_TYPE.Function ||
        editingComponent?.type === COMPONENT_TYPE.Object ? (
          <ScriptEditor
            code={editingComponent?.value}
            onChange={(value) => {
              setEditingComponent({
                ...editingComponent,
                value: value,
              });
            }}
            lang={editingComponent?.type === COMPONENT_TYPE.Toml ? 'toml' : 'js'}
          />
        ) : null
      }
      {editingComponent?.type === COMPONENT_TYPE.String ||
        editingComponent?.type === COMPONENT_TYPE.Number ? (
          <Input value={editingComponent?.value || ''} onChange={(e) => {
            setEditingComponent({
              ...editingComponent,
              value: e.target.value,
            });
          }}/>
        ) : null
      }
      {editingComponent?.type === COMPONENT_TYPE.Image ? (
        <ImageAutoUploader
          value={editingComponent?.value}
          onChange={(value) => {
            setEditingComponent({
              ...editingComponent,
              value,
            });
          }}
        />
      ) : null}
    </>
  );
}
