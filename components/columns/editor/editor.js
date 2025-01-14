'use-client';

import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/react';
import Modal from './modal';

import ScriptTab from './script-tab'
import ComponentsTab from './components-tab'
import {
  setEditingComponent,
} from "@/stores/actions/component";

export default function Editor() {
  return (
    <>
      <TabGroup onChange={() => setEditingComponent(null)} className="px-4 pt-2 pb-4 overflow-hidden flex-1 flex flex-col gap-4 h-full">
        <TabList className="flex flex-row items-center gap-4 text-gray-500 font-semibold">
          <Tab className="outline-none data-[selected]:underline underline-offset-[6px] data-[selected]:text-gray-800">
            Scripting
          </Tab>
          <Tab className="outline-none data-[selected]:underline underline-offset-[6px] data-[selected]:text-gray-800">
            Components
          </Tab>
          <Tab className="outline-none data-[selected]:underline underline-offset-[6px] data-[selected]:text-gray-800">
            Functions
          </Tab>
        </TabList>
        <TabPanels className="flex-1 h-1">
          <ScriptTab />
          <ComponentsTab />
          <ComponentsTab isFuncTab={true} />
        </TabPanels>
      </TabGroup>
      <Modal />
    </>
  );
}
