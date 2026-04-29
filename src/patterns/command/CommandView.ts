import { SmartLight, RemoteControl, TurnOnLightCommand, TurnOffLightCommand, DimLightCommand } from './Command';
import { applyCodeTab, highlightFunction } from '../../utils/CodeViewer';
import sourceCode from './Command.ts?raw';

export class CommandView {
  private container: HTMLElement;
  private light: SmartLight;
  private remote: RemoteControl;

  constructor(container: HTMLElement) {
    this.container = container;
    this.light = new SmartLight();
    this.remote = new RemoteControl();
  }

  render() {
    this.container.innerHTML = `
      <div class="pattern-container">
        <div class="pattern-header">
          <h2>Command（コマンド）パターン</h2>
          <p>「要求（操作）」をオブジェクトとしてカプセル化するパターンです。操作をオブジェクト化することで、履歴としてキューに保存でき、操作のUndo（取り消し）やログの記録が容易になります。</p>
        </div>
        
        <div class="command-container" style="display:flex; gap: 2rem; margin-top: 2rem;">
          
          <!-- Invoker (Remote) -->
          <div class="glass-panel" style="flex: 1; max-width: 300px;">
            <h3>スマートリモコン</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem;">ボタンを押すとコマンドオブジェクトが生成され、実行されます。</p>
            
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <button id="btn-on" class="btn" style="background: var(--success-color);">
                💡 電源 ON
              </button>
              <button id="btn-dim" class="btn btn-secondary">
                🔉 暗くする (-20%)
              </button>
              <button id="btn-off" class="btn" style="background: var(--danger-color);">
                🌑 電源 OFF
              </button>
              
              <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1rem 0;">
              
              <button id="btn-undo" class="btn" style="background: var(--accent-color);" disabled>
                ↩️ Undo（元に戻す）
              </button>
            </div>
          </div>
          
          <!-- Receiver (Light) & Queue -->
          <div style="flex: 1; display:flex; flex-direction:column; gap: 1rem;">
            
            <!-- Receiver Visualizer -->
            <div class="glass-panel" style="display:flex; flex-direction:column; align-items:center; justify-content:center; padding: 3rem;">
              <div id="light-bulb" style="font-size: 5rem; transition: all 0.3s; filter: grayscale(100%); opacity: 0.3;">
                💡
              </div>
              <div id="light-status" style="margin-top: 1rem; font-family: var(--font-display); font-size: 1.5rem; font-weight: bold;">
                OFF
              </div>
            </div>

            <!-- History Stack -->
            <div class="glass-panel">
              <h3>コマンド履歴（Stack）</h3>
              <div id="command-stack" style="display:flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 1rem; min-height: 40px;">
                <!-- Stack visualized here -->
              </div>
            </div>
            
          </div>
        </div>

        <div class="console-log" id="command-log" style="margin-top: 2rem;">
          <div class="log-entry">スマートホームシステム起動。</div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.updateUI();
    applyCodeTab(this.container, sourceCode);
  }

  private log(message: string) {
    const logEl = this.container.querySelector('#command-log');
    if (logEl) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = message;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  private updateUI() {
    const status = this.light.getStatus();
    const bulb = this.container.querySelector('#light-bulb') as HTMLElement;
    const statusText = this.container.querySelector('#light-status') as HTMLElement;
    const undoBtn = this.container.querySelector('#btn-undo') as HTMLButtonElement;
    const stackContainer = this.container.querySelector('#command-stack');

    // Update Light Bulb Visually
    if (status.isOn) {
      bulb.style.filter = 'grayscale(0%)';
      const opacity = Math.max(0.2, status.brightness / 100);
      bulb.style.opacity = opacity.toString();
      bulb.style.textShadow = `0 0 ${status.brightness / 2}px rgba(250, 204, 21, ${opacity})`;
      statusText.textContent = `ON (${status.brightness}%)`;
      statusText.style.color = 'var(--success-color)';
    } else {
      bulb.style.filter = 'grayscale(100%)';
      bulb.style.opacity = '0.3';
      bulb.style.textShadow = 'none';
      statusText.textContent = 'OFF';
      statusText.style.color = 'var(--text-secondary)';
    }

    // Update Undo Button State
    undoBtn.disabled = this.remote.getHistoryCount() === 0;

    // Update History Stack Visually
    if (stackContainer) {
      // @ts-ignore - accessing private field for visualization purposes only
      const history = this.remote.history;
      stackContainer.innerHTML = '';
      
      if (history.length === 0) {
        stackContainer.innerHTML = '<span style="color:var(--text-secondary);font-size:0.875rem;">履歴なし</span>';
      } else {
        history.forEach((cmd: any) => {
          const badge = document.createElement('span');
          badge.style.cssText = `
            background: rgba(139, 92, 246, 0.2);
            color: #c4b5fd;
            border: 1px solid rgba(139, 92, 246, 0.5);
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-size: 0.75rem;
            animation: fadeIn 0.3s ease-out;
          `;
          badge.textContent = cmd.constructor.name.replace('Command', '');
          stackContainer.appendChild(badge);
        });
      }
    }
  }

  private bindEvents() {
    this.container.querySelector('#btn-on')?.addEventListener('click', () => {
      highlightFunction(this.container, 'executeCommand');
      this.log('ユーザー: 「電源 ON」コマンドを実行');
      this.remote.executeCommand(new TurnOnLightCommand(this.light));
      this.updateUI();
    });

    this.container.querySelector('#btn-dim')?.addEventListener('click', () => {
      if (!this.light.getStatus().isOn) {
        this.log('エラー: 電源がオフの時は暗くできません。');
        return;
      }
      highlightFunction(this.container, 'executeCommand');
      this.log('ユーザー: 「暗くする」コマンドを実行');
      this.remote.executeCommand(new DimLightCommand(this.light));
      this.updateUI();
    });

    this.container.querySelector('#btn-off')?.addEventListener('click', () => {
      highlightFunction(this.container, 'executeCommand');
      this.log('ユーザー: 「電源 OFF」コマンドを実行');
      this.remote.executeCommand(new TurnOffLightCommand(this.light));
      this.updateUI();
    });

    this.container.querySelector('#btn-undo')?.addEventListener('click', () => {
      highlightFunction(this.container, 'undoCommand');
      this.log('ユーザー: Undo（取り消し）を実行');
      const success = this.remote.undoCommand();
      if (success) {
        this.log('-> 直前のコマンドを取り消しました。');
      }
      this.updateUI();
    });
  }
}
