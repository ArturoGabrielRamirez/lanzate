import { gridAreas } from "tailwindcss-grid-areas";
import { heroui } from "@heroui/theme";

const config = {
    content: [
        "./node_modules/@heroui/theme/dist/components/button.js",
    ],
    plugins: [
        gridAreas(),
        heroui({
            layout: {

            },
            themes: {
                light: {
                    colors: {
                        primary: {
                            DEFAULT: "hsl(15.11 56.00000000000001% 52%)",
                        },
                    },
                },
                dark: {
                    colors: {
                        primary: {
                            DEFAULT: "hsl(15.11 56.00000000000001% 52%)",
                        },
                    },
                }
            }
        })
    ],
};
export default config;