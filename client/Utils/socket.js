import {io} from 'socket.io-client';
export const BaseUrl = 'http://localhost:3500';

export const socket = io.connect('https://strong-lands-relax.loca.lt');
