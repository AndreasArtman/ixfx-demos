/**
 * Demonstrates creates DOM elements by row for each grid cell.
 * 
 * This makes it easy to use CSS styling and DOM elements for further interaction.
 */

import { Grids } from '../../ixfx/geometry.js';

// Define settings
const settings = Object.freeze({
  grid: { rows: 10, cols: 10, size: 10 },
  gridEl: document.getElementById(`grid`),
  feedbackEl: document.getElementById(`feedback`)
});

// Initialise state
let state = {
  lastClicked: { x: 0, y: 0 }
};

/**
 * Returns a cell based on an HTML element that has data-x and data-y attributes set.
 * 
 * Returns -1 for x/y if attribute is not found.
 * @param {HTMLElement} el 
 * @returns 
 */
const getCellFromElement = (el) => ({
  x: parseInt(el.getAttribute(`data-x`) ?? `-1`),
  y: parseInt(el.getAttribute(`data-y`) ?? `-1`)
});

const onCellClick = (ev) => {
  const cell = getCellFromElement(ev.target);
  updateState({
    lastClicked: cell
  });
  useState();
};

/**
 * Update state
 * @param {Partial<state>} s 
 */
const updateState = (s) => {
  state = {
    ...state,
    ...s
  };
};

const useState = () => {
  const { feedbackEl } = settings;
  const { lastClicked } = state;
  if (feedbackEl) feedbackEl.innerHTML = `Clicked grid cell: ${lastClicked.x}, ${lastClicked.y}`;
};

/**
 * Setup 
 */
const setup = () => {
  const { grid, gridEl } = settings;
  if (gridEl === null) return;

  for (const row of Grids.rows(grid)) {
    // Make HTML for each cell. This produces an array of strings
    //   Note we encode the coordinate of the cell in the attributes
    const cellsHtml = row.map(cell => `<div data-x="${cell.x}" data-y="${cell.y}" class="cell"></div>`);

    // Make HTML for a row. Join together array of strings
    const rowHtml = `<div class="row"> ${cellsHtml.join(` `)}</div>`;

    // Add it to the parent element
    gridEl.insertAdjacentHTML(`beforeend`, rowHtml);
  }

  gridEl.addEventListener(`click`, onCellClick);
};

setup();