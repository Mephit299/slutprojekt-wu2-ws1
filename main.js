import './node_modules/modern-css-reset/dist/reset.min.css'
import './src/assets/css/style.css'
import { setup } from './src/setup.js'
import { io } from'socket.io-client'
import { getQueryParameter, getRandomString } from './utils';

let room = getQueryParameter('room') || getRandomString(8);
let socket = io(`https://branched-amused-headstand.glitch.me/?room=${room}`); //idk man

document.querySelector('#app').innerHTML = `
  <canvas id="canvas1"></canvas> 
`

setup(document.querySelector('#canvas1'))
