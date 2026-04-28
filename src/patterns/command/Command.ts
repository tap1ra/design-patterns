// Command Interface
export interface Command {
  execute(): void;
  undo(): void;
}

// Receiver (The actual device being controlled)
export class SmartLight {
  private isOn: boolean = false;
  private brightness: number = 0;

  turnOn(): void {
    this.isOn = true;
    this.brightness = 100;
  }

  turnOff(): void {
    this.isOn = false;
    this.brightness = 0;
  }

  dim(): void {
    if (this.isOn && this.brightness > 0) {
      this.brightness -= 20;
      if (this.brightness < 0) this.brightness = 0;
    }
  }

  getStatus() {
    return { isOn: this.isOn, brightness: this.brightness };
  }
}

// Concrete Commands
export class TurnOnLightCommand implements Command {
  private light: SmartLight;

  constructor(light: SmartLight) {
    this.light = light;
  }

  execute(): void {
    this.light.turnOn();
  }

  undo(): void {
    this.light.turnOff();
  }
}

export class TurnOffLightCommand implements Command {
  private light: SmartLight;

  constructor(light: SmartLight) {
    this.light = light;
  }

  execute(): void {
    this.light.turnOff();
  }

  undo(): void {
    this.light.turnOn();
    // In a more complex implementation, we'd restore exact previous state
  }
}

export class DimLightCommand implements Command {
  private light: SmartLight;

  constructor(light: SmartLight) {
    this.light = light;
  }

  execute(): void {
    this.light.dim();
  }

  undo(): void {
    // simplified undo for demo
    this.light.turnOn(); // forces back to 100 or previous would be better, but we simplify
  }
}

// Invoker (Remote Control)
export class RemoteControl {
  private history: Command[] = [];

  executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undoCommand(): boolean {
    const command = this.history.pop();
    if (command) {
      command.undo();
      return true;
    }
    return false;
  }

  getHistoryCount(): number {
    return this.history.length;
  }
}
