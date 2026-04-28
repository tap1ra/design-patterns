import { HomeTheaterFacade } from './Facade';

export class FacadeView {
  private container: HTMLElement;
  private facade: HomeTheaterFacade;

  constructor(container: HTMLElement) {
    this.container = container;
    this.facade = new HomeTheaterFacade();
  }

  render() {
    this.container.innerHTML = `
      <div class="pattern-container">
        <div class="pattern-header">
          <h2>Facade（ファサード）パターン</h2>
          <p>複数の複雑なサブシステムに対して、シンプルで統一されたインターフェース（窓口）を提供するパターンです。クライアントはファサードとだけやり取りすればよく、裏側の複雑な連携を意識する必要がありません。</p>
        </div>
        
        <div style="display:flex; gap: 2rem; margin-top: 2rem;">
          
          <!-- Facade Interface (Client View) -->
          <div class="glass-panel" style="flex: 1;">
            <h3>ホームシアター操作パネル (Facade)</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem;">ユーザーはこのパネルのボタンを1つ押すだけです。</p>
            
            <div style="display: flex; flex-direction: column; gap: 1rem;">
              <button id="btn-watch" class="btn" style="padding: 1.5rem; font-size: 1.25rem;">
                🎬 映画を観る
              </button>
              <button id="btn-end" class="btn btn-secondary" style="padding: 1.5rem; font-size: 1.25rem;" disabled>
                ⏹️ 終了する
              </button>
            </div>
          </div>
          
          <!-- Subsystems Visualization -->
          <div class="glass-panel" style="flex: 1.5; min-height: 350px; display: flex; flex-direction: column;">
            <h3>裏側のサブシステム群</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem;">Facadeの裏で、複数のシステムが連携して動きます。</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; flex: 1;">
              
              <div id="sys-lights" class="sys-card">
                <div class="sys-icon">💡</div>
                <div class="sys-name">照明 (Lights)</div>
                <div class="sys-status">ON</div>
              </div>
              
              <div id="sys-screen" class="sys-card">
                <div class="sys-icon">🎞️</div>
                <div class="sys-name">スクリーン (Screen)</div>
                <div class="sys-status">収納済み (UP)</div>
              </div>
              
              <div id="sys-projector" class="sys-card">
                <div class="sys-icon">📽️</div>
                <div class="sys-name">プロジェクター (Projector)</div>
                <div class="sys-status">OFF</div>
              </div>
              
              <div id="sys-amp" class="sys-card">
                <div class="sys-icon">🔊</div>
                <div class="sys-name">アンプ (Amplifier)</div>
                <div class="sys-status">OFF</div>
              </div>
              
            </div>
          </div>
        </div>

        <div class="console-log" id="facade-log" style="margin-top: 2rem;">
          <div class="log-entry">システム待機中...</div>
        </div>
      </div>
    `;

    // Add specific styles
    const style = document.createElement('style');
    style.textContent = `
      .sys-card {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid var(--border-color);
        border-radius: 0.5rem;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
      }
      .sys-card.active {
        border-color: var(--primary-color);
        box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        background: rgba(59, 130, 246, 0.1);
      }
      .sys-icon {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
      }
      .sys-name {
        font-weight: bold;
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
      }
      .sys-status {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
    `;
    this.container.appendChild(style);

    this.bindEvents();
  }

  private log(message: string) {
    const logEl = this.container.querySelector('#facade-log');
    if (logEl) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = message;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  private updateSysUI(system: string, statusText: string) {
    if (system === 'general') return;

    const card = this.container.querySelector(`#sys-${system}`);
    if (card) {
      const status = card.querySelector('.sys-status');
      if (status) status.textContent = statusText;
      
      card.classList.remove('active');
      void (card as HTMLElement).offsetWidth; // trigger reflow
      card.classList.add('active');
      
      // keep active state a bit longer for visual feedback
      setTimeout(() => {
        card.classList.remove('active');
      }, 700);
    }
  }

  private bindEvents() {
    const btnWatch = this.container.querySelector('#btn-watch') as HTMLButtonElement;
    const btnEnd = this.container.querySelector('#btn-end') as HTMLButtonElement;

    this.facade.onStep = (msg, system) => {
      this.log(`[${system.toUpperCase()}] ${msg}`);
      
      // Update UI based on system and action
      if (system === 'lights') {
        const isDim = msg.includes('暗く');
        this.updateSysUI(system, isDim ? 'DIM (10%)' : 'ON (100%)');
        const card = this.container.querySelector('#sys-lights');
        if (card) (card as HTMLElement).style.opacity = isDim ? '0.5' : '1';
      } else if (system === 'screen') {
        this.updateSysUI(system, msg.includes('下ろし') ? '展開中 (DOWN)' : '収納済み (UP)');
      } else if (system === 'projector') {
        this.updateSysUI(system, msg.includes('オフ') ? 'OFF' : 'ON (WIDESCREEN)');
      } else if (system === 'amp') {
        this.updateSysUI(system, msg.includes('オフ') ? 'OFF' : 'ON (VOL 5, 5.1ch)');
      }
    };

    btnWatch?.addEventListener('click', async () => {
      btnWatch.disabled = true;
      btnEnd.disabled = true;
      this.log('--- ユーザーが「映画を観る」ボタンを押しました ---');
      
      await this.facade.watchMovie('インセプション');
      
      btnEnd.disabled = false;
    });

    btnEnd?.addEventListener('click', async () => {
      btnWatch.disabled = true;
      btnEnd.disabled = true;
      this.log('--- ユーザーが「終了する」ボタンを押しました ---');
      
      await this.facade.endMovie();
      
      btnWatch.disabled = false;
    });
  }
}
