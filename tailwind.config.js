const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        flowbite.content(),
    ],
    theme: {
        fontSize: {
            xs: ['12px', '16px'],
            sm: ['14px', '20px'],
            base: ['16px', '19.5px'],
            lg: ['18px', '21.94px'],
            xl: ['20px', '24.38px'],
            '2xl': ['24px', '29.26px'],
            '3xl': ['28px', '50px'],
            '4xl': ['48px', '58px'],
            '8xl': ['96px', '106px']
        },
        extend: {
            fontFamily: {
                palanquin: ['Palanquin', 'sans-serif'],
                montserrat: ['Montserrat', 'sans-serif'],
            },
            colors: {
            'primary': "#ECEEFF",
            "coral-red": "#FF4040",
            "slate-gray": "#1F2937",
            "pale-blue": "#F5F6FF",
            // "white-400": "rgba(255, 255, 255, 0.80)",
            customColor: 'rgb(31,41,55)',
            customGreen: 'rgba(46, 178, 0, 1)',
            customRed: 'rgba(255, 107, 107, 1)',
            },
            boxShadow: {
            'custom-bottom': '0 4px 10px rgba(0, 0, 0, 0.25)',
            '3xl': '0 10px 40px rgba(0, 0, 0, 0.1)',
            'chatbot-shadow': '0 4px 10px rgba(225,225,225,0.40)',
            'custom-bottom-blue': '0 4px 10px rgba(0, 128, 128, 0.60)'
            },
            // backgroundColor:{
            //     // customColor: 'rgba(248, 248, 250)',
            //     // customColor: 'rgba(31,41,55)',
                
            // }   
            // backgroundImage: {
            //     'landingpage': "url('./landing_page.png')",
            //     'signinpage': "url('./signin_page.png')", 
            // }, 
            backgroundImage: {
                'landingpage': "url('/assets/landing_page.png')",
                'signinpage': "url('/assets/signin_page.png')", 
            }, 
        },
    },
    plugins: [flowbite.plugin(),require('tailwind-scrollbar')],
}