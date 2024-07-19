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
  title: "column",
  tags: ["autodocs"],
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  args: {},
};

export const Default = {
  decorators: [
    (story) => {
      applyTheme(light);
      return (
        <div
          className="bg-rs-background-1 
          w-screen max-h-screen overflow-y-auto"
        >
          {story()}
        </div>
      );
    },
  ],
  args: {
    headerLeft: <div>Left</div>,
    headerRight: <div>Right</div>,
    headerCenter: <div>Center</div>,
    children: (
      <div>
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
        <div>Column Content</div>
        <div>Column Content</div>
      </div>
    ),
  },
};
