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
                        danger : {
                            DEFAULT : "hsl(0 84% 60%)"
                        }
                    },
                },
                dark: {
                    colors: {
                        primary: {
                            DEFAULT: "hsl(15.11 56.00000000000001% 52%)",
                        },
                        danger : {
                            DEFAULT : "hsl(0 84% 60%)"
                        },
                        content1 : {
                            DEFAULT : "hsl(0 100% 1%)"
                        }
                    },
                }
            }
        })
    ],
};
export default config;