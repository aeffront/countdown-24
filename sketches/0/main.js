import {sketch} from "./sketch.js";



window.addEventListener("modelLoaded", async (detail) => {

  sketch();
    
  
});






window.addEventListener("message", async (event) => {
  if (event.data === "started") {
    window.addEventListener("modelLoaded", async (detail) => {
      sketch();
    });
  }
});
