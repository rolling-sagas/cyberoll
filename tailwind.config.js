const config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      borderWidth: {
        DEFAULT: "0.5px",
        0: "0px",
        1: "1px",
        2: "2px",
        4: "4px",
        8: "8px",
      },
      backgroundColor: ({ theme }) => ({
        ...theme("colors"),
        DEFAULT: theme("colors.rs.background", "currentColor"),
      }),
      borderColor: ({ theme }) => ({
        ...theme("colors"),
        DEFAULT: theme("colors.rs.border", "currentColor"),
      }),
      fontSize: {
        base: ["15px", { lineHeight: "21px" }],
      },
      colors: {
        rs: {
          text: "rgb(var(--rs-color-text) / <alpha-value>)",
          background: {
            1: "rgb(var(--rs-color-background-1) / <alpha-value>)",
            2: "rgb(var(--rs-color-background-2) / <alpha-value>)",
            3: "rgb(var(--rs-color-background-3) / <alpha-value>)",
          },
          border: "rgb(var(--rs-color-border) / <alpha-value>)",
          blue: "rgb(var(--rs-color-blue) / <alpha-value>)",
          primary: "rgb(var(--rs-color-primary) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};

export default config;
