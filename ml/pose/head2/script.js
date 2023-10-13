// @ts-ignore
import { Remote } from "https://unpkg.com/@clinth/remote@latest/dist/index.mjs";
import * as Dom from '../../../ixfx/dom.js';
import { Points } from '../../../ixfx/geometry.js';
import * as MoveNet from "../Poses.js";

const getKeypoint = MoveNet.Coco.getKeypoint;
const box = document.getElementById('box');

// Create a circle element
const circleElement = document.createElement("div");
circleElement.style.width = "50px";
circleElement.style.height = "50px";
circleElement.style.borderRadius = "50%";
circleElement.style.backgroundColor = "red";
circleElement.style.position = "absolute";
document.body.appendChild(circleElement);

const settings = Object.freeze({
  updateRateMs: 100,
  remote: new Remote(),
  poses: new MoveNet.PosesTracker({maxAgeMs: 500 }),
});

let state = Object.freeze({
  bounds: {
    width: 0, height: 0,
    center: { x: 0, y: 0 },
  },
  scaleBy: 1,
  heads:[],
  bodys:[], 
});

const update = () => {
  const {poses} = settings;

  const heads = [];
  let sumY = 0;
  for (const pose of poses.getRawPoses()) {
    const head = computeHead(pose);
    heads.push(head);

    
    sumY += head.y

  }

  let prevY, prevTime;
let speedY = 0; // Initialize vertical speed as 0

// Function to update the Y-coordinate of the point (e.g., in a loop)
function updateY(sumY) {
  if (prevY !== undefined && prevTime !== undefined) {
    // Calculate the change in Y position
    const deltaY = sumY - prevY;

    // Calculate the time elapsed since the last update
    const currentTime = new Date().getTime();
    const deltaTime = (currentTime - prevTime) / 1000; // Convert to seconds

    // Calculate the vertical speed
    speedY = deltaY / deltaTime;

    // Output the vertical speed (you can update this part as needed)
    console.log(`Vertical speed: ${speedY} units per second`);
  }

  // Update the previous Y-coordinate and time for the next update
  prevY = newY;
  prevTime = new Date().getTime();
}

 //console.log(sumY)
 updateY()
  
  

  // Update the ball's position to be in the center between two heads
  if (heads.length >= 2) {
    const xCenter = (heads[0].x + heads[1].x) / 2;
    const yCenter = (heads[0].y + heads[1].y) / 2;

    circleElement.style.left = `${xCenter * 100}vw`;
    circleElement.style.top = `${yCenter * 100}vh`;
  }

  saveState({heads});
};

const computeHead = (pose) => {
  const nose = getKeypoint(pose, `nose`);
  const leftEar = getKeypoint(pose, `left_ear`);
  const rightEar = getKeypoint(pose, `right_ear`);
  const earDistance = Points.distance(leftEar, rightEar);
  const radius = earDistance / 2;

  return {
    x: nose.x,
    y: nose.y,
    radius,
    poseId: (pose.id ?? 0).toString(),
  };
};


const onPoseAdded = (event) => {
  const poseTracker = event.detail;
  console.log(`Pose added: ${poseTracker.guid}`);
};

const onPoseExpired = (event) => {
  const poseTracker = event.detail;
  console.log(`Pose expired: ${poseTracker.guid}`);
};

const onReceivedPoses = (packet) => {
  const { _from, data } = packet;
  const poseData = data;

  for (const pose of poseData) {
    settings.poses.seen(_from, pose);
  }
};

function setup() {
  const { updateRateMs, remote, poses } = settings;
  
  remote.onData = onReceivedPoses;
  poses.events.addEventListener(`added`, onPoseAdded);
  poses.events.addEventListener(`expired`, onPoseExpired);

  const updateLoop = () => {
    update();
    setTimeout(updateLoop, updateRateMs);
  };
  updateLoop();
};
setup();

function saveState (s) {
  state = Object.freeze({
    ...state,
    ...s
  });
}
