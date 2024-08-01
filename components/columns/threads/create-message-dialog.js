import BaseButton from "@/components/buttons/base-button";

import { useModalStore } from "@/components/modal/dialog-placeholder";

import {
  MessageProgrammingIcon,
  RoboticIcon,
  UserCircle02Icon,
  Wrench01Icon,
} from "@hugeicons/react";

import Dialog, { Input } from "@/components/modal/dialog";

import SwitchTabs from "@/components/tabs/switch-tabs";

import { useState } from "react";

const roles = ["system", "assistant", "user"];
let lastRoleIndex = 0;

const RoleSwitch = function ({ index, onChange }) {
  return (
    <div
      className="grid grid-cols-[48px_auto] 
      grid-rows-[21px_19px_max-content_max-conent]
      w-full"
    >
      <div className="pt-1 relative col-start-1 row-span-2">
        <div className="w-9 h-9 text-rs-text-secondary">
          <UserCircle02Icon />
        </div>
      </div>
      <div className="col-start-2 rows-start-1">
        <div className="px-1">
          <span className="font-semibold capitalize">Role: {roles[index]}</span>
        </div>
      </div>
      <div className="col-start-2 mt-1">
        <SwitchTabs
          onChange={onChange}
          index={index}
          items={[
            <Wrench01Icon size={20} key={0} />,
            <RoboticIcon size={20} key={1} />,
            <UserCircle02Icon size={20} key={2} />,
          ]}
        />
      </div>
    </div>
  );
};

export default function CreateMessageDialog({ role, content, onConfirm }) {
  const closeModal = useModalStore((state) => state.close);

  const [roleIndex, setRoleIndex] = useState(
    role ? roles.indexOf(role) : lastRoleIndex,
  );
  const [mContent, setMContent] = useState(content || "");

  const canCreate = mContent.trim().length > 0;

  return (
    <Dialog
      title={role ? "Edit mesage" : "New message"}
      header={
        <RoleSwitch
          index={roleIndex}
          onChange={(idx) => {
            lastRoleIndex = idx;
            setRoleIndex(idx);
          }}
        />
      }
      body={
        <Input
          name="Content"
          value={mContent}
          onChange={setMContent}
          icon=<MessageProgrammingIcon
            className="text-rs-text-secondary"
            size={20}
          />
          placeholder="Required, can be template or plain text"
          autoSize={true}
          autoFocus={true}
        />
      }
      footer={
        <BaseButton
          label={role ? "Update" : "Create"}
          disabled={!canCreate}
          onClick={async () => {
            closeModal();
            onConfirm(roles[roleIndex], mContent);
          }}
        />
      }
    />
  );
}
