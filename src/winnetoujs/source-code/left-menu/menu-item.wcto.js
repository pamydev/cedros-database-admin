import {
 Constructos
} from "winnetoujs/core/constructos";
export class $menuItem extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} elements
  * @param {string} elements.ariaLabel  
  * @param {string} elements.onclick  
  * @param {string} elements.icon  
  * @param {string} elements.label  
  * @param {object} [options]
  * @param {string} [options.identifier]
  */
 constructor (elements, options) {
  super();
  /**@protected */
  this.identifier = this._getIdentifier(options ?
   options.identifier || "notSet" : "notSet");
  const digestedPropsToString = this
   ._mutableToString(elements);
  /**@protected */
  this.component = this.code(
   digestedPropsToString);
  this._saveUsingMutable(
   `menuItem-win-${this.identifier}`, elements,
   options, $menuItem);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <button     id="menuItem-win-${this.identifier}"
    class="left-menu__item"
    type="button"
    aria-label="${props?.ariaLabel || ""}"
    onclick="${props?.onclick || ""}">
    <span class="left-menu__icon" aria-hidden="true">${props?.icon || ""}</span>
    <span class="left-menu__label">${props?.label || ""}</span>
  </button>
`;
 }
 /**
  * Create Winnetou Constructo
  * @param  {string} output The string id where constructo will be placed. It is a query selector type
  * @param  {object} [options] Options to control how the construct is inserted. Optional.
  * @param  {boolean} [options.clear] Clean the node before inserting the construct
  * @param  {boolean} [options.reverse] Place the construct in front of other constructs
  */
 create (output, options) {
  this.attachToDOM(this.component, output,
   options);
  return {
   ids: {
    menuItem: `menuItem-win-${this.identifier}`,
   },
  };
 }
 /**
  * Get the constructo as a string
  * @returns {string} The component HTML string
  */
 constructoString () {
  return this.component;
 }
}
