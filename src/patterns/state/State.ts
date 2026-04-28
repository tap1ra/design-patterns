// Context
export class VendingMachine {
  private state: State;

  constructor() {
    this.state = new IdleState(this);
  }

  transitionTo(state: State): void {
    console.log(`VendingMachine: 状態が ${(state as any).constructor.name} に移行しました。`);
    this.state = state;
    if (this.onStateChange) {
      this.onStateChange((state as any).constructor.name);
    }
  }

  // Callbacks for UI
  onStateChange: ((stateName: string) => void) | null = null;
  onDispense: (() => void) | null = null;
  onLog: ((msg: string) => void) | null = null;

  log(msg: string) {
    if (this.onLog) this.onLog(msg);
    else console.log(msg);
  }

  // Actions delegated to state
  insertCoin(): void {
    this.state.insertCoin();
  }

  ejectCoin(): void {
    this.state.ejectCoin();
  }

  pressButton(): void {
    this.state.pressButton();
  }

  dispense(): void {
    this.state.dispense();
  }

  triggerDispenseAnimation(): void {
    if (this.onDispense) this.onDispense();
  }
}

// State Interface
export interface State {
  machine: VendingMachine;
  insertCoin(): void;
  ejectCoin(): void;
  pressButton(): void;
  dispense(): void;
}

export class IdleState implements State {
  machine: VendingMachine;

  constructor(machine: VendingMachine) {
    this.machine = machine;
  }

  insertCoin(): void {
    this.machine.log('硬貨が投入されました。');
    this.machine.transitionTo(new HasCoinState(this.machine));
  }

  ejectCoin(): void {
    this.machine.log('返却する硬貨がありません。');
  }

  pressButton(): void {
    this.machine.log('先に硬貨を投入してください。');
  }

  dispense(): void {
    this.machine.log('支払いが必要です。');
  }
}

export class HasCoinState implements State {
  machine: VendingMachine;

  constructor(machine: VendingMachine) {
    this.machine = machine;
  }

  insertCoin(): void {
    this.machine.log('すでに硬貨は投入されています。');
  }

  ejectCoin(): void {
    this.machine.log('硬貨を返却しました。');
    this.machine.transitionTo(new IdleState(this.machine));
  }

  pressButton(): void {
    this.machine.log('ボタンが押されました。処理中...');
    this.machine.transitionTo(new DispensingState(this.machine));
    // Simulate internal mechanism processing
    setTimeout(() => {
      this.machine.dispense();
    }, 500);
  }

  dispense(): void {
    this.machine.log('まだ商品は排出されていません。');
  }
}

export class DispensingState implements State {
  machine: VendingMachine;

  constructor(machine: VendingMachine) {
    this.machine = machine;
  }

  insertCoin(): void {
    this.machine.log('お待ちください。現在排出中です。');
  }

  ejectCoin(): void {
    this.machine.log('返却できません。すでに排出処理が始まっています。');
  }

  pressButton(): void {
    this.machine.log('処理中です...');
  }

  dispense(): void {
    this.machine.log('商品が排出されました！ありがとうございます。');
    this.machine.triggerDispenseAnimation();
    
    setTimeout(() => {
      this.machine.transitionTo(new IdleState(this.machine));
    }, 1500);
  }
}
