/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      xs: { min: "0px" }, // Extra small devices (up to 599px)
      sm: { min: "600px" }, // Small devices (up to 899px)
      md: { min: "900px" }, // Medium devices (up to 1199px)
      lg: { min: "1200px" }, // Large devices (up to 1535px)
      xl: { min: "1536px" }, // Extra large devices (up to 1536px)
      // xs: { min: "0px", max: "599px" }, // Extra small devices (up to 599px)
      // sm: { min: "600px", max: "899px" }, // Small devices (up to 899px)
      // md: { min: "900px", max: "1199px" }, // Medium devices (up to 1199px)
      // lg: { min: "1200px", max: "1535px" }, // Large devices (up to 1535px)
      // xl: { min: "1536px" }, // Extra large devices (up to 1536px)
    },
    colors: {
      "blue": "#1fb6ff",
      "pink": "#ff49db",
      "orange": "#ff7849",
      "green": "#13ce66",
      "gray-dark": "#273444",
      "gray": "#8492a6",
      "gray-light": "#d3dce6",
      "main": "#001529",
      "white": "#ffffff",
    },
    // fontFamily: {
    //   sans: ["Inter", "sans-serif"],
    //   serif: ["Merriweather", "serif"],
    // },
    extend: {},
  },
  // plugins: [],
};

