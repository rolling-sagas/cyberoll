const config = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		borderWidth: {
  			'0': '0px',
  			'1': '1px',
  			'2': '2px',
  			'4': '4px',
  			'8': '8px',
  			DEFAULT: '0.5px'
  		},
  		backgroundColor: '({ theme }) => ({\n        ...theme("colors"),\n        DEFAULT: theme("colors.rs.background.1", "currentColor"),\n      })',
  		borderColor: '({ theme }) => ({\n        ...theme("colors"),\n        DEFAULT: theme("colors.rs.border", "currentColor"),\n      })',
  		fontSize: {
  			base: [
  				'15px',
  				{
  					lineHeight: '21px'
  				}
  			]
  		},
  		colors: {
  			rs: {
  				text: {
  					primary: 'rgb(var(--rs-color-text-primary) / <alpha-value>)',
  					secondary: 'rgb(var(--rs-color-text-secondary) / <alpha-value>)',
  					tertiary: 'rgb(var(--rs-color-text-tertiary) / <alpha-value>)'
  				},
  				background: {
  					'1': 'rgb(var(--rs-color-background-1) / <alpha-value>)',
  					'2': 'rgb(var(--rs-color-background-2) / <alpha-value>)',
  					'3': 'rgb(var(--rs-color-background-3) / <alpha-value>)',
  					hover: 'rgba(var(--rs-color-background-hover))'
  				},
  				border: 'rgb(var(--rs-color-border) / <alpha-value>)',
  				blue: 'rgb(var(--rs-color-blue) / <alpha-value>)',
  				red: 'rgb(var(--rs-color-red) / <alpha-value>)',
  				primary: 'rgb(var(--rs-color-primary) / <alpha-value>)'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-none': {
          /* For Firefox */
          'scrollbar-width': 'none',
          /* For Internet Explorer, Edge */
          '-ms-overflow-style': 'none',
          /* For Webkit-based browsers */
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      });
    },
      require("tailwindcss-animate")
],
};

export default config;
