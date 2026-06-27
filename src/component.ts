// src/component.ts
/**
 * Configuration options for the component.
 */
export interface ComponentConfig {
  /**
   * The HTML tag for the component.
   */
  tag: string;

  /**
   * The URL to the component's CSS file (optional).
   */
  styleUrl?: string;

  /**
   * Indicates whether to use shadow DOM (optional).
   */
  shadow?: boolean;

  /**
   * An array of observed attributes (optional).
   */
  observedAttributes?: string[];
}

export function applyStyles(cssText: string, config: ComponentConfig) {
  if (config.shadow) {
    const style = document.createElement("style");
    style.textContent = cssText;
    document?.querySelector(`.${config.tag}`)?.shadowRoot?.appendChild(style);
  } else {
    const style = document.createElement("style");
    style.textContent = cssText;
    document.head.appendChild(style);
  }
}

export async function loadAndApplyStyles(url: string, config: ComponentConfig) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const cssText = await response.text();
      applyStyles(cssText, config);
    } else {
      console.error(`Failed to load CSS file: ${url}`);
    }
  } catch (error) {
    console.error(`Error loading CSS file: ${url}`, error);
  }
}

/**
 * Defines a component with the specified configuration.
 *
 * @param config - The configuration for the component.
 */
export function Component(config: ComponentConfig) {
  // Return a class decorator
  return (constructor: { new (...args: any[]): HTMLElement }) => {
    class CustomElement extends constructor {
      constructor() {
        super();
        this.renderComponent();
      }

      render(): HTMLElement {
        throw new Error("You must implement render in your component class.");
      }

      renderComponent() {
        const shadowRoot = config.shadow
          ? this.attachShadow({ mode: "open" })
          : undefined;

        if (shadowRoot && typeof constructor.prototype.render === "function") {
          const jsxElement =
            constructor?.prototype?.render(this) ?? this.render();
          if (jsxElement) {
            shadowRoot.appendChild(jsxElement);
          } else {
            throw new Error(
              "The JSX provided by render must be an instance of HTMLElement."
            );
          }
        } else {
          // no shadow set
        }
      }
    }

    if (config.styleUrl) {
      // Load and apply styles from the external CSS file
      loadAndApplyStyles(config.styleUrl, config);
    }

    customElements.define(config.tag, CustomElement);
  };
}

export default Component;
