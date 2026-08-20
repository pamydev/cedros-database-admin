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
export class $inputForm extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {any} [elements.label]  
  * @param {any} [elements.description]  
  * @param {any} [elements.type]  
  * @param {any} [elements.placeholder]  
  * @param {any} [elements.value]  
  * @param {any} [elements.onchange]  
  * @param {any} [elements.required]  
  * @param {any} [elements.style]  
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
   `inputForm-win-${this.identifier}`, elements,
   options, $inputForm);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <form onsubmit="return false;" id="inputForm-win-${this.identifier}">
    <label for="input-win-${this.identifier}">
      ${props?.label || ""}
      <span class="__description-text">${props?.description || ""}</span>
    </label>

    <input       id="input-win-${this.identifier}"
      type="${props?.type || ""}"
      placeholder="${props?.placeholder || ""}"
      value="${props?.value || ""}"
      onchange="${props?.onchange || ""}"
      required="${props?.required || ""}"
      style="${props?.style || ""}" >
  </form>
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
    inputForm: `inputForm-win-${this.identifier}`,
    input: `input-win-${this.identifier}`,
    input: `input-win-${this.identifier}`,
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
export class $textareaForm extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {any} [elements.label]  
  * @param {any} [elements.description]  
  * @param {any} [elements.placeholder]  
  * @param {any} [elements.onchange]  
  * @param {any} [elements.required]  
  * @param {any} [elements.style]  
  * @param {any} [elements.value]  
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
   `textareaForm-win-${this.identifier}`,
   elements, options, $textareaForm);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <form onsubmit="return false;" id="textareaForm-win-${this.identifier}">
    <label for="textarea-win-${this.identifier}">
      ${props?.label || ""}
      <span class="__description-text">${props?.description || ""}</span>
    </label>

    <textarea       id="textarea-win-${this.identifier}"
      placeholder="${props?.placeholder || ""}"
      onchange="${props?.onchange || ""}"
      required="${props?.required || ""}"
      style="${props?.style || ""}">
${props?.value || ""}</textarea>
  </form>
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
    textareaForm: `textareaForm-win-${this.identifier}`,
    textarea: `textarea-win-${this.identifier}`,
    textarea: `textarea-win-${this.identifier}`,
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
export class $fileForm extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {any} [elements.label]  
  * @param {any} [elements.description]  
  * @param {any} [elements.onchange]  
  * @param {any} [elements.required]  
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
   `fileForm-win-${this.identifier}`, elements,
   options, $fileForm);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <form onsubmit="return false;" id="fileForm-win-${this.identifier}">
    <label for="file-win-${this.identifier}">
      ${props?.label || ""}
      <span class="__description-text">${props?.description || ""}</span>
    </label>

    <div       class="input-file-div"
      onclick="document.getElementById('file-win-${this.identifier}').click()">
      <span>Choose File</span>
      <span id="resourceName-win-${this.identifier}"></span>
    </div>

    <input       id="file-win-${this.identifier}"
      type="file"
      onchange="let fileName = document.getElementById('file-win-${this.identifier}').files[0]?.name; document.getElementById('resourceName-win-${this.identifier}').innerText = fileName ? fileName : ''; ${props?.onchange || ""}"
      required="${props?.required || ""}"
      style="display: none" >
  </form>
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
    fileForm: `fileForm-win-${this.identifier}`,
    file: `file-win-${this.identifier}`,
    file: `file-win-${this.identifier}`,
    resourceName: `resourceName-win-${this.identifier}`,
    file: `file-win-${this.identifier}`,
    file: `file-win-${this.identifier}`,
    resourceName: `resourceName-win-${this.identifier}`,
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
export class $backgroundImage extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {any} [elements.class]  
  * @param {any} [elements.imageUrl]  
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
   `backgroundImage-win-${this.identifier}`,
   elements, options, $backgroundImage);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <div     id="backgroundImage-win-${this.identifier}"
    class="background-image ${props?.class || ""}"
    style="background-image: url('${props?.imageUrl || ""}'); ${props?.style || ""}">
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
    backgroundImage: `backgroundImage-win-${this.identifier}`,
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
export class $image extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {any} [elements.src]  
  * @param {any} [elements.alt]  
  * @param {any} [elements.style]  
  * @param {any} [elements.class]  
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
   `image-win-${this.identifier}`, elements,
   options, $image);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <img     id="image-win-${this.identifier}"
    src="${props?.src || ""}"
    alt="${props?.alt || ""}"
    style="${props?.style || ""}"
    class="${props?.class || ""}" >
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
    image: `image-win-${this.identifier}`,
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
