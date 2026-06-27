// src/prop.ts
export function Props(attributes: string[]) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    class CustomElement extends constructor {
      constructor(...args: any[]) {
        super(...args);
      }

      static get observedAttributes() {
        return attributes;
      }

      attributeChangedCallback(
        name: string,
        oldValue: string,
        newValue: string
      ) {
        if (attributes.includes(name)) {
          // Handle changes to the specified attributes
          // For example, update the corresponding instance variable
          this[name] = JSON.parse(newValue);
        }
      }
    }
  };
}

export function Prop(target: any, key: string) {
  let privateValue: any;

  const getter = function () {
    return privateValue;
  };

  const setter = function (newVal: any) {
    privateValue = newVal;
  };

  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}

export default Prop;
