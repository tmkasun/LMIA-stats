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
            animation: {
                progress: "progress 2s infinite linear",
            },
            keyframes: {
                progress: {
                    "0%": { transform: " translateX(0) scaleX(0)" },
                    "40%": { transform: "translateX(0) scaleX(0.3)" },
                    "100%": { transform: "translateX(100%) scaleX(0)" },
                },
            },
            transformOrigin: {
                "left-right": "0% 50%",
            }
        },
    },
    plugins: [],
};