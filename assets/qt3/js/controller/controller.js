// Controller.js.

import { initView } from "../view/view.js";
import { setSquareHandler } from "../view/view.js";

export function initController () {
  console.log("Controller: qt3/js/controller/controller.js");

  setSquareHandler( squareKey => {  // Registers function with view so it can be called on square events.
    realHonestToGoodnessLogicCode(squareKey);
  });

  initView(); // Dev scaffolding.
}

function realHonestToGoodnessLogicCode(event) {  // This is where the logic lies, keep registration and logic separate.
  console.log("Controller received:", event);
  // add more code as needed...
}
