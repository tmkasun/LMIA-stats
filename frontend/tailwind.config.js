/** @type {import('tailwindcss').Config} */
import { fontFamily } from "tailwindcss/defaultTheme";

module.exports = {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["Montserrat", ...fontFamily.sans],
                quicksand: ["Quicksand", ...fontFamily.sans],
                manrope: ["Manrope", ...fontFamily.sans],
                openSans: ["Open Sans", ...fontFamily.sans],
                poppins: ["Poppins", ...fontFamily.sans],
                inter: ["Inter", ...fontFamily.sans],
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
            },
        },
    },
    plugins: [],
};