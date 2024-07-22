import { fn } from "@storybook/test";

import { light, dark } from "../tailwind/themeColors";
import { applyTheme } from "../tailwind/store";

import Column from "./column";

export const ActionsData = {
  onArchiveTask: fn(),
  onPinTask: fn(),
};

export default {
  component: Column,
  title: "Column",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  excludeStories: /.*Data$/,
  args: {
    headerLeft: <div>Left</div>,
    headerRight: <div>Right</div>,
    headerCenter: <div>Center</div>,
    children: (
      <div className="px-2">
        <div>Head</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Column Content</div>
        <div>Tail</div>
      </div>
    ),
  },
};

export const Default = {
  decorators: [
    (story) => {
      applyTheme(light);
      return (
        <div className="w-full h-full bg-rs-background-1 ">
          <div className="flex flex-row justify-center gap-6">{story()}</div>
        </div>
      );
    },
  ],
};
