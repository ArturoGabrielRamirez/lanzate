import { gridAreas } from "tailwindcss-grid-areas";

const config = {
    content : [
        './node_modules/onborda/dist/**/*.{js,ts,jsx,tsx}'
    ],
    plugins: [
        gridAreas(),
    ],
};
export default config;