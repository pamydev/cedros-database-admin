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
  * @param {any} [elements.data]  
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
    style="${props?.style || ""}"
    ${props?.data || ""}>
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
export class $span extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} elements
  * @param {any} [elements.class]  
  * @param {any} elements.content  
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
   `span-win-${this.identifier}`, elements,
   options, $span);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <span id="span-win-${this.identifier}" class="${props?.class || ""}">${props?.content || ""}</span>
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
    span: `span-win-${this.identifier}`,
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
export class $codeEditor extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {any} [elements.oninput]  
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
   `codeEditor-win-${this.identifier}`,
   elements, options, $codeEditor);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <div id="codeEditor-win-${this.identifier}" class="code-editor-container">
    <pre       id="contentEditable-win-${this.identifier}"
      class="code-editor"
      contenteditable="true"
      oninput="${props?.oninput || ""}"
      style="${props?.style || ""}"></pre>
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
    codeEditor: `codeEditor-win-${this.identifier}`,
    contentEditable: `contentEditable-win-${this.identifier}`,
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
export class $select extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
  * @param {any} [elements.class]  
  * @param {any} [elements.onchange]  
  * @param {any} [elements.style]  
  * @param {any} [elements.options]  
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
   `select-win-${this.identifier}`, elements,
   options, $select);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <select     id="select-win-${this.identifier}"
    class="${props?.class || ""}"
    onchange="${props?.onchange || ""}"
    style="${props?.style || ""}">
    ${props?.options || ""}
  </select>
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
    select: `select-win-${this.identifier}`,
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
export class $option extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} elements
  * @param {any} [elements.value]  
  * @param {any} [elements.class]  
  * @param {any} elements.content  
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
   `option-win-${this.identifier}`, elements,
   options, $option);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <option id="option-win-${this.identifier}" value="${props?.value || ""}" class="${props?.class || ""}">
    ${props?.content || ""}
  </option>
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
    option: `option-win-${this.identifier}`,
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
export class $table extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
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
   `table-win-${this.identifier}`, elements,
   options, $table);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <table id="table-win-${this.identifier}">
    <thead>
      <tr id="thead_tr_output-win-${this.identifier}"></tr>
    </thead>
    <tbody id="tbody_output-win-${this.identifier}"></tbody>
  </table>
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
    table: `table-win-${this.identifier}`,
    thead_tr_output: `thead_tr_output-win-${this.identifier}`,
    tbody_output: `tbody_output-win-${this.identifier}`,
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
export class $tr extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} [elements]
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
   `tr-win-${this.identifier}`, elements,
   options, $tr);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <tr id="tr-win-${this.identifier}"></tr>
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
    tr: `tr-win-${this.identifier}`,
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
export class $th extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} elements
  * @param {'col'|'row'} [elements.scope]  
  * @param {any} elements.content  
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
   `th-win-${this.identifier}`, elements,
   options, $th);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <th id="th-win-${this.identifier}" scope="${props?.scope || ""}">${props?.content || ""}</th>
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
    th: `th-win-${this.identifier}`,
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
export class $td extends Constructos {
 // ========================================
 /**
  * 
  * @param {object} elements
  * @param {any} elements.content  
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
   `td-win-${this.identifier}`, elements,
   options, $td);
 }
 /**
  * Generate the HTML code for this constructo
  * @param {*} props - The properties object containing all prop values
  * @returns {string} The HTML template string with interpolated values
  * @protected
  */
 code (props) {
  return `
  <td id="td-win-${this.identifier}">${props?.content || ""}</td>
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
    td: `td-win-${this.identifier}`,
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
