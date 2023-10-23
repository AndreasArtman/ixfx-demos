import { Points } from '../../../ixfx/geometry.js';
import { Forces } from '../../../ixfx/modulation.js';
import * as Util from './util.js';

const settings = Object.freeze({
  hueInterpolateAmount: 0.01,
  surpriseDropAmount: 0.001,
  // Bounce off sides, loosing some velocity
  constrainForce: Forces.constrainBounce({width:0.7,height:0.9}, 0.9),
  // Slow down velocity
  frictionForce: Forces.velocityForce(0.0001, `multiply`)
});

/**
 * Define our thing 
 * @typedef {{
*  position: Points.Point
*  velocity: Points.Point
*  acceleration: Points.Point
*  size: number
*  mass:number
* }} Thing
*/
let opacity1 = 1; 
let hue = 0; 
/**
 * Make use of data from `thing`
 * @param {Thing} thing 
 * @param {CanvasRenderingContext2D} context
 * @param {import('./util.js').Bounds} bounds
 */
export const use = (thing, context, bounds) => {
  const { position, size } = thing;


  const absolutePosition = Points.multiply(position, bounds.width, bounds.height);
  
  // Translate so 0,0 is the middle of the Thing
  context.save();
  context.translate(absolutePosition.x, absolutePosition.y);

  // Radius is size of thing proportional to half the smallest screen dimension
  const radius = size * bounds.min / 2;
  
  // Opacity is based on 'surprise'
  //const opacity = 1;

  // Draw circle
  const fillStyle = `hsl(${hue}, 100%, 50%, 1)`;
  Util.drawLabelledCircle(context, radius, fillStyle);
  
  // Unwind translation
  context.restore();
};

/**
 * Updates a given thing based on state
 * @param {Thing} thing
 * @param {import('./script.js').State} ambientState
 * @returns {Thing}
 */
export const update = (thing, ambientState) => {
  const { constrainForce, frictionForce } = settings;
  const { tilt, head } = ambientState;
  
  // Move on horizontal axis. Y remains 0
  const vector = {y: tilt, x: 0};

  console.log(head)
  
    opacity1 = 1 - (head * 5)
    hue = (head * 3) * 360
  

  // Compute new position, accel, velocity based on set of forces
  const withForce = Forces.apply(
    thing, 
    Forces.accelerationForce(vector, `dampen`),
    frictionForce, 
    constrainForce);
    
  // Add these properties to existing properties,
  // return a new copy
  return Object.freeze({
    ...thing,
    ...withForce
  });
};

/**
 * Creates a new thing
 * @returns {Thing}
 */
export const create = () => {
  return {
    position: { x: 0.5, y:0.5 },
    size: 0.2,
    mass: 250,
    velocity: {x:0,y:0.9},
    acceleration: {x:0,y:-0.9}
  };
};