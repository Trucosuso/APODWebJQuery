import { APODCard, APODMenuBar, APODModal } from "./view.js";
import { APODController } from "./controller.js";

customElements.define("apod-card", APODCard, { extends: "div" });
customElements.define("apod-menu-bar", APODMenuBar, { extends: "div" });
customElements.define("apod-modal", APODModal, { extends: "div" });

window.addEventListener("load", () => {
    let controller = new APODController();
});