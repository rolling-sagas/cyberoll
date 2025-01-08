'use-client';

import { Tab, TabGroup, TabList, TabPanels } from '@headlessui/react';
import { useEffect } from 'react';
import { executeScript } from '@/stores/actions/game';

import Modal from './modal';

import ScriptTab from './script-tab'
import ComponentsTab from './components-tab'
import FunctionsTab from './functions-tab'

export default function Editor() {
  useEffect(() => {
    executeScript(false);
  }, []);

  return (
    <>
      <TabGroup className="px-4 pt-2 pb-4 overflow-hidden flex-1 flex flex-col gap-4 h-full">
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
          <FunctionsTab />
        </TabPanels>
      </TabGroup>
      <Modal />
    </>
  );
}
