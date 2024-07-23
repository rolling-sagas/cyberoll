import ColumnList from "./column-list";
import { light, dark } from "../tailwind/themeColors";
import { applyTheme } from "../tailwind/store";

import * as ColumnStories from "./column.stories";

export default {
  component: ColumnList,
  title: "ColumnList",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: {
    ...ColumnStories.ActionsData,
  },
};

export const Default = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.jsx.
    columns: [
      {
        ...ColumnStories.default.args,
        id: "1",
        headerCenter: <div>Column 1</div>,
        headerLeft: null,
        headerRight: null,
      },
      {
        ...ColumnStories.default.args,
        id: "2",
        headerCenter: <div>Column 2</div>,
        headerLeft: null,
        headerRight: null,
      },
    ],
  },

  decorators: [
    (story) => {
      applyTheme(light);
      return (
        <div
          className="w-full h-screen bg-rs-background-1 
          overflow-y-hidden px-4"
        >
          {story()}
        </div>
      );
    },
  ],
};

export const SingleColumn = {
  args: {
    // Shaping the stories through args composition.
    // The data was inherited from the Default story in Task.stories.jsx.
    columns: [
      {
        ...ColumnStories.default.args,
        id: "1",
        headerCenter: <div>Column 1</div>,
        headerLeft: null,
        headerRight: null,
      },
    ],
  },

  decorators: [
    (story) => {
      applyTheme(light);
      return (
        <div
          className="w-full h-screen bg-rs-background-1 
          overflow-y-hidden px-4"
        >
          {story()}
        </div>
      );
    },
  ],
};
