import {
 Constructos
} from "winnetoujs/core/constructos";
export class $div extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {any} [elements.class]  
  * @param {any} [elements.onclick]  
  * @param {any} [elements.style]  
  * @param {any} [elements.content]  
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
   `div-win-${this.identifier}`, elements,
   options, $div);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <div     id="div-win-${this.identifier}"
    class="${props?.class || ""}"
    onclick="${props?.onclick || ""}"
    style="${props?.style || ""}">
    ${props?.content || ""}
  </div>
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
    div: `div-win-${this.identifier}`,
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
export class $buttonPrimary extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {any} [elements.onclick]  
  * @param {any} [elements.style]  
  * @param {any} [elements.icon]  
  * @param {any} [elements.content]  
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
   `buttonPrimary-win-${this.identifier}`,
   elements, options, $buttonPrimary);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <button     id="buttonPrimary-win-${this.identifier}"
    class="primary"
    onclick="${props?.onclick || ""}"
    style="${props?.style || ""}">
    ${props?.icon || ""} ${props?.content || ""}
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
    buttonPrimary: `buttonPrimary-win-${this.identifier}`,
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
export class $buttonSecondary extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {any} [elements.onclick]  
  * @param {any} [elements.style]  
  * @param {any} [elements.icon]  
  * @param {any} [elements.content]  
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
   `buttonSecondary-win-${this.identifier}`,
   elements, options, $buttonSecondary);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <button     id="buttonSecondary-win-${this.identifier}"
    class="secondary"
    onclick="${props?.onclick || ""}"
    style="${props?.style || ""}">
    ${props?.icon || ""} ${props?.content || ""}
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
    buttonSecondary: `buttonSecondary-win-${this.identifier}`,
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
