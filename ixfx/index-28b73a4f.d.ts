import * as rxjs from 'rxjs';
import { Observable } from 'rxjs';
import { a as Point } from './Point-33154903.js';
import { S as ScaleFn } from './Scaler-498ee4df.js';
import { F as Forms } from './Forms-d8146f9f.js';

type LogOpts = {
    readonly reverse?: boolean;
    readonly capacity?: number;
    readonly timestamp?: boolean;
    readonly collapseDuplicates?: boolean;
    readonly monospaced?: boolean;
    readonly minIntervalMs?: number;
    readonly css?: string;
};
type Log = Readonly<{
    clear(): void;
    error(msgOrError: string | Error | unknown): void;
    log(msg?: string | object | number): HTMLElement | undefined;
    append(el: HTMLElement): void;
    dispose(): void;
    readonly isEmpty: boolean;
}>;
/**
 * Allows writing to a DOM element in console.log style. Element grows in size, so use
 * something like `overflow-y: scroll` on its parent
 *
 * ```
 * const l = log(`#dataStream`); // Assumes HTML element with id `dataStream` exists
 * l.log(`Hi`);
 * l.log(); // Displays a horizontal rule
 *
 * const l = log(document.getElementById(`dataStream`), {
 *  timestamp: true,
 *  truncateEntries: 20
 * });
 * l.log(`Hi`);
 * l.error(`Some error`); // Adds class `error` to line
 * ```
 *
 * For logging high-throughput streams:
 * ```
 * // Silently drop log if it was less than 5ms since the last
 * const l = log(`#dataStream`, { minIntervalMs: 5 });
 *
 * // Only the last 100 entries are kept
 * const l = log(`#dataStream`, { capacity: 100 });
 * ```
 *
 * @param {(HTMLElement | string | undefined)} elOrId Element or id of element
 * @param {LogOpts} opts
 * @returns {Log}
 */
declare const log: (domQueryOrEl: HTMLElement | string, opts?: LogOpts) => Log;

type PluckOpts = {
    readonly pluck: string;
};
type TransformOpts = {
    transform(ev: Event): any;
};
/**
 * Responsive value
 */
type Rx<V> = {
    /**
     * Last value
     */
    readonly value: V;
    /**
     * Clears last value
     */
    readonly clear: () => void;
};
type DomRxOpts = PluckOpts | TransformOpts;
/**
 * Keeps track of last event data
 *
 * ```js
 * const pointer = rx(`#myDiv`, `pointermove`).value;
 *
 * if (pointer.clientX > ...)
 * ```
 *
 * Pluck a field:
 * ```js
 * const pointerX = rx(`#myDiv`, `pointermove`, { pluck: `clientX` }).value;
 *
 * if (pointerX > ...)
 * ```
 * @template V Event type
 * @param opts
 * @return
 */
declare const rx: <V extends object>(elOrQuery: HTMLElement | string, event: string, opts?: DomRxOpts) => Rx<V>;

type ElementResizeArgs<V extends HTMLElement | SVGSVGElement> = {
    readonly el: V;
    readonly bounds: {
        readonly width: number;
        readonly height: number;
        readonly center: Point;
        readonly min: number;
        readonly max: number;
    };
};
type CanvasResizeArgs = ElementResizeArgs<HTMLCanvasElement> & {
    readonly ctx: CanvasRenderingContext2D;
};
declare const fullSizeElement: <V extends HTMLElement>(domQueryOrEl: string | V, onResized?: ((args: ElementResizeArgs<V>) => void) | undefined) => Observable<Event>;
type CanvasOpts = {
    readonly skipCss?: boolean;
    readonly fullSize?: boolean;
    readonly scaleBy?: `both` | `width` | `height` | `min` | `max`;
};
declare const canvasHelper: (domQueryOrEl: string | HTMLCanvasElement | undefined | null, opts: CanvasOpts) => {
    abs: ScaleFn;
    rel: ScaleFn;
    getContext: () => void;
};
/**
 * Resizes given canvas element to match window size.
 * To resize canvas to match its parent, use {@link parentSizeCanvas}.
 *
 * To make the canvas appear propery, it sets the following CSS:
 * ```css
 * {
 *  top: 0;
 *  left: 0;
 *  zIndex: -1;
 *  position: fixed;
 * }
 * ```
 * Pass _true_ for `skipCss` to avoid this.
 *
 * Provide a callback for when resize happens.
 * @param domQueryOrEl Query string or reference to canvas element
 * @param onResized Callback for when resize happens, eg for redrawing canvas
 * @param skipCss if true, style are not added
 * @returns Observable
 */
declare const fullSizeCanvas: (domQueryOrEl: string | HTMLCanvasElement | undefined | null, onResized?: ((args: CanvasResizeArgs) => void) | undefined, skipCss?: boolean) => Observable<Event>;
/**
 * Given an array of class class names, this will cycle between them each time
 * it is called.
 *
 * Eg, assume `list` is: [ `a`, `b`, `c` ]
 *
 * If `el` already has the class `a`, the first time it is called, class `a`
 * is removed, and `b` added. The next time `b` is swapped for `c`. Once again,
 * `c` will swap with `a` and so on.
 *
 * If `el` is undefined or null, function silently returns.
 * @param el Element
 * @param list List of class names
 * @returns
 */
declare const cycleCssClass: (el: HTMLElement, list: readonly string[]) => void;
/**
 * Sets width/height atributes on the given element according to the size of its parent.
 * @param domQueryOrEl Elememnt to resize
 * @param onResized Callback when resize happens
 * @param timeoutMs Timeout for debouncing events
 * @returns
 */
declare const parentSize: <V extends HTMLElement | SVGSVGElement>(domQueryOrEl: string | V, onResized?: ((args: ElementResizeArgs<V>) => void) | undefined, timeoutMs?: number) => rxjs.Subscription;
/**
 * Source: https://zellwk.com/blog/translate-in-javascript
 * @param domQueryOrEl
 */
declare const getTranslation: (domQueryOrEl: string | HTMLElement) => Point;
/**
 * Resizes given canvas to its parent element.
 * To resize canvas to match the viewport, use {@link fullSizeCanvas}.
 *
 * Provide a callback for when resize happens.
 * @param domQueryOrEl Query string or reference to canvas element
 * @param onResized Callback for when resize happens, eg for redrawing canvas
 * @returns Observable
 */
declare const parentSizeCanvas: (domQueryOrEl: string | HTMLCanvasElement, onResized?: ((args: CanvasResizeArgs) => void) | undefined, timeoutMs?: number) => rxjs.Subscription;
/**
 * Returns an Observable for window resize. Default 100ms debounce.
 * @param timeoutMs
 * @returns
 */
declare const windowResize: (timeoutMs?: number) => Observable<Event>;
/**
 * Resolves either a string or HTML element to an element.
 * Useful when an argument is either an HTML element or query.
 *
 * ```js
 * resolveEl(`#someId`);
 * resolveEl(someElement);
 * ```
 * @param domQueryOrEl
 * @returns
 */
declare const resolveEl: <V extends Element>(domQueryOrEl: string | V) => V;
/**
 * Creates an element after `sibling`
 * ```
 * const el = createAfter(siblingEl, `DIV`);
 * ```
 * @param sibling Element
 * @param tagName Element to create
 * @returns New element
 */
declare const createAfter: (sibling: HTMLElement, tagName: string) => HTMLElement;
/**
 * Creates an element inside of `parent`
 * ```
 * const newEl = createIn(parentEl, `DIV`);
 * ```
 * @param parent Parent element
 * @param tagName Tag to create
 * @returns New element
 */
declare const createIn: (parent: HTMLElement, tagName: string) => HTMLElement;
/**
 * Creates a table based on a list of objects
 * ```
 * const t = dataTableList(parentEl, map);
 *
 * t(newMap)
 * ```
 */
declare const dataTableList: (parentOrQuery: HTMLElement | string, data: ReadonlyMap<string, object>) => (data: ReadonlyMap<string, object>) => void;
/**
 * Format data. Return _undefined_ to signal that
 * data was not handled.
 */
type DataFormatter = (data: object, path: string) => string | undefined;
type DataTableOpts = {
    readonly formatter?: DataFormatter;
    readonly precision?: number;
    readonly roundNumbers?: boolean;
};
/**
 * Creates a HTML table where each row is a key-value pair from `data`.
 * First column is the key, second column data.
 *
 * ```js
 * const dt = dataTable(`#hostDiv`);
 * dt({
 *  name: `Blerg`,
 *  height: 120
 * });
 * ```
 */
declare const dataTable: (parentOrQuery: HTMLElement | string, data?: object, opts?: DataTableOpts) => (data: object) => void;
/**
 * Remove all child nodes from `parent`
 * @param parent
 */
declare const clear: (parent: HTMLElement) => void;
/**
 * Observer when document's class changes
 *
 * ```js
 * const c = themeChangeObservable();
 * c.subscribe(() => {
 *  // Class has changed...
 * });
 * ```
 * @returns
 */
declare const themeChangeObservable: () => Observable<readonly MutationRecord[]>;
/**
 * Observer when element resizes. Specify `timeoutMs` to debounce.
 *
 * ```
 * const o = resizeObservable(myEl, 500);
 * o.subscribe(() => {
 *  // called 500ms after last resize
 * });
 * ```
 * @param elem
 * @param timeoutMs Tiemout before event gets triggered
 * @returns
 */
declare const resizeObservable: (elem: Element, timeoutMs?: number) => Observable<readonly ResizeObserverEntry[]>;
/**
 * Copies string representation of object to clipboard
 * @param obj
 * @returns Promise
 */
declare const copyToClipboard: (obj: object) => Promise<unknown>;
type CreateUpdateElement<V> = (item: V, el: HTMLElement | null) => HTMLElement;
declare const reconcileChildren: <V>(parentEl: HTMLElement, list: ReadonlyMap<string, V>, createUpdate: CreateUpdateElement<V>) => void;

type Opts = {
    readonly touchRadius?: number;
    readonly mouseRadius?: number;
    readonly trace?: boolean;
    readonly hue?: number;
};
/**
 * Visualises pointer events within a given element.
 *
 * ```js
 * // Show pointer events for whole document
 * pointerVis(document);
 * ```
 *
 * Note you may need to set the following CSS properties on the target element:
 *
 * ```css
 * touch-action: none;
 * user-select: none;
 * overscroll-behavior: none;
 * ```
 *
 * Options
 * * touchRadius/mouseRadius: size of circle for these kinds of pointer events
 * * trace: if true, intermediate events are captured and displayed
 * @param elOrQuery
 * @param opts
 */
declare const pointerVisualise: (elOrQuery: HTMLElement | string, opts?: Opts) => void;

/**
 * Creates an error handler to show errors on-screen.
 * This is useful when testing on mobile devices that lack access to the console.
 *
 * ```js
 * const e = defaultErrorHandler();
 * ```
 *
 * Manual control:
 * ```js
 * const e = defaultErrorHandler();
 * e.show(someError);
 * e.hide();
 * ```
 * @returns
 */
declare const defaultErrorHandler: () => {
    show: (ex: Error | string | Event) => void;
    hide: () => void;
};

type DragState = {
    readonly token?: object;
    readonly initial: Point;
    readonly delta: Point;
};
type DragStart = {
    readonly allow: boolean;
    readonly token: object;
};
type DragListener = {
    readonly start?: () => DragStart;
    readonly progress?: (state: DragState) => boolean;
    readonly abort?: (reason: string, state: DragState) => void;
    readonly success?: (state: DragState) => void;
};
declare const draggable: (elem: SVGElement, listener: DragListener) => () => void;

type DragDrop_DragListener = DragListener;
type DragDrop_DragStart = DragStart;
type DragDrop_DragState = DragState;
declare const DragDrop_draggable: typeof draggable;
declare namespace DragDrop {
  export {
    DragDrop_DragListener as DragListener,
    DragDrop_DragStart as DragStart,
    DragDrop_DragState as DragState,
    DragDrop_draggable as draggable,
  };
}

type index_CanvasOpts = CanvasOpts;
type index_CanvasResizeArgs = CanvasResizeArgs;
type index_CreateUpdateElement<V> = CreateUpdateElement<V>;
type index_DataFormatter = DataFormatter;
type index_DataTableOpts = DataTableOpts;
type index_DomRxOpts = DomRxOpts;
declare const index_DragDrop: typeof DragDrop;
type index_ElementResizeArgs<V extends HTMLElement | SVGSVGElement> = ElementResizeArgs<V>;
declare const index_Forms: typeof Forms;
type index_Log = Log;
type index_LogOpts = LogOpts;
type index_Opts = Opts;
type index_PluckOpts = PluckOpts;
type index_Rx<V> = Rx<V>;
type index_TransformOpts = TransformOpts;
declare const index_canvasHelper: typeof canvasHelper;
declare const index_clear: typeof clear;
declare const index_copyToClipboard: typeof copyToClipboard;
declare const index_createAfter: typeof createAfter;
declare const index_createIn: typeof createIn;
declare const index_cycleCssClass: typeof cycleCssClass;
declare const index_dataTable: typeof dataTable;
declare const index_dataTableList: typeof dataTableList;
declare const index_defaultErrorHandler: typeof defaultErrorHandler;
declare const index_fullSizeCanvas: typeof fullSizeCanvas;
declare const index_fullSizeElement: typeof fullSizeElement;
declare const index_getTranslation: typeof getTranslation;
declare const index_log: typeof log;
declare const index_parentSize: typeof parentSize;
declare const index_parentSizeCanvas: typeof parentSizeCanvas;
declare const index_pointerVisualise: typeof pointerVisualise;
declare const index_reconcileChildren: typeof reconcileChildren;
declare const index_resizeObservable: typeof resizeObservable;
declare const index_resolveEl: typeof resolveEl;
declare const index_rx: typeof rx;
declare const index_themeChangeObservable: typeof themeChangeObservable;
declare const index_windowResize: typeof windowResize;
declare namespace index {
  export {
    index_CanvasOpts as CanvasOpts,
    index_CanvasResizeArgs as CanvasResizeArgs,
    index_CreateUpdateElement as CreateUpdateElement,
    index_DataFormatter as DataFormatter,
    index_DataTableOpts as DataTableOpts,
    index_DomRxOpts as DomRxOpts,
    index_DragDrop as DragDrop,
    index_ElementResizeArgs as ElementResizeArgs,
    index_Forms as Forms,
    index_Log as Log,
    index_LogOpts as LogOpts,
    index_Opts as Opts,
    index_PluckOpts as PluckOpts,
    index_Rx as Rx,
    index_TransformOpts as TransformOpts,
    index_canvasHelper as canvasHelper,
    index_clear as clear,
    index_copyToClipboard as copyToClipboard,
    index_createAfter as createAfter,
    index_createIn as createIn,
    index_cycleCssClass as cycleCssClass,
    index_dataTable as dataTable,
    index_dataTableList as dataTableList,
    index_defaultErrorHandler as defaultErrorHandler,
    index_fullSizeCanvas as fullSizeCanvas,
    index_fullSizeElement as fullSizeElement,
    index_getTranslation as getTranslation,
    index_log as log,
    index_parentSize as parentSize,
    index_parentSizeCanvas as parentSizeCanvas,
    index_pointerVisualise as pointerVisualise,
    index_reconcileChildren as reconcileChildren,
    index_resizeObservable as resizeObservable,
    index_resolveEl as resolveEl,
    index_rx as rx,
    index_themeChangeObservable as themeChangeObservable,
    index_windowResize as windowResize,
  };
}

export { reconcileChildren as A, pointerVisualise as B, CanvasResizeArgs as C, DragDrop as D, ElementResizeArgs as E, defaultErrorHandler as F, LogOpts as L, Opts as O, PluckOpts as P, Rx as R, TransformOpts as T, Log as a, DomRxOpts as b, CanvasOpts as c, canvasHelper as d, fullSizeCanvas as e, fullSizeElement as f, cycleCssClass as g, getTranslation as h, index as i, parentSizeCanvas as j, resolveEl as k, log as l, createAfter as m, createIn as n, dataTableList as o, parentSize as p, DataFormatter as q, rx as r, DataTableOpts as s, dataTable as t, clear as u, themeChangeObservable as v, windowResize as w, resizeObservable as x, copyToClipboard as y, CreateUpdateElement as z };