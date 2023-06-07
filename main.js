import "./remedy.css";
import "./style.css";
import "./drawer.js";

const button = document.body.querySelector("button");
const drawer = document.body.querySelector("scroll-drawer");
const openDrawer = (e) => {
  drawer.open();
};
button.addEventListener("click", openDrawer);

const closeBtn = Array.from(document.body.querySelectorAll(".close-button"));
closeBtn.forEach((el) => {
  el.addEventListener("click", (e) => {
    drawer.close();
  });
});
