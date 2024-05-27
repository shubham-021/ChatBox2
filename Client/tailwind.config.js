/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins'],
     },
      colors: {
        'button': '#5e548e',
      },
     keyframes: {
      'message1': {
        '30%': {
          transform: "translateX(-95px)",
        },
        '34%': { opacity: "0.7"
                },
        '38%':{
          opacity: "0.7"
        } ,       
        '40%': {
            opacity: "0"
        }
      },
      'message2': {
        '30%': {
          transform: "translateX(220px)",
        },
        '34%': { opacity: "0.7"
                },
        '38%':{
          opacity: "0.7"
        } ,       
        '40%': {
            opacity: "0"
        }
      }
     },
     animation: {
      'message1': 'message1 6s linear infinite',
      'message2': 'message2 6s linear infinite'
     },
    },
  },
  plugins: [],
}

