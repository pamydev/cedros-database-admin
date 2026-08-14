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

// source-code/left-menu/left-menu.ts
var LeftMenu = class {
  render() {
    const output = new $div({
      class: "left-menu"
    }).create("#app").ids.div;
    new $div({
      class: "__header"
    }).create(output);
  }
};

// source-code/app.ts
window.addEventListener("DOMContentLoaded", () => {
  new LeftMenu().render();
});
//# sourceMappingURL=app.js.map
