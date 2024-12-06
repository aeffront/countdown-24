import sketch from "./sketch.js";


window.addEventListener("message", async (event) => {
  if (event.data === "started") {
    console.log("strating 1");
    sketch();
  }
});
