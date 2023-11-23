/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        tablet: "640px",
        desktop: "1024px",
        menuBreak: "857px"
      },
      fontSize: {
        xxs: "0.6rem",
        xxxs: "0.4rem",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        assistant: ["Assistant", "sans-serif"],
      },
      backgroundImage: {},
      colors: {
        pinkPage: "#ef1aa8",
        yellowPage: {
          up: "#f8c20d",
          down: "#b9910a",
        },
        bluePage: {
          up: "#63f8d3",
          down: "#0c3372",
        },
        blackOpacity: {
          10: "#0000001A",
          20: "#00000033",
          30: "#0000004D",
          40: "#00000066",
          50: "#00000080",
          60: "#00000099",
          70: "#000000B3",
          80: "#000000CC",
          90: "#000000E6",
        },
      },
    },
  },
  plugins: [],
}

