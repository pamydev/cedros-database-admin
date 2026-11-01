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
   * @param {any} [elements.data]  
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
    style="${(props == null ? void 0 : props.style) || ""}"
    ${(props == null ? void 0 : props.data) || ""}>
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
var $span = class _$span extends Constructos {
  // ========================================
  /**
   * 
   * @param {object} elements
   * @param {any} [elements.class]  
   * @param {any} elements.content  
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
      `span-win-${this.identifier}`,
      elements,
      options,
      _$span
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
  <span id="span-win-${this.identifier}" class="${(props == null ? void 0 : props.class) || ""}">${(props == null ? void 0 : props.content) || ""}</span>
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
        span: `span-win-${this.identifier}`
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
var $codeEditor = class _$codeEditor extends Constructos {
  // ========================================
  /**
   * 
   * @param {object} [elements]
   * @param {any} [elements.oninput]  
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
      `codeEditor-win-${this.identifier}`,
      elements,
      options,
      _$codeEditor
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
  <div id="codeEditor-win-${this.identifier}" class="code-editor-container">
    <pre       id="contentEditable-win-${this.identifier}"
      class="code-editor"
      contenteditable="true"
      oninput="${(props == null ? void 0 : props.oninput) || ""}"
      style="${(props == null ? void 0 : props.style) || ""}"></pre>
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
        codeEditor: `codeEditor-win-${this.identifier}`,
        contentEditable: `contentEditable-win-${this.identifier}`
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
var $select = class _$select extends Constructos {
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
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `select-win-${this.identifier}`,
      elements,
      options,
      _$select
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
  <select     id="select-win-${this.identifier}"
    class="${(props == null ? void 0 : props.class) || ""}"
    onchange="${(props == null ? void 0 : props.onchange) || ""}"
    style="${(props == null ? void 0 : props.style) || ""}">
    ${(props == null ? void 0 : props.options) || ""}
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        select: `select-win-${this.identifier}`
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
var $option = class _$option extends Constructos {
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
  constructor(elements, options) {
    super();
    this.identifier = this._getIdentifier(options ? options.identifier || "notSet" : "notSet");
    const digestedPropsToString = this._mutableToString(elements);
    this.component = this.code(
      digestedPropsToString
    );
    this._saveUsingMutable(
      `option-win-${this.identifier}`,
      elements,
      options,
      _$option
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
  <option id="option-win-${this.identifier}" value="${(props == null ? void 0 : props.value) || ""}" class="${(props == null ? void 0 : props.class) || ""}">
    ${(props == null ? void 0 : props.content) || ""}
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        option: `option-win-${this.identifier}`
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
var $table = class _$table extends Constructos {
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
      `table-win-${this.identifier}`,
      elements,
      options,
      _$table
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        table: `table-win-${this.identifier}`,
        thead_tr_output: `thead_tr_output-win-${this.identifier}`,
        tbody_output: `tbody_output-win-${this.identifier}`
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
var $tr = class _$tr extends Constructos {
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
      `tr-win-${this.identifier}`,
      elements,
      options,
      _$tr
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
  create(output, options) {
    this.attachToDOM(
      this.component,
      output,
      options
    );
    return {
      ids: {
        tr: `tr-win-${this.identifier}`
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
var $th = class _$th extends Constructos {
  // ========================================
  /**
   * 
   * @param {object} elements
   * @param {'col'|'row'} [elements.scope]  
   * @param {any} elements.content  
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
      `th-win-${this.identifier}`,
      elements,
      options,
      _$th
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
  <th id="th-win-${this.identifier}" scope="${(props == null ? void 0 : props.scope) || ""}">${(props == null ? void 0 : props.content) || ""}</th>
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
        th: `th-win-${this.identifier}`
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
var $td = class _$td extends Constructos {
  // ========================================
  /**
   * 
   * @param {object} elements
   * @param {any} elements.content  
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
      `td-win-${this.identifier}`,
      elements,
      options,
      _$td
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
  <td id="td-win-${this.identifier}">${(props == null ? void 0 : props.content) || ""}</td>
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
        td: `td-win-${this.identifier}`
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

// ../../node_modules/lucide/dist/esm/icons/box.mjs
var Box = [
  [
    "path",
    {
      d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
    }
  ],
  ["path", { d: "m3.3 7 8.7 5 8.7-5" }],
  ["path", { d: "M12 22V12" }]
];

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

// ../../node_modules/lucide/dist/esm/icons/corner-down-left.mjs
var CornerDownLeft = [
  ["path", { d: "M20 4v7a4 4 0 0 1-4 4H4" }],
  ["path", { d: "m9 10-5 5 5 5" }]
];

// ../../node_modules/lucide/dist/esm/icons/database.mjs
var Database = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12" }]
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

// ../../node_modules/lucide/dist/esm/icons/move.mjs
var Move = [
  ["path", { d: "M12 2v20" }],
  ["path", { d: "m15 19-3 3-3-3" }],
  ["path", { d: "m19 9 3 3-3 3" }],
  ["path", { d: "M2 12h20" }],
  ["path", { d: "m5 9-3 3 3 3" }],
  ["path", { d: "m9 5 3-3 3 3" }]
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
var createIcon = (icon, args0) => {
  let finalClass = "__icon__";
  if (args0 == null ? void 0 : args0.simple) {
    finalClass = "__simpleIcon__";
  }
  if (args0 == null ? void 0 : args0.color) {
    finalClass += " __" + args0.color;
  }
  return new $div({
    class: finalClass,
    content: createElement(icon).outerHTML
  }).constructoString();
};

// source-code/left-menu/left-menu.ts
var LeftMenu = class {
  leftSpaceContainer;
  leftMenuSpace;
  messageBoxSpace;
  messageBox;
  constructor() {
    this.renderLeftSpace();
    this.renderMessageBox();
  }
  output;
  renderLeftSpace() {
    this.leftSpaceContainer = new $div({ class: "leftSpaceContainer" }).create(
      "#app"
    ).ids.div;
    this.leftMenuSpace = new $div({ style: "height:100%" }).create(
      this.leftSpaceContainer
    ).ids.div;
    this.messageBoxSpace = new $div().create(this.leftSpaceContainer).ids.div;
  }
  renderMessageBox() {
    this.messageBox = new $div({
      class: "messageBox"
    }).create(this.messageBoxSpace).ids.div;
  }
  addMessageToMessageBox = (arg0) => {
    const { message } = arg0;
    new $span({ content: message }).create(this.messageBox, { clear: true });
  };
  render() {
    const output = new $div({
      class: "left-menu"
    }).create(this.leftMenuSpace, { clear: true }).ids.div;
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
        icon: createIcon(FolderKanban, {
          color: "red"
        }),
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
        icon: createIcon(Info, {
          color: "blue"
        }),
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
        icon: createIcon(FolderKanban, { color: "grey" }),
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
        icon: createIcon(ClipboardPenLine, { color: "grey" }),
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
        icon: createIcon(Logs, { color: "black" }),
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
        icon: createIcon(Settings, { color: "yellow" }),
        label: "Project settings",
        onclick: W.fx((self) => {
        }, "this")
      },
      { identifier: "project-settings" }
    ).create(output);
    new $menuItem(
      {
        ariaLabel: "Close project",
        icon: createIcon(Power, { color: "grey" }),
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
var leftMenu = new LeftMenu();
var addMessageToMessageBox = leftMenu.addMessageToMessageBox;
var manualMenuEffect = (identifier) => {
  document.querySelectorAll(".left-menu button").forEach((item) => {
    item.classList.remove("is-active");
  });
  const el = document.getElementById(`menuItem-win-${identifier}`);
  if (el) {
    el.classList.add("is-active");
  }
};

// source-code/screens/screen.ts
var Screen = class {
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
    class: `LIST-ITEM`,
    onclick: args0.onclick
  }).create(args0.output).ids.div;
  const leftDiv = new $div({
    class: `LEFT ${args0.subLabel && "atTop"}`
  }).create(output).ids.div;
  if (args0.icon) {
    new $div({
      class: "ICON",
      content: createIcon(args0.icon)
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
      content: createIcon(ChevronRight, {
        simple: true
      })
    }).create(rightDiv);
  }
};

// source-code/screens/select-project/select-project.ts
var SelectProjectScreen = class extends Screen {
  output;
  render(reload) {
    const output = this.buildScreen({
      output: "screen",
      title: "Select Project",
      identifier: "select-project"
    });
    if (output === "exists") return;
    this.output = output;
    this.loadProjects(reload);
  }
  async loadProjects(reload) {
    if (reload === "reload") {
      const el = document.getElementById(this.output);
      if (el) {
        el.innerHTML = "";
      }
    }
    const projects = await window.database.loadProjects();
    console.log({ projects });
    if (projects.length === 0) {
      this.emptyProjects();
      return;
    }
    const output = new $div({
      class: "PANEL"
    }).create(this.output).ids.div;
    console.log(`printed output in ${this.output}`);
    projects.forEach((project) => this.printProject(project, output));
  }
  printProject(project, output) {
    const uriProjectName = encodeURIComponent(project.name);
    const imgURL = project.image ? `images://${uriProjectName}/${project.image}` : null;
    listItem({
      label: project.name,
      subLabel: project.description,
      chevronRight: true,
      imageURL: imgURL,
      onclick: W.fx(() => {
        appRouter.methods.project_home.go(project.projectId);
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
  async render(projectId) {
    const project = await window.database.getProjectById(projectId);
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
        appRouter.methods.add_mongo_connection.go(projectId);
      }),
      output: this.output
    });
    listItem({
      label: "Redis",
      onclick: W.fx(() => {
        appRouter.methods.add_redis_connection.go(projectId);
      }),
      output: this.output
    });
    listItem({
      label: "Cedros Mongify",
      onclick: W.fx(() => {
        appRouter.methods.add_mongify_connection.go(projectId);
      }),
      output: this.output
    });
  }
};
var addConnectionScreen = new AddConnectionScreen();

// source-code/project/addConnection/mongoConnectionScreen.ts
var MongoConnectionScreen = class extends Screen {
  connection_name;
  connection_uri;
  connection_userName;
  connection_password;
  connection_database;
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
    this.connection_name = new $inputForm({
      label: "Connection Name",
      type: "text",
      placeholder: "Local MongoDB",
      required: true
    }).create(panel).ids.input;
    this.connection_uri = new $inputForm({
      label: "MongoDB URI",
      description: "Example: mongodb://localhost:27017",
      type: "text",
      placeholder: "mongodb://localhost:27017",
      required: true
    }).create(panel).ids.input;
    this.connection_userName = new $inputForm({
      label: "Username",
      type: "text",
      placeholder: "Optional",
      required: false
    }).create(panel).ids.input;
    this.connection_password = new $inputForm({
      label: "Password",
      type: "password",
      placeholder: "Optional",
      required: false
    }).create(panel).ids.input;
    this.connection_database = new $inputForm({
      label: "Database",
      type: "text",
      placeholder: "Database name",
      required: true
    }).create(panel).ids.input;
    const actions = new $div({ class: "DIV-RIGHT" }).create(panel).ids.div;
    new $buttonPrimary({
      content: "Save Connection",
      icon: createIcon(Check),
      onclick: W.fx(() => {
        this.send(_id);
      })
    }).create(actions);
  }
  send(projectId) {
    const name = document.getElementById(
      this.connection_name
    );
    const uri = document.getElementById(
      this.connection_uri
    );
    const userName = document.getElementById(
      this.connection_userName
    );
    const password = document.getElementById(
      this.connection_password
    );
    const database = document.getElementById(
      this.connection_database
    );
    if (!database.value || !name.value || !password.value || !uri.value || !userName.value) {
      alert("All fields must be filled.");
      return;
    }
    window.database.saveMongoConnection({
      uri: uri.value,
      name: name.value,
      userName: userName.value,
      password: password.value,
      database: database.value,
      projectId
    });
    alert("Connection saved");
  }
};
var mongoConnectionScreen = new MongoConnectionScreen();

// source-code/project/addConnection/mongifyConnectionScreen.ts
var MongifyConnectionScreen = class extends Screen {
  async render(projectId) {
    const project = await window.database.getProjectById(projectId);
    const content = this.buildScreen({
      output: "screen",
      title: "Add Cedros Mongify Connection",
      identifier: "mongify-connection",
      titleImg: (project == null ? void 0 : project.image) ? `images://${encodeURIComponent(project.name)}/${project.image}` : null
    });
    if (content === "exists") return;
    const panel = new $div({ class: "PANEL" }).create(content).ids.div;
    const databasePath = new $inputForm({
      label: "Database path",
      description: "Do not add /Mongify at the end of the path,if full path are like /home/user/Mongify/database-name, just add /home/user",
      type: "text",
      placeholder: "/path/to/database",
      required: true
    }).create(panel).ids.input;
    const databaseName = new $inputForm({
      label: "Database name",
      description: "The name of the database, example: cedros_database_admin. It's after the /Mongify/ folder in the path.",
      type: "text",
      placeholder: "cedros_database_admin",
      required: true
    }).create(panel).ids.input;
    const actions = new $div({ class: "DIV-RIGHT" }).create(panel).ids.div;
    new $buttonPrimary({
      content: "Save Connection",
      icon: createIcon(Check),
      onclick: W.fx(async () => {
        const databasePathInput = document.getElementById(
          databasePath
        );
        const databaseNameInput = document.getElementById(
          databaseName
        );
        if (!databasePathInput.value.trim()) {
          alert("Database path is required.");
          return;
        }
        try {
          await window.database.saveMongifyConnection({
            projectId,
            databasePath: databasePathInput.value,
            databaseName: databaseNameInput.value
          });
          alert("Connection saved");
        } catch {
          alert("Could not save connection.");
        }
      })
    }).create(actions);
  }
};
var mongifyConnectionScreen = new MongifyConnectionScreen();

// source-code/project/addConnection/redisConnectionScreen.ts
var RedisConnectionScreen = class extends Screen {
  async render(_id) {
    const project = await window.database.getProjectById(_id);
    const content = this.buildScreen({
      output: "screen",
      title: "Add Redis Connection",
      identifier: "redis-connection",
      titleImg: (project == null ? void 0 : project.image) ? `images://${encodeURIComponent(project.name)}/${project.image}` : null
    });
    if (content === "exists") return;
    const panel = new $div({ class: "PANEL" }).create(content).ids.div;
    new $inputForm({
      label: "Connection Name",
      type: "text",
      placeholder: "Local Redis",
      required: true
    }).create(panel);
    new $inputForm({
      label: "Redis URI",
      description: "Example: redis://localhost:6379",
      type: "text",
      placeholder: "redis://localhost:6379",
      required: true
    }).create(panel);
    new $inputForm({
      label: "Host",
      type: "text",
      placeholder: "localhost",
      required: true
    }).create(panel);
    new $inputForm({
      label: "Port",
      type: "number",
      placeholder: "6379",
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
      description: "Redis database index, usually 0",
      type: "number",
      placeholder: "0",
      required: true
    }).create(panel);
    const actions = new $div({ class: "DIV-RIGHT" }).create(panel).ids.div;
    new $buttonPrimary({
      content: "Save Connection",
      icon: createIcon(Check)
    }).create(actions);
  }
};
var redisConnectionScreen = new RedisConnectionScreen();

// source-code/project/home/mongify.suggestions.ts
var mongify = {
  methods: [
    "listCollections",
    "createCollection",
    "getCollection",
    "deleteCollection"
  ],
  getCollectionFunctions: [
    "find",
    "findOne",
    "insert",
    "insertMany",
    "update",
    "delete"
  ]
};

// source-code/project/home/cursor.ts
var saveCursorPosition = (textEl) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const currentRange = selection.getRangeAt(0);
  if (!textEl.contains(currentRange.startContainer) || !textEl.contains(currentRange.endContainer)) {
    return null;
  }
  const startRange = document.createRange();
  startRange.selectNodeContents(textEl);
  startRange.setEnd(currentRange.startContainer, currentRange.startOffset);
  const endRange = document.createRange();
  endRange.selectNodeContents(textEl);
  endRange.setEnd(currentRange.endContainer, currentRange.endOffset);
  return {
    start: startRange.toString().length,
    end: endRange.toString().length
  };
};
var restoreCursorPosition = (textEl, position2) => {
  if (!position2) return;
  const findPosition = (targetOffset) => {
    var _a;
    const walker = document.createTreeWalker(textEl, NodeFilter.SHOW_TEXT);
    let currentOffset = 0;
    let node = walker.nextNode();
    while (node) {
      const nodeLength = ((_a = node.textContent) == null ? void 0 : _a.length) ?? 0;
      if (targetOffset <= currentOffset + nodeLength) {
        return {
          node,
          offset: targetOffset - currentOffset
        };
      }
      currentOffset += nodeLength;
      node = walker.nextNode();
    }
    return {
      node: textEl,
      offset: textEl.childNodes.length
    };
  };
  const start = findPosition(position2.start);
  const end = findPosition(position2.end);
  const range = document.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset);
  const selection = window.getSelection();
  textEl.focus();
  selection == null ? void 0 : selection.removeAllRanges();
  selection == null ? void 0 : selection.addRange(range);
};
var setCursorPositionInEndOfLine = (textEl) => {
  const range = document.createRange();
  range.selectNodeContents(textEl);
  range.collapse(false);
  const selection = window.getSelection();
  selection == null ? void 0 : selection.removeAllRanges();
  selection == null ? void 0 : selection.addRange(range);
  textEl.focus();
};

// source-code/project/home/params.ts
var Params = class {
  tabCount = 0;
};
var params = new Params();

// source-code/project/home/colorizeAndFormat.ts
var isAwaiting = false;
var tabDecrement = () => {
  console.log("tabDecrement called --");
  if (params.tabCount > 0) params.tabCount--;
};
var tabIncrement = () => {
  console.log("tabIncrement called ++");
  params.tabCount++;
};
var colorizeAndFormat = async (args0) => {
  const { e, codeEditor } = args0;
  if ((e == null ? void 0 : e.key) === "{") {
    tabIncrement();
  }
  if ((e == null ? void 0 : e.key) === "}") {
    tabDecrement();
    removeTab({ e, codeEditor, str: "}" });
  }
  if ((e == null ? void 0 : e.key) === "Tab") {
    insertTab({ e, codeEditor });
    return;
  }
  if ((e == null ? void 0 : e.key) === "Backspace") {
    backspacePressed({ e, codeEditor });
  }
  if ((e == null ? void 0 : e.key) === "Enter") {
    insertTab({ e, codeEditor, onPressEnter: true });
  }
  if (e) {
    if (isDeniedKeyPressed(e)) {
      return;
    }
  }
  if (isAwaiting) return;
  isAwaiting = true;
  await new Promise((resolve) => setTimeout(() => resolve(true), 10));
  isAwaiting = false;
  if (isSuggestionBoxVisible()) return;
  const textEl = document.getElementById(codeEditor);
  const innerText = textEl.innerText;
  const innerHTML = textEl.innerHTML;
  let res = stylish.quotes(innerText);
  res = stylish.db(res);
  res = res.replace(/\n/g, "<br>");
  if (res === innerText || res === innerHTML) return;
  const cursorPosition = saveCursorPosition(textEl);
  textEl.innerHTML = res;
  restoreCursorPosition(textEl, cursorPosition);
};
var stylish = {
  quotes(text) {
    const regex = /("[^"]+")/g;
    return text.replace(
      regex,
      (match) => `<span class="__c0001__">${match}</span>`
    );
  },
  db(text) {
    const regex = /(db)/g;
    return text.replace(
      regex,
      (match) => `<span class="__c0002__">${match}</span>`
    );
  }
};
var isSuggestionBoxVisible = () => {
  return document.getElementById("div-win-suggestion-box") !== null;
};
var insertTab = async (args0) => {
  var _a;
  const { e, codeEditor, onPressEnter } = args0;
  if (onPressEnter && params.tabCount === 0) return;
  if (document.getElementById("div-win-suggestion-box")) return;
  if (!onPressEnter) e.preventDefault();
  await new Promise(
    (resolve) => setTimeout(() => {
      resolve(true);
    }, 10)
  );
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  const range = selection.getRangeAt(0);
  if (!((_a = document.getElementById(codeEditor)) == null ? void 0 : _a.contains(range.commonAncestorContainer)))
    return;
  range.deleteContents();
  let spaces;
  if (!onPressEnter) {
    tabIncrement();
    spaces = document.createTextNode("	");
  } else {
    console.log({ tabCount: params.tabCount });
    spaces = document.createTextNode("	".repeat(params.tabCount));
  }
  range.insertNode(spaces);
  range.setStartAfter(spaces);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
};
var removeTab = (args0) => {
  const { e, codeEditor, str } = args0;
  e.preventDefault();
  const el = document.getElementById(codeEditor);
  const text = el.innerText;
  console.log(JSON.stringify({ text }, null, 2));
  let newText = text;
  if (newText.endsWith("\n")) {
    newText = newText.slice(0, -1);
  }
  if (newText.endsWith("	")) {
    newText = newText.slice(0, -1);
  }
  el.innerText = newText + str;
  setCursorPositionInEndOfLine(el);
};
var backspacePressed = (args0) => {
  const { e, codeEditor } = args0;
  const el = document.getElementById(codeEditor);
  const text = el.innerText;
  console.log("backspace", JSON.stringify({ text }, null, 2));
  if (text.endsWith("	") || text.endsWith("	\n") || text.endsWith("{") || text.endsWith("{\n")) {
    console.log("tab decrement triggered by backspace");
    tabDecrement();
  }
};
var isDeniedKeyPressed = (e) => e.key === "ArrowUp" || e.key === "ArrowDown" || e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Enter" || e.key === "Escape" || e.key === "Shift" || e.key === "Control" || e.key === "Alt" || e.key === "Tab" || e.key === "Meta" || e.key === "CapsLock" || e.key === "NumLock" || e.key === "ScrollLock" || e.key === "Insert" || e.key === "Home" || e.key === "End" || e.key === "PageUp" || e.key === "PageDown" || e.key === "Backspace";

// source-code/project/home/fields.suggestions.ts
var FieldsSuggestions = class {
  regex = {
    trigger: /db\.getCollection\(".+"\)\.find\({[\s\n\t]+/,
    collectionName: /db\.getCollection\("(.+)"\)/,
    filters: {
      /** /^\t([^,:\r\n]*)$/gm */
      next: /^\t([^,:\r\n]*)$/gm
    },
    /** /(^\t+)([^,:\r\n]+)$/gm */
    select: /(^\t+)([^,:\r\n]+)$/gm
  };
  storage = {
    fieldsList: /* @__PURE__ */ new Map()
  };
  collectionName;
  getCollectionName(text) {
    var _a;
    return ((_a = text.match(this.regex.collectionName)) == null ? void 0 : _a[1]) || "";
  }
  async getFieldsList(args0) {
    const { collectionName, databaseId, projectId } = args0;
    const identifier = `${args0.projectId}-${args0.databaseId}-${collectionName}`;
    if (this.storage.fieldsList.has(identifier)) {
      return this.storage.fieldsList.get(identifier);
    }
    let res = await window.database.mongify.sendQuery({
      command: `db.getCollection("${collectionName}").findOne()`,
      databaseId,
      projectId
    });
    const fields = Object.keys(res || {});
    this.storage.fieldsList.set(identifier, fields);
    return fields;
  }
  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  trigger(args0) {
    var _a;
    const { text } = args0;
    this.collectionName = this.getCollectionName(text);
    if (((_a = text.match(this.regex.trigger)) == null ? void 0 : _a.length) > 0) {
      return true;
    } else {
      return false;
    }
  }
  async filterSuggestions(args0) {
    var _a;
    const fieldsAvailable = await this.getFieldsList({
      collectionName: this.collectionName,
      databaseId: args0.databaseId,
      projectId: args0.projectId
    });
    const nextMatch = ((_a = args0.text.match(this.regex.filters.next)) == null ? void 0 : _a[0]) || "";
    const suggestionsAvailable = fieldsAvailable.filter((field) => {
      if (nextMatch === "	") return true;
      if (nextMatch.trim() === "") return false;
      if (field.startsWith(nextMatch.trim())) return true;
    });
    return suggestionsAvailable;
  }
  selectSuggestion(args0) {
    const { editor, content } = args0;
    let text = editor.innerText;
    const selectRegex = this.regex.select;
    const match = text.match(selectRegex);
    const toBeReplaced = (match == null ? void 0 : match[0]) || "";
    console.log(
      JSON.stringify(
        {
          text,
          match,
          toBeReplaced,
          content
        },
        null,
        2
      )
    );
    if (toBeReplaced === "" || !toBeReplaced) {
      if (text.endsWith("\n")) {
        text = text.slice(0, -1);
      }
      editor.innerText = text + content + ":";
    } else {
      let tabCount = params.tabCount;
      editor.innerText = text.replace(
        selectRegex,
        (completeMatch, group1, group2) => {
          return `${group1}${content}:`;
        }
      );
    }
  }
};
var fieldsSuggestionsModel = new FieldsSuggestions();

// source-code/project/home/suggestions.ts
var getCursorPosition = () => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return { left: 0, bottom: 0 };
  }
  const originalRange = selection.getRangeAt(0).cloneRange();
  const measurementRange = originalRange.cloneRange();
  measurementRange.collapse(true);
  const marker = document.createElement("span");
  marker.textContent = "\u200B";
  marker.style.cssText = `
    visibility: hidden;
    pointer-events: none;
  `;
  measurementRange.insertNode(marker);
  const markerParent = marker.parentNode;
  const markerRect = marker.getBoundingClientRect();
  marker.remove();
  markerParent == null ? void 0 : markerParent.normalize();
  selection.removeAllRanges();
  selection.addRange(originalRange);
  return {
    left: markerRect.left,
    bottom: markerRect.bottom + 4
  };
};
var position = 0;
var selectedPosition = 0;
var totalItems = 0;
var suggestionsIsVisible = false;
var collectionsList = /* @__PURE__ */ new Map();
var getCollectionsList = async (args0) => {
  const identifier = `${args0.projectId}-${args0.databaseId}`;
  if (collectionsList.has(identifier)) return collectionsList.get(identifier);
  let res = await window.database.mongify.sendQuery({
    command: "db.listCollections()",
    databaseId: args0.databaseId,
    projectId: args0.projectId
  });
  collectionsList.set(identifier, res);
  return res;
};
var addSuggestionItem = (args0) => {
  const item = new $div({
    class: `__suggestion-item ${selectedPosition === position ? "__selected__" : ""}`,
    data: `data-position="${position}" data-content="${args0.method}" data-type="${args0.type}"`
  }).create(args0.output).ids.div;
  position++;
  const left = new $div({
    class: "__left"
  }).create(item).ids.div;
  const right = new $div({
    class: "__right"
  }).create(item).ids.div;
  new $div({
    content: createIcon(Box, { simple: true }),
    class: "__icon"
  }).create(left);
  new $div({
    content: args0.method,
    class: "__text"
  }).create(left);
  new $div({
    content: `(${args0.type})`,
    class: "__description"
  }).create(right);
  new $div({
    class: "__enterIcon",
    content: createIcon(CornerDownLeft, { simple: true })
  }).create(right);
};
var removeSelectedFromAllItems = () => {
  document.querySelectorAll(".__suggestion-item").forEach((el) => {
    document.getElementById(el.id).classList.remove("__selected__");
  });
};
var suggestionSelect = (args0) => {
  let enterPressed = false;
  if (!suggestionsIsVisible) return enterPressed;
  const key = args0.e.key;
  if (key === "ArrowDown") {
    args0.e.preventDefault();
    if (selectedPosition + 1 === totalItems) return;
    selectedPosition++;
    removeSelectedFromAllItems();
    const selectedEl = document.querySelector(`[data-position="${selectedPosition}"]`).classList.add("__selected__");
  }
  if (key === "ArrowUp") {
    args0.e.preventDefault();
    if (selectedPosition === 0) return;
    selectedPosition--;
    removeSelectedFromAllItems();
    const selectedEl = document.querySelector(`[data-position="${selectedPosition}"]`).classList.add("__selected__");
  }
  if (key === "Enter") {
    enterPressed = true;
    args0.e.preventDefault();
    args0.e.stopPropagation();
    const selectedEl = document.querySelector(
      `[data-position="${selectedPosition}"]`
    );
    const content = selectedEl.dataset.content;
    const type = selectedEl.dataset.type;
    const editor = document.getElementById(args0.codeEditor);
    switch (true) {
      case type === "method":
        const text = editor.innerText;
        const regex = /(.*db\.)/s;
        text.replace(regex, (completeMatch, g1) => {
          console.log(
            JSON.stringify(
              { text, completeMatch, g1, content, return: `${g1}${content}("` },
              null,
              2
            )
          );
          editor.innerText = `${g1}${content}("`;
          return `${g1}${content}("`;
        });
        break;
      case type === "collection":
        (() => {
          const text2 = editor.innerText;
          const regex2 = /(db\.getCollection\(\")([^.]+)/;
          const match = text2.match(regex2);
          const toBeReplaced = match == null ? void 0 : match[1];
          if (toBeReplaced === "" || !toBeReplaced) {
            editor.innerText = `db.getCollection("${content}")`;
          } else {
            editor.innerText = text2.replace(
              regex2,
              (completeMatch, group1, group2) => `${group1}${content}`
            ) + '")';
          }
        })();
        break;
      case type === "function":
        (() => {
          const text2 = editor.innerText;
          const functionRegex = /(db\.[^.]+\.)(.*)/;
          const match = text2.match(functionRegex);
          const toBeReplaced = (match == null ? void 0 : match[1]) || "";
          if (toBeReplaced === "" || !toBeReplaced) {
            editor.innerText = text2 + content + "(";
          } else {
            editor.innerText = text2.replace(
              functionRegex,
              (completeMatch, group1, group2) => `${group1}${content}(`
            );
          }
        })();
        break;
      case type === "field":
        fieldsSuggestionsModel.selectSuggestion({
          content,
          editor
        });
        break;
    }
    setCursorPositionInEndOfLine(editor);
    removeSuggestionBox();
    colorizeAndFormat({ codeEditor: args0.codeEditor });
    return enterPressed;
  }
};
var suggestions = async (args0) => {
  var _a, _b, _c, _d;
  const key = args0.e.key;
  if (key === "ArrowDown" || key === "ArrowUp") return;
  const { codeEditor, output } = args0;
  const codeEditorElement = document.getElementById(codeEditor);
  const text = codeEditorElement.innerText;
  const regExPreFunction = /db\.[^.]+\./;
  const regExFunction = /db\.[^.]+\.(.+)/;
  const functionText = ((_a = text.match(regExFunction)) == null ? void 0 : _a[1]) || "";
  const getCollectionPreRegex = /db\.getCollection\(\"/;
  const getCollectionRegex = /db\.getCollection\(\"([^.]+)/;
  const getCollectionText = ((_b = text.match(getCollectionRegex)) == null ? void 0 : _b[1]) || "";
  let collections;
  let command = text.split("db.")[1];
  if (command == null ? void 0 : command.endsWith("\n")) {
    command = command.slice(0, -1);
  }
  let suggestionsAvailable = [];
  let type;
  switch (true) {
    case fieldsSuggestionsModel.trigger({ text }):
      type = "field";
      suggestionsAvailable = await fieldsSuggestionsModel.filterSuggestions({
        databaseId: args0.databaseId,
        projectId: args0.projectId,
        text
      });
      break;
    case ((_c = text.match(regExPreFunction)) == null ? void 0 : _c.length) > 0:
      type = "function";
      suggestionsAvailable = mongify.getCollectionFunctions.filter((method) => {
        if (method.startsWith(functionText) || functionText === "") return true;
        return false;
      });
      break;
    case ((_d = text.match(getCollectionPreRegex)) == null ? void 0 : _d.length) > 0:
      type = "collection";
      collections = await getCollectionsList({
        databaseId: args0.databaseId,
        projectId: args0.projectId
      });
      suggestionsAvailable = collections.filter(
        (coll) => coll.startsWith(getCollectionText) || getCollectionText === ""
      );
      break;
    default:
      type = "method";
      suggestionsAvailable = mongify.methods.filter((method) => {
        if (method.startsWith(command) || command === "") return true;
        return false;
      });
      break;
  }
  totalItems = suggestionsAvailable.length;
  await new Promise((resolve) => setTimeout(resolve, 100));
  const cursorPosition = getCursorPosition();
  removeSuggestionBox();
  suggestionsIsVisible = true;
  const suggestionBox = new $div(
    {
      style: `top:${cursorPosition.bottom}px;left:${cursorPosition.left}px;`,
      class: "suggestion-box"
    },
    { identifier: "suggestion-box" }
  ).create(output).ids.div;
  position = 0;
  selectedPosition = 0;
  suggestionsAvailable.forEach(
    (method) => addSuggestionItem({ method, output: suggestionBox, type })
  );
  if (suggestionsAvailable.length === 0) {
    removeSuggestionBox();
  }
};
var removeSuggestionBox = () => {
  var _a;
  (_a = document.getElementById("div-win-suggestion-box")) == null ? void 0 : _a.remove();
  suggestionsIsVisible = false;
};

// source-code/helpers/messageBox.helper.ts
var updateMessageBoxWhenCursorEnterElement = (arg0) => {
  const { elementId, messageText } = arg0;
  const el = document.getElementById(elementId);
  el.addEventListener("mouseenter", () => {
    addMessageToMessageBox({ message: messageText });
  });
  el.addEventListener("mouseleave", () => {
    addMessageToMessageBox({ message: "" });
  });
};

// source-code/project/home/homeScreen.ts
var ProjectHomeScreen = class extends Screen {
  output;
  panelOutput;
  projectId;
  async render(projectId) {
    this.projectId = projectId;
    const projectDetails = await window.database.getProjectById(projectId);
    const content = this.buildScreen({
      output: "screen",
      title: "Project Home",
      identifier: "project-home",
      titleImg: (projectDetails == null ? void 0 : projectDetails.image) ? `images://${encodeURIComponent(projectDetails.name)}/${projectDetails.image}` : null
    });
    if (content === "exists") return;
    this.output = content;
    new $div({
      content: projectDetails.name,
      class: "TITLE"
    }).create(content);
    new $div({
      content: projectDetails.description,
      class: "SUB-TITLE",
      style: "margin-bottom: 20px;"
    }).create(content);
    this.panelOutput = new $div({
      class: "FLEX-TRANSPARENT"
    }).create(content).ids.div;
    this.listDatabasesAndWorkspaces();
  }
  async listDatabasesAndWorkspaces() {
    const output = new $div({
      class: "PANEL CONTENT-WIDTH"
    }).create(this.panelOutput).ids.div;
    const databases = await window.database.listDatabases(this.projectId);
    if (databases.length === 0) {
      new $div({
        content: "No databases found"
      }).create(output);
      return;
    }
    listItem({
      label: "Databases list",
      output,
      subLabel: "Click on a database to view its collections and start working with it. You can also add new databases or remove existing ones.",
      onclick: "",
      chevronRight: false
    });
    console.table(databases);
    databases.forEach((db) => this.printDatabase(db, output));
    listItem({
      label: "Workspaces list",
      output,
      subLabel: "Workspaces are saved queries and configurations for your databases. ",
      onclick: "",
      chevronRight: false
    });
  }
  printDatabase(db, output) {
    const label = new $span({
      content: db.type,
      class: `__span-${db.type}__`
    }).constructoString();
    const dbName = new $span({
      content: db.database_name
    }).constructoString();
    listItem({
      label,
      subLabel: db.database_name,
      onclick: W.fx(() => {
        this.openDatabase(db);
      }),
      output,
      icon: Database
    });
  }
  async openDatabase(db) {
    if (db.type === "mongify") {
      this.renderMongifyCodeDiv(db);
    }
  }
  async renderMongifyCodeDiv(db) {
    const output = this.createCodeDiv();
    const header = new $div({
      class: "mongify-header"
    }).create(output).ids.div;
    const left = new $div({
      class: "mongify-header-left",
      style: "width:100%"
    }).create(header).ids.div;
    const right = new $div({
      class: "mongify-header-right"
    }).create(header).ids.div;
    const resizeManagementButtonsDiv = new $div().create(left).ids.div;
    this.createResizeManagementButton({
      idToInsert: resizeManagementButtonsDiv,
      codeDivToResizeOrClose: output
    });
    const nameOfWindowDiv = new $div({
      style: "display:flex;align-items:center;width:100%;"
    }).create(left).ids.div;
    this.addMovementOfGrabTitleListener({
      id: nameOfWindowDiv,
      output
    });
    const label = new $span({
      content: db.type,
      class: `__span-${db.type}__`
    }).create(nameOfWindowDiv);
    new $div({
      content: db.database_name,
      class: "mongify-command"
    }).create(nameOfWindowDiv);
    const codeEditor = new $codeEditor().create(output);
    const codeEditorContentId = codeEditor.ids.contentEditable;
    const codeEditorDivId = codeEditor.ids.codeEditor;
    let leftAltPressed = false;
    document.getElementById(codeEditorContentId).addEventListener("keydown", async (e) => {
      if (e.repeat) return;
      const sendShortcut = e.key === "Enter" && (e.metaKey || e.ctrlKey);
      if (sendShortcut) {
        e.preventDefault();
        const command = document.getElementById(codeEditorContentId).textContent;
        const res = await window.database.mongify.sendQuery({
          projectId: db.projectId,
          databaseId: db.databaseId,
          command
        });
        this.printMongifyResult({
          result: res,
          command
        });
        return;
      }
      const enterWasPressed = suggestionSelect({
        e,
        codeEditor: codeEditorContentId,
        output
      });
      if (enterWasPressed) return;
      colorizeAndFormat({
        e,
        codeEditor: codeEditorContentId
      });
    });
    document.getElementById(codeEditorContentId).addEventListener("keyup", (e) => {
      suggestions({
        e,
        codeEditor: codeEditorContentId,
        output,
        databaseId: db.databaseId,
        projectId: db.projectId
      });
    });
  }
  createResizeManagementButton(arg0) {
    const { idToInsert, codeDivToResizeOrClose } = arg0;
    const container = new $div({ class: "managementDotContainer" }).create(
      idToInsert
    ).ids.div;
    const redDot = new $div({ class: "managementDot red" }).create(container).ids.div;
    updateMessageBoxWhenCursorEnterElement({
      elementId: redDot,
      messageText: "Close window"
    });
    const yellowDot = new $div({ class: "managementDot yellow" }).create(
      container
    ).ids.div;
    updateMessageBoxWhenCursorEnterElement({
      elementId: yellowDot,
      messageText: "Minimize window"
    });
    const greenDot = new $div({ class: "managementDot green" }).create(
      container
    ).ids.div;
    updateMessageBoxWhenCursorEnterElement({
      elementId: greenDot,
      messageText: "Maximize window"
    });
  }
  createCodeDiv() {
    const output = new $div({
      class: "PANEL codeDiv",
      style: "position:relative"
    }).create(this.panelOutput).ids.div;
    document.getElementById(output).addEventListener(
      "click",
      () => this.incrementZIndexToCodeDivBecomeToFrontOnClick({
        codeDivId: output
      })
    );
    const resizeTop = new $div({
      class: "resizeDiv resizeTop"
    }).create(output).ids.div;
    const resizeRight = new $div({
      class: "resizeDiv resizeRight"
    }).create(output).ids.div;
    const resizeBottom = new $div({
      class: "resizeDiv resizeBottom"
    }).create(output).ids.div;
    const resizeLeft = new $div({
      class: "resizeDiv resizeLeft"
    }).create(output).ids.div;
    const resizeTopLeft = new $div({
      class: "resizeDiv resizeTopLeft"
    }).create(output).ids.div;
    const resizeBottomLeft = new $div({
      class: "resizeDiv resizeBottomLeft"
    }).create(output).ids.div;
    const resizeBottomRight = new $div({
      class: "resizeDiv resizeBottomRight"
    }).create(output).ids.div;
    const resizeTopRight = new $div({
      class: "resizeDiv resizeTopRight"
    }).create(output).ids.div;
    [
      resizeBottom,
      resizeBottomLeft,
      resizeBottomRight,
      resizeLeft,
      resizeRight,
      resizeTop,
      resizeTopLeft,
      resizeTopRight
    ].forEach((id) => {
      this.addResizeContainerListeners({
        id,
        codeEditorContainer: output
      });
    });
    return output;
  }
  printMongifyResult(arg0) {
    console.log(arg0.result);
    const output = this.createCodeDiv();
    let resultDiv;
    const printJson = () => {
      var _a;
      (_a = document.getElementById(resultDiv)) == null ? void 0 : _a.remove();
      const formattedResult = this.formatJSON({
        content: arg0.result
      });
      resultDiv = new $div({
        content: formattedResult,
        class: "mongify-output"
      }).create(output).ids.div;
    };
    const printTable = () => {
      var _a;
      (_a = document.getElementById(resultDiv)) == null ? void 0 : _a.remove();
      resultDiv = new $div({
        class: "mongify-output"
      }).create(output).ids.div;
      const content = arg0.result;
      console.log({
        objectKeys: Object.keys(content[0])
      });
      if (Object.keys(content[0])[0] == "0") {
        new $div({
          content: "No data available"
        }).create(resultDiv);
        return;
      }
      const table = new $table().create(resultDiv);
      let tr1 = table.ids.thead_tr_output;
      let columns = /* @__PURE__ */ new Set();
      content.forEach((obj) => {
        const tr = new $tr().create(table.ids.tbody_output).ids.tr;
        const keys = Object.keys(obj);
        keys.forEach((key) => {
          const value = obj[key];
          columns.add(key);
        });
        columns.forEach((column) => {
          if (keys.includes(column)) {
            const key = column;
            const value = obj[key];
            console.log("typeof value", typeof value);
            new $td({
              content: typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean" ? JSON.stringify(value) : value
            }).create(tr);
          }
        });
      });
      columns.forEach((column) => {
        new $th({ scope: "col", content: column }).create(
          table.ids.thead_tr_output
        );
      });
    };
    const header = new $div({
      class: "mongify-header"
    }).create(output).ids.div;
    const left = new $div({
      class: "mongify-header-left"
    }).create(header).ids.div;
    const right = new $div({
      class: "mongify-header-right"
    }).create(header).ids.div;
    new $div({
      content: arg0.command,
      class: "mongify-command"
    }).create(left);
    const selectFormat = new $select({
      onchange: W.fx(() => {
        const format = document.getElementById(selectFormat).value;
        if (format === "JSON") {
          printJson();
        } else if (format === "Table") {
          printTable();
        }
      })
    }).create(right).ids.select;
    new $option({
      content: "JSON",
      value: "JSON"
    }).create(selectFormat);
    new $option({
      content: "Table",
      value: "Table"
    }).create(selectFormat);
    const grabIcon = new $div({
      content: createIcon(Move, {
        simple: true
      })
    }).create(right).ids.div;
    this.addMovementOfGrabTitleListener({
      id: grabIcon,
      output
    });
    printJson();
  }
  formatJSON(arg0) {
    let content = arg0.content;
    return JSON.stringify(content, null, 2).replace(/\n/g, "<br>").replace(/ /g, "&nbsp;").replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;").replace(/(".*?")/g, '<span class="json-key">$1</span>');
  }
  addResizeContainerListeners(arg0) {
    const { id, codeEditorContainer } = arg0;
    let isDragging = /* @__PURE__ */ new Map();
    let posX = 0;
    let posY = 0;
    document.getElementById(id).addEventListener("pointerdown", (ev) => {
      isDragging.set(id, true);
    });
    document.addEventListener("pointermove", (ev) => {
      if (!isDragging.get(id)) return;
      const x = ev.movementX;
      const y = ev.movementY;
      const width = document.getElementById(codeEditorContainer).getBoundingClientRect().width;
      const height = document.getElementById(codeEditorContainer).getBoundingClientRect().height;
      const classList = document.getElementById(id).classList;
      switch (true) {
        case classList.contains("resizeTop"):
          document.getElementById(codeEditorContainer).style.height = height - y + "px";
          break;
        case classList.contains("resizeBottom"):
          document.getElementById(codeEditorContainer).style.height = height + y + "px";
          break;
        case classList.contains("resizeLeft"):
          document.getElementById(codeEditorContainer).style.width = width - x + "px";
          break;
        case classList.contains("resizeRight"):
          document.getElementById(codeEditorContainer).style.width = width + x + "px";
          break;
        case classList.contains("resizeTopLeft"):
          document.getElementById(codeEditorContainer).style.height = height - y + "px";
          document.getElementById(codeEditorContainer).style.width = width - x + "px";
          break;
        case classList.contains("resizeTopRight"):
          document.getElementById(codeEditorContainer).style.height = height - y + "px";
          document.getElementById(codeEditorContainer).style.width = width + x + "px";
          break;
        case classList.contains("resizeBottomLeft"):
          document.getElementById(codeEditorContainer).style.height = height + y + "px";
          document.getElementById(codeEditorContainer).style.width = width - x + "px";
          break;
        case classList.contains("resizeBottomRight"):
          document.getElementById(codeEditorContainer).style.height = height + y + "px";
          document.getElementById(codeEditorContainer).style.width = width + x + "px";
          break;
      }
    });
    document.addEventListener("pointerup", (ev) => {
      isDragging.set(id, false);
    });
  }
  globalZIndex = 1;
  incrementZIndexToCodeDivBecomeToFrontOnClick(arg0) {
    const { codeDivId } = arg0;
    const codeDiv = document.getElementById(codeDivId);
    this.globalZIndex++;
    codeDiv.style.zIndex = String(this.globalZIndex);
  }
  addMovementOfGrabTitleListener(arg0) {
    const { id, output } = arg0;
    const grabIconElement = document.getElementById(id);
    if (!grabIconElement) return;
    grabIconElement.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const onPointerMove = (ev) => {
        let outputElement = document.getElementById(output);
        if (!outputElement) return;
        let leftOrigin = outputElement.offsetLeft;
        let topOrigin = outputElement.offsetTop;
        outputElement.style.position = "absolute";
        outputElement.style.left = leftOrigin + ev.movementX + "px";
        outputElement.style.top = topOrigin + ev.movementY + "px";
      };
      const onPointerUp = () => {
        document.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerup", onPointerUp);
      };
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    });
  }
};
var projectHomeScreen = new ProjectHomeScreen();

// source-code/router/project.routes.ts
var projectRouter = (routes = {}) => {
  return {
    project_home: {
      go(projectId) {
        Router.navigate(`/screen/home/${projectId}`);
      },
      set() {
        routes["/screen/home/:projectId"] = (projectId) => {
          leftMenu.renderProjectMenu(projectId);
          hideScreens();
          manualMenuEffect("home");
          projectHomeScreen.render(projectId);
        };
      }
    },
    add_connection: {
      go(projectId) {
        Router.navigate(`/screen/add-connection/${projectId}`);
      },
      set() {
        routes["/screen/add-connection/:projectId"] = (projectId) => {
          leftMenu.renderProjectMenu(projectId);
          hideScreens();
          manualMenuEffect("add-connection");
          addConnectionScreen.render(projectId);
        };
      }
    },
    add_mongo_connection: {
      go(projectId) {
        Router.navigate(`/screen/add-mongo-connection/${projectId}`);
      },
      set() {
        routes["/screen/add-mongo-connection/:projectId"] = (projectId) => {
          hideScreens();
          mongoConnectionScreen.render(projectId);
        };
      }
    },
    add_redis_connection: {
      go(projectId) {
        Router.navigate(`/screen/add-redis-connection/${projectId}`);
      },
      set() {
        routes["/screen/add-redis-connection/:projectId"] = (projectId) => {
          hideScreens();
          redisConnectionScreen.render(projectId);
        };
      }
    },
    add_mongify_connection: {
      go(projectId) {
        Router.navigate(`/screen/add-mongify-connection/${projectId}`);
      },
      set() {
        routes["/screen/add-mongify-connection/:projectId"] = (projectId) => {
          hideScreens();
          mongifyConnectionScreen.render(projectId);
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
          leftMenu.render();
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
          leftMenu.render();
          this.hideScreens();
          manualMenuEffect("select-project");
          selectProjectScreen.render(reload);
        };
      }
    },
    about: {
      go: () => Router.navigate("/about"),
      set: () => {
        this.routes["/about"] = () => {
          leftMenu.render();
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

// source-code/app.ts
window.addEventListener("DOMContentLoaded", () => {
  appRouter.methods.selectProject.go();
});
/*! Bundled license information:

lucide/dist/esm/defaultAttributes.mjs:
lucide/dist/esm/createElement.mjs:
lucide/dist/esm/icons/box.mjs:
lucide/dist/esm/icons/check.mjs:
lucide/dist/esm/icons/chevron-left.mjs:
lucide/dist/esm/icons/chevron-right.mjs:
lucide/dist/esm/icons/clipboard-pen-line.mjs:
lucide/dist/esm/icons/corner-down-left.mjs:
lucide/dist/esm/icons/database.mjs:
lucide/dist/esm/icons/folder-kanban.mjs:
lucide/dist/esm/icons/info.mjs:
lucide/dist/esm/icons/logs.mjs:
lucide/dist/esm/icons/move.mjs:
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
