// control.js
/* Example of callback registration: 
 * Controller registers its event functions with the view layer.
 * The view layer stores the registered functions.
 * When am event happens, it calls the registered function.
 * The called controller code runs, which should update the state.
 * Updated state should be reflected by the view layer.
*/
 
import * as view  from "./view.js";
import * as model from "./model.js";

export function demoRegistration() {
  console.log("demoRegistration", view);

  view.registerCallback("game",   button => { handleGameButtonRelease(button); });
  view.registerCallback("camera", button => { handleCameraButtonRelease(button); });
  view.registerCallback("tray",   button => { handleTrayButtonRelease(button); });
  view.registerCallback("move",   button => { handleMoveButtonRelease(button); });
  view.registerCallback("gambit", button => { handleGambitButtonRelease(button); });
  // Seampoint - register additional event functions...

  view.testCallbacks(); // Simulates the view layer getting an event.
}

// The event functions - these will task the model layer to change state.
function handleGameButtonRelease(button) {
  console.log(`  control: handleGameButtonRelease(${button}).`);
  model.changeGameState(button);
  }
function handleCameraButtonRelease(button) {
  console.log(`  control: handleCameraButtonRelease(${button}).`);
  model.changeCameraState(button);
  }
function handleTrayButtonRelease(button) {
  console.log(`  control: handleTrayButtonRelease(${button}).`);
   model.changeTrayState(button);
 }
function handleMoveButtonRelease(button) {
  console.log(`  control: handleMoveButtonRelease(${button}).`);
  model.changeMoveState(button);
  }
function handleGambitButtonRelease(button) {
  console.log(`  control: handleGambitButtonRelease(${button}).`);
  model.changeGambitState(button);
}
// Seampoint - more event functions...

