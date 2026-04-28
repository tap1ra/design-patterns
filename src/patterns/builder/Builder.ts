// Product
export class Computer {
  public cpu: string = '';
  public ram: string = '';
  public storage: string = '';
  public gpu: string = '';

  public display(): string {
    return `
      <div style="text-align:left; line-height:1.6;">
        <div><strong>CPU:</strong> ${this.cpu || '未搭載'}</div>
        <div><strong>RAM:</strong> ${this.ram || '未搭載'}</div>
        <div><strong>Storage:</strong> ${this.storage || '未搭載'}</div>
        <div><strong>GPU:</strong> ${this.gpu || '未搭載 (オンボード)'}</div>
      </div>
    `;
  }
}

// Builder Interface
export interface ComputerBuilder {
  buildCPU(): void;
  buildRAM(): void;
  buildStorage(): void;
  buildGPU(): void;
  getResult(): Computer;
  reset(): void;
}

// Concrete Builders
export class GamingComputerBuilder implements ComputerBuilder {
  private computer: Computer;

  constructor() {
    this.computer = new Computer();
  }

  reset(): void {
    this.computer = new Computer();
  }

  buildCPU(): void {
    this.computer.cpu = 'Intel Core i9 14900K';
  }

  buildRAM(): void {
    this.computer.ram = '64GB DDR5 RGB';
  }

  buildStorage(): void {
    this.computer.storage = '2TB NVMe Gen4 SSD';
  }

  buildGPU(): void {
    this.computer.gpu = 'NVIDIA RTX 4090 24GB';
  }

  getResult(): Computer {
    return this.computer;
  }
}

export class OfficeComputerBuilder implements ComputerBuilder {
  private computer: Computer;

  constructor() {
    this.computer = new Computer();
  }

  reset(): void {
    this.computer = new Computer();
  }

  buildCPU(): void {
    this.computer.cpu = 'Intel Core i5 13400';
  }

  buildRAM(): void {
    this.computer.ram = '16GB DDR4';
  }

  buildStorage(): void {
    this.computer.storage = '512GB NVMe SSD';
  }

  buildGPU(): void {
    // Office PC might not need a dedicated GPU
    this.computer.gpu = '';
  }

  getResult(): Computer {
    return this.computer;
  }
}

// Director
export class Director {
  private builder: ComputerBuilder | null = null;

  setBuilder(builder: ComputerBuilder): void {
    this.builder = builder;
  }

  // A method simulating step-by-step building process with delays
  async constructComputer(onStep: (stepName: string, computer: Computer) => void): Promise<Computer> {
    if (!this.builder) throw new Error("Builder not set");

    this.builder.reset();
    
    await this.delay(600);
    this.builder.buildCPU();
    onStep('cpu', this.builder.getResult());

    await this.delay(600);
    this.builder.buildRAM();
    onStep('ram', this.builder.getResult());

    await this.delay(600);
    this.builder.buildStorage();
    onStep('storage', this.builder.getResult());

    await this.delay(600);
    this.builder.buildGPU();
    onStep('gpu', this.builder.getResult());

    await this.delay(600);
    return this.builder.getResult();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
