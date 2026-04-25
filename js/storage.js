import{KEY}from'./config.js';export const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};export const save=trips=>localStorage.setItem(KEY,JSON.stringify(trips));
