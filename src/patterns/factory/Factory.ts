// Product Interface
export interface UIComponent {
  render(): string;
  getType(): string;
}

// Concrete Products
export class DarkButton implements UIComponent {
  render(): string {
    return `<button style="background: #1e293b; color: #f8fafc; border: 1px solid #334155; padding: 0.5rem 1rem; border-radius: 0.25rem;">Dark Button</button>`;
  }
  getType(): string { return 'Dark Button'; }
}

export class LightButton implements UIComponent {
  render(): string {
    return `<button style="background: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; padding: 0.5rem 1rem; border-radius: 0.25rem;">Light Button</button>`;
  }
  getType(): string { return 'Light Button'; }
}

export class DarkInput implements UIComponent {
  render(): string {
    return `<input type="text" placeholder="Dark Input" style="background: #1e293b; color: #f8fafc; border: 1px solid #334155; padding: 0.5rem; border-radius: 0.25rem;" />`;
  }
  getType(): string { return 'Dark Input'; }
}

export class LightInput implements UIComponent {
  render(): string {
    return `<input type="text" placeholder="Light Input" style="background: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; padding: 0.5rem; border-radius: 0.25rem;" />`;
  }
  getType(): string { return 'Light Input'; }
}

// Creator Interface (Factory Method)
export abstract class UIFactory {
  abstract createButton(): UIComponent;
  abstract createInput(): UIComponent;
}

// Concrete Creators
export class DarkThemeFactory extends UIFactory {
  createButton(): UIComponent {
    return new DarkButton();
  }
  createInput(): UIComponent {
    return new DarkInput();
  }
}

export class LightThemeFactory extends UIFactory {
  createButton(): UIComponent {
    return new LightButton();
  }
  createInput(): UIComponent {
    return new LightInput();
  }
}
