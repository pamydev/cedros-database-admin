// node_modules/winnetoujs/dist/core/winnetou.js
var Winnetou_ = class {
  constructor() {
    this.constructoId = 0;
    this.mutable = {};
    this.usingMutable = {};
    this.storedEvents = [];
    this.strings = {};
    this.observer = null;
    this.mutations = {
      start: () => {
        if (this.observer) return false;
        this.observer = new MutationObserver(
          (mutationsArray) => {
            try {
              mutationsArray.forEach((mutationRecord) => {
                mutationRecord.removedNodes.forEach((removedNode) => {
                  const removedId = removedNode instanceof Element ? removedNode.id : null;
                  const appElement2 = document.getElementById("app");
                  if (appElement2) {
                    appElement2.dispatchEvent(
                      new CustomEvent("constructoRemoved", {
                        detail: { removedId }
                      })
                    );
                  }
                });
              });
            } catch (e) {
            }
          }
        );
        this.observer.disconnect();
        const appElement = document.getElementById("app");
        if (appElement) {
          this.observer.observe(appElement, {
            childList: true,
            subtree: true
          });
        }
        return true;
      },
      onRemove: (id, callback) => {
        const controller = new AbortController();
        const signal = controller.signal;
        const appElement = document.getElementById("app");
        if (appElement) {
          appElement.addEventListener(
            "constructoRemoved",
            (data) => {
              if (data instanceof CustomEvent) {
                if (id === data.detail.removedId) {
                  callback();
                  controller.abort();
                }
              }
            },
            {
              signal
            }
          );
        }
        return true;
      },
      destroy: () => {
        setTimeout(() => {
          if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
          }
        }, 100);
      }
    };
  }
  setMutable(mutable, value, localStorage) {
    if (localStorage !== false && localStorage !== "notPersistent") {
      window.localStorage.setItem(`mutable_${mutable}`, value);
    }
    if (localStorage === false || localStorage === "notPersistent") {
      this.mutable[mutable] = value;
    }
    if (this.usingMutable[mutable]) {
      const tmpArr = this.usingMutable[mutable];
      this.usingMutable[mutable] = [];
      tmpArr.forEach((item) => {
        const old_ = document.getElementById(item.pureId);
        if (old_ == null) return;
        const new_ = document.createRange().createContextualFragment(
          new item.method(item.elements, item.options).constructoString()
        );
        this.replace(new_, old_);
      });
    }
  }
  initMutable(value) {
    const name = ((/* @__PURE__ */ new Date()).getMilliseconds() * Math.random() * 1e4).toFixed(
      0
    );
    this.setMutable(name, value, "notPersistent");
    return name;
  }
  setMutableNotPersistent(mutable, value) {
    this.setMutable(mutable, value, "notPersistent");
  }
  getMutable(mutable) {
    if (window.localStorage.getItem(`mutable_${mutable}`) || window.localStorage.getItem(`mutable_${mutable}`) === "") {
      return window.localStorage.getItem(`mutable_${mutable}`);
    } else if (this.mutable[mutable] || this.mutable[mutable] === "") {
      return this.mutable[mutable];
    } else {
      return null;
    }
  }
  replace(new_, old_) {
    if (old_ && old_.parentNode) {
      const ele_ = old_.parentNode;
      ele_.replaceChild(new_, old_);
    }
  }
  fx(function_, ...args) {
    const name = "winnetouFx" + ((/* @__PURE__ */ new Date()).getMilliseconds() * Math.random() * 1e4).toFixed(0);
    window[name] = function_;
    return `${name}(${args.map((x) => x === "this" ? `this` : `'${x}'`).join(",")})`;
  }
};
var Winnetou = new Winnetou_();
var W = Winnetou;

// node_modules/winnetoujs/dist/core/constructos.js
var Constructos = class {
  _mutableToString(constructoProps) {
    if (constructoProps) {
      let jsonElements = JSON.parse(JSON.stringify(constructoProps));
      Object.keys(constructoProps).forEach((item) => {
        if (typeof constructoProps[item] === "object" && constructoProps[item] !== null) {
          let mutable = constructoProps[item].mutable;
          let val;
          Winnetou.getMutable(mutable) || Winnetou.getMutable(mutable) === "" ? val = Winnetou.getMutable(mutable) : val = `Mutable "${mutable}" not initialized yet.`;
          jsonElements[item] = val;
        }
      });
      return jsonElements;
    } else {
      return constructoProps;
    }
  }
  _saveUsingMutable(pureId, elements, options, method) {
    if (elements) {
      Object.keys(elements).forEach((item) => {
        if (typeof elements[item] === "object" && elements[item] !== null) {
          if (!Winnetou.usingMutable[elements[item].mutable])
            Winnetou.usingMutable[elements[item].mutable] = [];
          let obj = {
            pureId,
            elements,
            options,
            method
          };
          if (Winnetou.usingMutable[elements[item].mutable].filter(
            (x) => x.pureId == pureId
          ).length > 0) {
          } else {
            Winnetou.usingMutable[elements[item].mutable].push(obj);
          }
        }
      });
    }
    if (options) {
      Object.keys(options).forEach((item) => {
        if (typeof options[item] === "object" && options[item] !== null) {
          if (!Winnetou.usingMutable[options[item].mutable])
            Winnetou.usingMutable[options[item].mutable] = [];
          let obj = {
            pureId,
            elements,
            options,
            method
          };
          if (Winnetou.usingMutable[options[item].mutable].filter(
            (x) => x.pureId == pureId
          ).length > 0) {
          } else {
            Winnetou.usingMutable[options[item].mutable].push(obj);
          }
        }
      });
    }
  }
  _getIdentifier(identifier) {
    if (identifier != "notSet") return identifier;
    else
      return Math.floor(Math.random() * 1e4) + "-" + Math.floor(Math.random() * 1e4);
  }
  /**
   * Attach a component to the DOM
   * @param component The component HTML string
   * @param output Id of element. It is query selector one.
   * @param options Options to control how the construct is inserted. Optional.
   * @protected
   */
  attachToDOM(component, output, options = {}) {
    const isTableElement = component.match(
      /^\s*?<tr|^\s*?<td|^\s*?<table|^\s*?<th|^\s*?<tbody|^\s*?<thead|^\s*?<tfoot/
    );
    function handleTableElements() {
      let el = document.querySelectorAll(output);
      if (el.length === 0) {
        el = document.querySelectorAll("#" + output);
      }
      el.forEach((item) => {
        if (options.clear) item.innerHTML = "";
        if (options.reverse) {
          item.innerHTML = component + item.innerHTML;
        } else {
          item.innerHTML += component;
        }
      });
    }
    function handleNormalElements() {
      const frag = document.createRange().createContextualFragment(component);
      let el = document.querySelectorAll(output);
      if (el.length === 0) el = document.querySelectorAll("#" + output);
      el.forEach((item) => {
        if (options.clear) item.innerHTML = "";
        if (options.reverse) {
          item.prepend(frag);
        } else {
          item.appendChild(frag);
        }
      });
    }
    if (isTableElement) {
      handleTableElements();
    } else {
      handleNormalElements();
    }
  }
};

// source-code/common/common.wcto.js
var $div = class _$div extends Constructos {
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
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `div-win-${this.identifier}`,
      elements,
      options,
      _$div
    );
  }
  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return `
  <div     id="div-win-${this.identifier}"
    class="${(props == null ? void 0 : props.class) || ""}"
    onclick="${(props == null ? void 0 : props.onclick) || ""}"
    style="${(props == null ? void 0 : props.style) || ""}">
    ${(props == null ? void 0 : props.content) || ""}
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        div: `div-win-${this.identifier}`
      }
    };
  }
  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
};
var $buttonPrimary = class _$buttonPrimary extends Constructos {
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
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `buttonPrimary-win-${this.identifier}`,
      elements,
      options,
      _$buttonPrimary
    );
  }
  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return `
  <button     id="buttonPrimary-win-${this.identifier}"
    class="primary"
    onclick="${(props == null ? void 0 : props.onclick) || ""}"
    style="${(props == null ? void 0 : props.style) || ""}">
    ${(props == null ? void 0 : props.icon) || ""} ${(props == null ? void 0 : props.content) || ""}
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        buttonPrimary: `buttonPrimary-win-${this.identifier}`
      }
    };
  }
  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
};
var $inputForm = class _$inputForm extends Constructos {
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
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `inputForm-win-${this.identifier}`,
      elements,
      options,
      _$inputForm
    );
  }
  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return `
  <form onsubmit="return false;" id="inputForm-win-${this.identifier}">
    <label for="input-win-${this.identifier}">
      ${(props == null ? void 0 : props.label) || ""}
      <span class="__description-text">${(props == null ? void 0 : props.description) || ""}</span>
    </label>

    <input       id="input-win-${this.identifier}"
      type="${(props == null ? void 0 : props.type) || ""}"
      placeholder="${(props == null ? void 0 : props.placeholder) || ""}"
      value="${(props == null ? void 0 : props.value) || ""}"
      onchange="${(props == null ? void 0 : props.onchange) || ""}"
      required="${(props == null ? void 0 : props.required) || ""}"
      style="${(props == null ? void 0 : props.style) || ""}" >
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        inputForm: `inputForm-win-${this.identifier}`,
        input: `input-win-${this.identifier}`,
        input: `input-win-${this.identifier}`
      }
    };
  }
  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
};
var $textareaForm = class _$textareaForm extends Constructos {
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
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `textareaForm-win-${this.identifier}`,
      elements,
      options,
      _$textareaForm
    );
  }
  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return `
  <form onsubmit="return false;" id="textareaForm-win-${this.identifier}">
    <label for="textarea-win-${this.identifier}">
      ${(props == null ? void 0 : props.label) || ""}
      <span class="__description-text">${(props == null ? void 0 : props.description) || ""}</span>
    </label>

    <textarea       id="textarea-win-${this.identifier}"
      placeholder="${(props == null ? void 0 : props.placeholder) || ""}"
      onchange="${(props == null ? void 0 : props.onchange) || ""}"
      required="${(props == null ? void 0 : props.required) || ""}"
      style="${(props == null ? void 0 : props.style) || ""}">
${(props == null ? void 0 : props.value) || ""}</textarea>
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        textareaForm: `textareaForm-win-${this.identifier}`,
        textarea: `textarea-win-${this.identifier}`,
        textarea: `textarea-win-${this.identifier}`
      }
    };
  }
  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
};
var $fileForm = class _$fileForm extends Constructos {
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
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `fileForm-win-${this.identifier}`,
      elements,
      options,
      _$fileForm
    );
  }
  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return `
  <form onsubmit="return false;" id="fileForm-win-${this.identifier}">
    <label for="file-win-${this.identifier}">
      ${(props == null ? void 0 : props.label) || ""}
      <span class="__description-text">${(props == null ? void 0 : props.description) || ""}</span>
    </label>

    <div       class="input-file-div"
      onclick="document.getElementById('file-win-${this.identifier}').click()">
      <span>Choose File</span>
      <span id="resourceName-win-${this.identifier}"></span>
    </div>

    <input       id="file-win-${this.identifier}"
      type="file"
      onchange="let fileName = document.getElementById('file-win-${this.identifier}').files[0]?.name; document.getElementById('resourceName-win-${this.identifier}').innerText = fileName ? fileName : ''; ${(props == null ? void 0 : props.onchange) || ""}"
      required="${(props == null ? void 0 : props.required) || ""}"
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        fileForm: `fileForm-win-${this.identifier}`,
        file: `file-win-${this.identifier}`,
        file: `file-win-${this.identifier}`,
        resourceName: `resourceName-win-${this.identifier}`,
        file: `file-win-${this.identifier}`,
        file: `file-win-${this.identifier}`,
        resourceName: `resourceName-win-${this.identifier}`
      }
    };
  }
  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
};
var $backgroundImage = class _$backgroundImage extends Constructos {
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
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `backgroundImage-win-${this.identifier}`,
      elements,
      options,
      _$backgroundImage
    );
  }
  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return `
  <div     id="backgroundImage-win-${this.identifier}"
    class="background-image ${(props == null ? void 0 : props.class) || ""}"
    style="background-image: url('${(props == null ? void 0 : props.imageUrl) || ""}'); ${(props == null ? void 0 : props.style) || ""}">
    ${(props == null ? void 0 : props.content) || ""}
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        backgroundImage: `backgroundImage-win-${this.identifier}`
      }
    };
  }
  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
};
var $image = class _$image extends Constructos {
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
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `image-win-${this.identifier}`,
      elements,
      options,
      _$image
    );
  }
  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return `
  <img     id="image-win-${this.identifier}"
    src="${(props == null ? void 0 : props.src) || ""}"
    alt="${(props == null ? void 0 : props.alt) || ""}"
    style="${(props == null ? void 0 : props.style) || ""}"
    class="${(props == null ? void 0 : props.class) || ""}" >
`;
  }
  /**
   * Create Winnetou Constructo
   * @param  {string} output The string id where constructo will be placed. It is a query selector type
   * @param  {object} [options] Options to control how the construct is inserted. Optional.
   * @param  {boolean} [options.clear] Clean the node before inserting the construct
   * @param  {boolean} [options.reverse] Place the construct in front of other constructs
   */
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        image: `image-win-${this.identifier}`
      }
    };
  }
  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
};

// ../../node_modules/lucide/dist/esm/defaultAttributes.mjs
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};

// ../../node_modules/lucide/dist/esm/createElement.mjs
var createSVGElement = ([tag, attrs, children]) => {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
  Object.keys(attrs).forEach((name) => {
    element.setAttribute(name, String(attrs[name]));
  });
  if (children == null ? void 0 : children.length) {
    children.forEach((child) => {
      const childElement = createSVGElement(child);
      element.appendChild(childElement);
    });
  }
  return element;
};
var createElement = (iconNode, customAttrs = {}) => {
  const tag = "svg";
  const attrs = {
    ...defaultAttributes,
    ...customAttrs
  };
  return createSVGElement([tag, attrs, iconNode]);
};

// ../../node_modules/lucide/dist/esm/icons/check.mjs
var Check = [["path", { d: "M20 6 9 17l-5-5" }]];

// ../../node_modules/lucide/dist/esm/icons/chevron-left.mjs
var ChevronLeft = [["path", { d: "m15 18-6-6 6-6" }]];

// ../../node_modules/lucide/dist/esm/icons/chevron-right.mjs
var ChevronRight = [["path", { d: "m9 18 6-6-6-6" }]];

// ../../node_modules/lucide/dist/esm/icons/clipboard-pen-line.mjs
var ClipboardPenLine = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 1.73 1" }],
  ["path", { d: "M8 18h1" }],
  [
    "path",
    {
      d: "M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ]
];

// ../../node_modules/lucide/dist/esm/icons/folder-kanban.mjs
var FolderKanban = [
  [
    "path",
    {
      d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"
    }
  ],
  ["path", { d: "M8 10v4" }],
  ["path", { d: "M12 10v2" }],
  ["path", { d: "M16 10v6" }]
];

// ../../node_modules/lucide/dist/esm/icons/info.mjs
var Info = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 16v-4" }],
  ["path", { d: "M12 8h.01" }]
];

// ../../node_modules/lucide/dist/esm/icons/logs.mjs
var Logs = [
  ["path", { d: "M3 5h1" }],
  ["path", { d: "M3 12h1" }],
  ["path", { d: "M3 19h1" }],
  ["path", { d: "M8 5h1" }],
  ["path", { d: "M8 12h1" }],
  ["path", { d: "M8 19h1" }],
  ["path", { d: "M13 5h8" }],
  ["path", { d: "M13 12h8" }],
  ["path", { d: "M13 19h8" }]
];

// ../../node_modules/lucide/dist/esm/icons/plus.mjs
var Plus = [
  ["path", { d: "M5 12h14" }],
  ["path", { d: "M12 5v14" }]
];

// ../../node_modules/lucide/dist/esm/icons/power.mjs
var Power = [
  ["path", { d: "M12 2v10" }],
  ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04" }]
];

// ../../node_modules/lucide/dist/esm/icons/settings.mjs
var Settings = [
  [
    "path",
    {
      d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3" }]
];

// source-code/left-menu/menu-item.wcto.js
var $menuItem = class _$menuItem extends Constructos {
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
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `menuItem-win-${this.identifier}`,
      elements,
      options,
      _$menuItem
    );
  }
  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return `
  <button     id="menuItem-win-${this.identifier}"
    class="left-menu__item"
    type="button"
    aria-label="${(props == null ? void 0 : props.ariaLabel) || ""}"
    onclick="${(props == null ? void 0 : props.onclick) || ""}">
    ${(props == null ? void 0 : props.icon) || ""}
    <span class="left-menu__label">${(props == null ? void 0 : props.label) || ""}</span>
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        menuItem: `menuItem-win-${this.identifier}`
      }
    };
  }
  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
};
var $menuSeparator = class _$menuSeparator extends Constructos {
  // ========================================
  /**
   * 
   * @param {object} [elements]
   * @param {object} [options]
   * @param {string} [options.identifier]
   */
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `menuSeparator-win-${this.identifier}`,
      elements,
      options,
      _$menuSeparator
    );
  }
  /**
   * Generate the HTML code for this constructo
   * @param {*} props - The properties object containing all prop values
   * @returns {string} The HTML template string with interpolated values
   * @protected
   */
  code(props) {
    return `
  <div id="menuSeparator-win-${this.identifier}" class="__separator"></div>
`;
  }
  /**
   * Create Winnetou Constructo
   * @param  {string} output The string id where constructo will be placed. It is a query selector type
   * @param  {object} [options] Options to control how the construct is inserted. Optional.
   * @param  {boolean} [options.clear] Clean the node before inserting the construct
   * @param  {boolean} [options.reverse] Place the construct in front of other constructs
   */
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        menuSeparator: `menuSeparator-win-${this.identifier}`
      }
    };
  }
  /**
   * Get the constructo as a string
   * @returns {string} The component HTML string
   */
  constructoString() {
    return this.component;
  }
};

// source-code/helpers/icons.helper.ts
var createIcon = (icon, simple) => {
  return new $div({
    class: simple ? "__simpleIcon__" : "__icon__",
    content: createElement(icon).outerHTML
  }).constructoString();
};

// node_modules/winnetoujs/dist/modules/router.js
var WinnetouRouter_ = class {
  constructor() {
    this.routes = {};
    this.paramRoutes = [];
    this.routesOptions = {};
    this.addListeners();
  }
  addListeners() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" || event.which === 27) {
        history.go(-1);
      }
    });
    if (window.history) {
      window.onpopstate = (event) => {
        var _a;
        event.preventDefault();
        if (event.state == null) {
          if (this.routes["/"]) {
            this.routes["/"]();
          } else {
            console.error(
              `WinnetouJs Error, id: CR00a67
Default route "/" is not defined. Please define a default route.`
            );
          }
        } else {
          try {
            this.callRoute(event.state);
          } catch (e) {
            console.error(
              `WinnetouJs Error, id: CR002
Given route is not available "${event.state}". Please verify given route. Original Error: ${e}`
            );
          }
        }
        if ((_a = this.routesOptions) == null ? void 0 : _a.onBack) {
          try {
            this.routesOptions.onBack(event.state || "/");
          } catch (e) {
            console.error(
              `Winnetou Error, id: CR001
The onBack option in createRoutes() is not valid. Please use a function. 

Original Error: `,
              e
            );
          }
        }
      };
    }
  }
  createRoutes(obj, options) {
    this.routes = obj;
    this.routesOptions = options || {};
    Object.keys(this.routes).forEach((route) => {
      const segment = route.split("/");
      const size = segment.length;
      this.paramRoutes.push({
        root: route,
        size
      });
    });
  }
  navigate(url, pushState = true) {
    var _a;
    if (window.history) {
      this.callRoute(url);
      pushState && this.pushState(url);
      if ((_a = this.routesOptions) == null ? void 0 : _a.onGo) {
        try {
          this.routesOptions.onGo(url || "/");
        } catch (e) {
          console.error(
            `Winnetou Error, id: CR001
The onGo option in createRoutes() is not valid. Please use a function. 

Original Error: `,
            e
          );
        }
      }
    }
  }
  pass(route) {
    var _a;
    if (window.history) {
      this.callRoute(route);
      this.pushStateInteraction(route);
      if ((_a = this.routesOptions) == null ? void 0 : _a.onGo) {
        try {
          this.routesOptions.onGo(route || "/");
        } catch (e) {
          console.error(
            `Winnetou Error, id: CR001
The onGo option in createRoutes() is not valid. Please use a function. 

Original Error: `,
            e
          );
        }
      }
    }
  }
  pushStateInteraction(func) {
    history.pushState(func, "");
  }
  callRoute(url) {
    try {
      const splittedUrl = url.split("/");
      const size = splittedUrl.length;
      const filter = this.paramRoutes.filter((data) => data.size === size);
      if (filter.length === 0) {
        this.notFound();
      }
      for (let i = 0; i < filter.length; i++) {
        const root = filter[i].root.split("/");
        let correctMatch = true;
        const paramStore = [];
        for (let j = 0; j < root.length; j++) {
          if (root[j] !== splittedUrl[j]) {
            correctMatch = false;
            if (root[j].includes(":")) {
              correctMatch = true;
              paramStore.push(splittedUrl[j]);
            } else {
              correctMatch = false;
              break;
            }
          }
        }
        if (correctMatch) {
          this.routes[filter[i].root](...paramStore);
          return;
        } else if (i === filter.length - 1) {
          this.notFound();
        }
      }
    } catch (e) {
      console.log(e);
      this.notFound();
    }
  }
  notFound() {
    try {
      this.routes["/404"]();
    } catch (e) {
      document.body.innerHTML = `<p onclick="Winnetou.select('.winnetouNotFoundDefault').hide()" style="width:100%;padding:15px;color:white;background-color:red;cursor:pointer;" class='winnetouNotFoundDefault'>Page not found. Click to close.</p>` + document.body.innerHTML;
    }
  }
  pushState(url) {
    try {
      history.pushState(url, "", url);
    } catch (e) {
      history.pushState(url, "");
    }
  }
};
var Router = new WinnetouRouter_();

// source-code/screens/screen.ts
var Screen = class {
  render(args0) {
    throw new Error("Method not implemented.");
  }
  buildScreen(args0) {
    if (this.exists(args0.identifier)) return "exists";
    const output = new $div(
      {
        class: "screen"
      },
      { identifier: args0.identifier }
    ).create("#app").ids.div;
    this.createScreenHeader({
      output,
      title: args0.title,
      titleImg: args0.titleImg
    });
    const content = this.createScreenContent({
      output
    });
    return content;
  }
  exists(identifier) {
    var _a;
    const el = `div-win-${identifier}`;
    const exists = document.getElementById(el) !== null;
    if (exists) {
      (_a = document.getElementById(el)) == null ? void 0 : _a.style.setProperty("display", "block");
    }
    return exists;
  }
  createScreenHeader(args0) {
    const header = new $div({
      class: "screen-header"
    }).create(args0.output).ids.div;
    const leftDiv = new $div({
      class: "__left"
    }).create(header).ids.div;
    const rightDiv = new $div({
      class: "__right"
    }).create(header).ids.div;
    const navigation = new $div({
      class: "__navigation"
    }).create(leftDiv).ids.div;
    new $div({
      class: "__icon __icon-left",
      onclick: W.fx(() => {
        window.history.back();
      }),
      content: createElement(ChevronLeft, { size: 17, strokeWidth: 2.2 }).outerHTML
    }).create(navigation);
    new $div({
      class: "__icon-separator",
      content: " "
    }).create(navigation);
    new $div({
      class: "__icon __icon-right",
      onclick: W.fx(() => {
        window.history.forward();
      }),
      content: createElement(ChevronRight, { size: 17, strokeWidth: 2.2 }).outerHTML
    }).create(navigation);
    new $div({
      class: "__title",
      content: args0.title
    }).create(leftDiv);
    if (args0.titleImg) {
      new $image({
        src: args0.titleImg,
        class: "__title-img"
      }).create(rightDiv);
    }
  }
  createScreenContent(args0) {
    const content = new $div({
      class: "screen-content"
    }).create(args0.output).ids.div;
    return content;
  }
};

// source-code/helpers/listItem.helper.ts
var listItem = (args0) => {
  const output = new $div({
    class: "LIST-ITEM",
    onclick: args0.onclick
  }).create(args0.output).ids.div;
  const leftDiv = new $div({
    class: "LEFT"
  }).create(output).ids.div;
  if (args0.icon) {
    new $div({
      class: "ICON",
      content: createIcon(args0.icon, false)
    }).create(leftDiv);
  } else if (args0.imageURL) {
    new $backgroundImage({
      imageUrl: args0.imageURL,
      class: "IMAGE-ICON"
    }).create(leftDiv);
  }
  const label = new $div({
    class: "LABEL"
  }).create(leftDiv).ids.div;
  new $div({
    content: args0.label,
    class: "LABEL-TEXT"
  }).create(label);
  if (args0.subLabel) {
    new $div({
      content: args0.subLabel,
      class: "SUB-LABEL-TEXT"
    }).create(label);
  }
  const rightDiv = new $div({
    class: "RIGHT"
  }).create(output).ids.div;
  if (args0.chevronRight !== false) {
    new $div({
      class: "CHEVRON-RIGHT",
      content: createIcon(ChevronRight, true)
    }).create(rightDiv);
  }
};

// source-code/screens/select-project/select-project.ts
var SelectProjectScreen = class extends Screen {
  output;
  render() {
    const output = this.buildScreen({
      output: "screen",
      title: "Select Project",
      identifier: "select-project"
    });
    if (output === "exists") return;
    this.output = output;
    this.loadProjects();
  }
  async loadProjects(reload) {
    if (reload === "reload") {
      const el = document.getElementById(this.output);
      if (el) {
        el.innerHTML = "";
      }
    }
    const projects = await window.database.loadProjects();
    const output = new $div({
      class: "PANEL"
    }).create(this.output).ids.div;
    console.log(`printed output in ${this.output}`);
    projects.forEach((project) => this.printProject(project, output));
  }
  printProject(project, output) {
    const uriProjectName = encodeURIComponent(project.name);
    const imgURL = `images://${uriProjectName}/${project.image}`;
    listItem({
      label: project.name,
      subLabel: project.description,
      chevronRight: true,
      imageURL: imgURL,
      onclick: W.fx(() => {
        appRouter.methods.project_home.go(project._id);
      }),
      output
    });
  }
  emptyProjects() {
    const panel = new $div({
      class: "PANEL",
      content: "No projects available."
    }).create(this.output).ids.div;
    new $buttonPrimary({
      content: createIcon(Plus) + " Create New Project",
      onclick: W.fx(() => {
        manualMenuEffect("add-project");
        appRouter.methods.addProject.go();
      }),
      style: " margin-top: 10px;"
    }).create(panel);
  }
};
var selectProjectScreen = new SelectProjectScreen();

// source-code/screens/new-project/new-project.ts
var NewProjectScreen = class extends Screen {
  output;
  name;
  description;
  file;
  render() {
    const output = this.buildScreen({
      output: "screen",
      title: "New Project",
      identifier: "new-project"
    });
    if (output === "exists") return;
    this.output = output;
    this.createForm();
  }
  createForm() {
    const panel = new $div({
      class: "PANEL"
    }).create(this.output).ids.div;
    this.name = new $inputForm({
      label: "Project Name",
      description: "A project is a container for your database configurations and settings, saved queries, and other related resources.",
      type: "text",
      placeholder: "Enter project name",
      required: true
    }).create(panel).ids.input;
    this.description = new $textareaForm({
      label: "Project Description",
      placeholder: "Enter project description",
      description: "Provide a brief description of the project, its purpose, and any other relevant information.",
      required: false
    }).create(panel).ids.textarea;
    this.file = new $fileForm({
      label: "Project File",
      description: "Upload a project file to import existing configurations and settings.",
      required: false
    }).create(panel).ids.file;
    const divRight = new $div({
      class: "DIV-RIGHT"
    }).create(panel).ids.div;
    new $buttonPrimary({
      content: createIcon(Plus) + " Create Project",
      onclick: W.fx(() => {
        this.send();
      })
    }).create(divRight);
  }
  async send() {
    const name = document.getElementById(this.name).value;
    const description = document.getElementById(this.description).value;
    const fileInput = document.getElementById(this.file);
    const selectedFile = fileInput.files ? fileInput.files[0] : null;
    const file = selectedFile ? {
      name: selectedFile.name,
      type: selectedFile.type,
      data: await selectedFile.arrayBuffer()
    } : null;
    let res = await window.database.createNewProject({
      name,
      description,
      file
    });
    if (res) {
      alert("Project saved");
    }
    appRouter.methods.selectProject.go("reload");
  }
};
var newProjectScreen = new NewProjectScreen();

// source-code/screens/about/about.ts
var AboutScreen = class extends Screen {
  output;
  render() {
    const content = this.buildScreen({
      output: "screen",
      title: "About",
      identifier: "about"
    });
    if (content === "exists") return;
    this.output = content;
    new $div({
      class: "about-screen",
      content: "About Screen Content"
    }).create(content);
  }
};
var aboutScreen = new AboutScreen();

// source-code/helpers/hideScreens.helper.ts
var hideScreens = () => {
  document.querySelectorAll(".screen").forEach((item) => {
    var _a;
    (_a = document.getElementById(item.id)) == null ? void 0 : _a.style.setProperty("display", "none");
  });
};

// source-code/project/addConnection/addConnectionScreen.ts
var AddConnectionScreen = class extends Screen {
  output;
  async render(_id) {
    const project = await window.database.getProjectById(_id);
    const content = this.buildScreen({
      output: "screen",
      title: "Add Connection",
      identifier: "add-connection",
      titleImg: (project == null ? void 0 : project.image) ? `images://${encodeURIComponent(project.name)}/${project.image}` : null
    });
    if (content === "exists") return;
    this.output = new $div({
      class: "PANEL"
    }).create(content).ids.div;
    listItem({
      label: "MongoDB",
      onclick: W.fx(() => {
        appRouter.methods.add_mongo_connection.go(_id);
      }),
      output: this.output
    });
    listItem({
      label: "Redis",
      onclick: "",
      output: this.output
    });
    listItem({
      label: "Cedros Mongify",
      onclick: "",
      output: this.output
    });
  }
};
var addConnectionScreen = new AddConnectionScreen();

// source-code/project/addConnection/mongoConnectionScreen.ts
var MongoConnectionScreen = class extends Screen {
  async render(_id) {
    const project = await window.database.getProjectById(_id);
    const content = this.buildScreen({
      output: "screen",
      title: "Add MongoDB Connection",
      identifier: "mongo-connection",
      titleImg: (project == null ? void 0 : project.image) ? `images://${encodeURIComponent(project.name)}/${project.image}` : null
    });
    if (content === "exists") return;
    const panel = new $div({ class: "PANEL" }).create(content).ids.div;
    new $inputForm({
      label: "Connection Name",
      type: "text",
      placeholder: "Local MongoDB",
      required: true
    }).create(panel);
    new $inputForm({
      label: "MongoDB URI",
      description: "Example: mongodb://localhost:27017",
      type: "text",
      placeholder: "mongodb://localhost:27017",
      required: true
    }).create(panel);
    new $inputForm({
      label: "Username",
      type: "text",
      placeholder: "Optional",
      required: false
    }).create(panel);
    new $inputForm({
      label: "Password",
      type: "password",
      placeholder: "Optional",
      required: false
    }).create(panel);
    new $inputForm({
      label: "Database",
      type: "text",
      placeholder: "Database name",
      required: true
    }).create(panel);
    const actions = new $div({ class: "DIV-RIGHT" }).create(panel).ids.div;
    new $buttonPrimary({
      content: "Save Connection",
      icon: createIcon(Check)
    }).create(actions);
  }
};
var mongoConnectionScreen = new MongoConnectionScreen();

// source-code/project/home/homeScreen.ts
var ProjectHomeScreen = class extends Screen {
  output;
  async render(_id) {
    const project = await window.database.getProjectById(_id);
    const content = this.buildScreen({
      output: "screen",
      title: "Project Home",
      identifier: "project-home",
      titleImg: (project == null ? void 0 : project.image) ? `images://${encodeURIComponent(project.name)}/${project.image}` : null
    });
    if (content === "exists") return;
    this.output = content;
    new $div({
      content: project.name,
      class: "TITLE"
    }).create(content);
    new $div({
      content: project.description,
      class: "SUB-TITLE"
    }).create(content);
  }
};
var projectHomeScreen = new ProjectHomeScreen();

// source-code/router/project.routes.ts
var projectRouter = (routes = {}) => {
  return {
    project_home: {
      go(_id) {
        Router.navigate(`/screen/home/${_id}`);
      },
      set() {
        routes["/screen/home/:_id"] = (_id) => {
          leftMenu2.renderProjectMenu(_id);
          hideScreens();
          manualMenuEffect("home");
          projectHomeScreen.render(_id);
        };
      }
    },
    add_connection: {
      go(_id) {
        Router.navigate(`/screen/add-connection/${_id}`);
      },
      set() {
        routes["/screen/add-connection/:_id"] = (_id) => {
          leftMenu2.renderProjectMenu(_id);
          hideScreens();
          manualMenuEffect("add-connection");
          addConnectionScreen.render(_id);
        };
      }
    },
    add_mongo_connection: {
      go(_id) {
        Router.navigate(`/screen/add-mongo-connection/${_id}`);
      },
      set() {
        routes["/screen/add-mongo-connection/:_id"] = (_id) => {
          hideScreens();
          mongoConnectionScreen.render(_id);
        };
      }
    }
  };
};

// source-code/router/router.ts
var MyRouter = class {
  constructor() {
    this.createRoutes();
  }
  routes = {};
  hideScreens() {
    hideScreens();
  }
  methods = {
    addProject: {
      go: () => Router.navigate("/add-project"),
      set: () => {
        this.routes["/add-project"] = () => {
          leftMenu2.render();
          this.hideScreens();
          manualMenuEffect("add-project");
          newProjectScreen.render();
        };
      }
    },
    selectProject: {
      go: (reload) => Router.navigate(`/select-project/${reload || "null"}`),
      set: () => {
        this.routes["/select-project/:reload"] = (reload) => {
          leftMenu2.render();
          this.hideScreens();
          manualMenuEffect("select-project");
          if (reload === "reload") {
            selectProjectScreen.loadProjects("reload");
          }
          selectProjectScreen.render();
        };
      }
    },
    about: {
      go: () => Router.navigate("/about"),
      set: () => {
        this.routes["/about"] = () => {
          leftMenu2.render();
          this.hideScreens();
          manualMenuEffect("about");
          aboutScreen.render();
        };
      }
    },
    ...projectRouter(this.routes)
  };
  createRoutes() {
    Object.keys(this.methods).forEach((key) => {
      this.methods[key].set();
    });
    Router.createRoutes(this.routes, {
      onGo(route) {
      },
      onBack(route) {
      }
    });
  }
};
var appRouter = new MyRouter();

// source-code/left-menu/left-menu.ts
var LeftMenu = class {
  output;
  render() {
    const output = new $div({
      class: "left-menu"
    }).create("#app", { clear: true }).ids.div;
    this.output = output;
    new $div({
      class: "__header"
    }).create(output);
    new $menuItem(
      {
        ariaLabel: "Add Project",
        icon: createIcon(Plus),
        label: "Add Project",
        onclick: W.fx((self) => {
          appRouter.methods.addProject.go();
        }, "this")
      },
      { identifier: "add-project" }
    ).create(output);
    new $menuSeparator().create(output);
    new $menuItem(
      {
        ariaLabel: "Select Project",
        icon: createIcon(FolderKanban),
        label: "Select Project",
        onclick: W.fx((self) => {
          appRouter.methods.selectProject.go();
        }, "this")
      },
      { identifier: "select-project" }
    ).create(output);
    new $menuItem(
      {
        ariaLabel: "About",
        icon: createIcon(Info),
        label: "About",
        onclick: W.fx((self) => {
          appRouter.methods.about.go();
        }, "this")
      },
      { identifier: "about" }
    ).create(output);
    this.buttonEffect();
  }
  renderProjectMenu(_id) {
    const output = this.output;
    new $div({
      class: "__header"
    }).create(output, { clear: true });
    new $menuItem(
      {
        ariaLabel: "Home",
        icon: createIcon(FolderKanban),
        label: "Home",
        onclick: W.fx((self) => {
          appRouter.methods.project_home.go(_id);
        }, "this")
      },
      { identifier: "home" }
    ).create(output);
    new $menuItem(
      {
        ariaLabel: "Add connection",
        icon: createIcon(ClipboardPenLine),
        label: "Add connection",
        onclick: W.fx((self) => {
          appRouter.methods.add_connection.go(_id);
        }, "this")
      },
      { identifier: "add-connection" }
    ).create(output);
    new $menuItem(
      {
        ariaLabel: "Show database log entries",
        icon: createIcon(Logs),
        label: "Show database log entries",
        onclick: W.fx((self) => {
        }, "this")
      },
      { identifier: "show-database-log-entries" }
    ).create(output);
    new $menuSeparator().create(output);
    new $menuItem(
      {
        ariaLabel: "Project settings",
        icon: createIcon(Settings),
        label: "Project settings",
        onclick: W.fx((self) => {
        }, "this")
      },
      { identifier: "project-settings" }
    ).create(output);
    new $menuItem(
      {
        ariaLabel: "Close project",
        icon: createIcon(Power),
        label: "Close project",
        onclick: W.fx((self) => {
        }, "this")
      },
      { identifier: "close-project" }
    ).create(output);
    this.buttonEffect();
  }
  buttonEffect() {
    document.querySelectorAll(".left-menu button").forEach((item) => {
      item.addEventListener("pointerdown", () => {
        document.querySelectorAll(".left-menu button").forEach((btn) => {
          btn.classList.remove("is-active");
        });
        item.classList.add("is-active");
      });
    });
  }
};
var leftMenu2 = new LeftMenu();
var manualMenuEffect = (identifier) => {
  document.querySelectorAll(".left-menu button").forEach((item) => {
    item.classList.remove("is-active");
  });
  const el = document.getElementById(`menuItem-win-${identifier}`);
  if (el) {
    el.classList.add("is-active");
  }
};

// source-code/app.ts
window.addEventListener("DOMContentLoaded", () => {
  var _a;
  leftMenu2.render();
  (_a = document.getElementById("menuItem-win-new-project")) == null ? void 0 : _a.classList.add("is-active");
  appRouter.methods.selectProject.go();
});
/*! Bundled license information:

lucide/dist/esm/defaultAttributes.mjs:
lucide/dist/esm/createElement.mjs:
lucide/dist/esm/icons/check.mjs:
lucide/dist/esm/icons/chevron-left.mjs:
lucide/dist/esm/icons/chevron-right.mjs:
lucide/dist/esm/icons/clipboard-pen-line.mjs:
lucide/dist/esm/icons/folder-kanban.mjs:
lucide/dist/esm/icons/info.mjs:
lucide/dist/esm/icons/logs.mjs:
lucide/dist/esm/icons/plus.mjs:
lucide/dist/esm/icons/power.mjs:
lucide/dist/esm/icons/settings.mjs:
lucide/dist/esm/lucide.mjs:
  (**
   * @license lucide v1.31.0 - ISC
   *
   * This source code is licensed under the ISC license.
   * See the LICENSE file in the root directory of this source tree.
   *)
*/
//# sourceMappingURL=app.js.map
