import { VendingMachine } from './State';
import { applyCodeTab, highlightFunction } from '../../utils/CodeViewer';
import sourceCode from './State.ts?raw';

export class StateView {
  private machine: VendingMachine;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this.machine = new VendingMachine();
  }

  render() {
    this.container.innerHTML = `
      <div class="pattern-container">
        <div class="pattern-header">
          <h2>State（ステート）パターン</h2>
          <p>オブジェクトの内部状態が変化したときに、その振る舞いを変更できるようにするパターンです。オブジェクトがあたかもクラスを変更したかのように振る舞います。</p>
        </div>
        
        <div class="vending-machine">
          <div class="machine-body">
            <div class="machine-display" id="machine-display">
              INSERT COIN
            </div>
            
            <div class="machine-controls">
              <button class="control-btn coin" id="btn-coin">硬貨</button>
              <button class="control-btn" id="btn-eject" style="background:#ef4444;box-shadow:0 5px 0 #991b1b;">返却</button>
              <button class="control-btn" id="btn-push" style="background:#3b82f6;box-shadow:0 5px 0 #1e40af;grid-column: span 2;">購入</button>
            </div>
            
            <div class="dispense-slot">
              <div class="item" id="dispensed-item"></div>
            </div>
          </div>
          
          <div class="state-info glass-panel">
            <h3>ステートマシンの状態遷移</h3>
            <p>現在アクティブな状態がハイライトされます。</p>
            
            <div class="state-diagram" style="margin-top: 1rem;">
              <div class="state-node active" id="node-IdleState">IdleState（待機）</div>
              <div style="text-align:center;color:var(--text-secondary);">↓ (硬貨投入) / ↑ (硬貨返却)</div>
              <div class="state-node" id="node-HasCoinState">HasCoinState（硬貨投入済み）</div>
              <div style="text-align:center;color:var(--text-secondary);">↓ (購入ボタンを押す)</div>
              <div class="state-node" id="node-DispensingState">DispensingState（排出中）</div>
              <div style="text-align:center;color:var(--text-secondary);">↓ (排出完了、待機へ戻る)</div>
            </div>
            
            <div class="console-log" id="state-log" style="margin-top: 2rem;">
              <div class="log-entry">自動販売機が起動しました。</div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    applyCodeTab(this.container, sourceCode);
  }

  private log(message: string) {
    const logEl = this.container.querySelector('#state-log');
    if (logEl) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = message;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  private updateDisplay(stateName: string) {
    const display = this.container.querySelector('#machine-display');
    if (display) {
      if (stateName === 'IdleState') display.textContent = 'INSERT COIN';
      if (stateName === 'HasCoinState') display.textContent = 'READY. PUSH BTN';
      if (stateName === 'DispensingState') display.textContent = 'DISPENSING...';
    }
    
    // Update diagram nodes
    this.container.querySelectorAll('.state-node').forEach(node => {
      node.classList.remove('active');
    });
    const activeNode = this.container.querySelector(`#node-${stateName}`);
    if (activeNode) {
      activeNode.classList.add('active');
    }
  }

  private bindEvents() {
    this.machine.onLog = (msg) => this.log(msg);
    this.machine.onStateChange = (stateName) => this.updateDisplay(stateName);
    this.machine.onDispense = () => {
      const item = this.container.querySelector('#dispensed-item');
      if (item) {
        item.classList.remove('dispensing');
        // trigger reflow
        void (item as HTMLElement).offsetWidth;
        item.classList.add('dispensing');
      }
    };

    this.container.querySelector('#btn-coin')?.addEventListener('click', () => {
      highlightFunction(this.container, 'insertCoin');
      this.machine.insertCoin();
    });
    
    this.container.querySelector('#btn-eject')?.addEventListener('click', () => {
      highlightFunction(this.container, 'ejectCoin');
      this.machine.ejectCoin();
    });
    
    this.container.querySelector('#btn-push')?.addEventListener('click', () => {
      highlightFunction(this.container, 'pressButton');
      this.machine.pressButton();
    });
  }
}
