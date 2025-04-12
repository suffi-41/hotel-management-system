/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
     
      backgroundImage: {
        'images_1': "url('./src/assets/index_1.jpg')",
        'images_2': "url('./src/assets/about.jpg')",
        'images_3': "url('./src/assets/milestones.jpg')",
        'images_4': "url('.src/assets/pexels-quark-studio-1159039-2506988.jpg')",
        'images_5': "url('./src/assets/pexels-fotoaibe-1743231.jpg')",
        'images_6': "url('./src/assets/pexels-pixabay-258154.jpg')",
        'images_7': "url('./src/assets/pexels-pixabay-262047.jpg')",
        'images_8': "url('./src/assets/pexels-quark-studio-1159039-2506988.jpg')",
        'images_9': "url('./src/assets/pexels-quark-studio-1159039-2507010.jpg')",
        'images_10':"url('./src/assets/pexels-wildlittlethingsphoto-2017802.jpg')",
      },
    },
    
  },
  plugins: [],
}

//     extend: {
//       colors:{
//         primary:"#eaecee"
//       }
//     },


