import { SettingsManager } from './Singleton';

export class SingletonView {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <div class="pattern-container">
        <div class="pattern-header">
          <h2>Singleton（シングルトン）パターン</h2>
          <p>クラスのインスタンスがシステム全体で「1つしか生成されないこと」を保証するパターンです。どこからアクセスしても常に同じインスタンス（同じ状態）が返されます。</p>
        </div>
        
        <div class="singleton-container" style="display:flex; gap: 2rem; margin-top: 2rem;">
          <!-- Component A -->
          <div class="glass-panel" style="flex: 1;">
            <h3>コンポーネント A</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">設定マネージャーのインスタンスを取得し、テーマを変更します。</p>
            <button id="btn-get-a" class="btn btn-secondary" style="margin-bottom: 1rem; width: 100%;">
              インスタンスを取得
            </button>
            <div id="instance-info-a" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; min-height: 80px;">
              未取得
            </div>
            
            <div style="display: flex; gap: 0.5rem;">
              <button id="btn-theme-dark" class="btn" style="flex:1;" disabled>Dark Theme</button>
              <button id="btn-theme-light" class="btn" style="flex:1;" disabled>Light Theme</button>
            </div>
          </div>
          
          <!-- Component B -->
          <div class="glass-panel" style="flex: 1;">
            <h3>コンポーネント B</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1rem;">コンポーネントAとは別の場所から設定マネージャーを取得します。</p>
            <button id="btn-get-b" class="btn btn-secondary" style="margin-bottom: 1rem; width: 100%;">
              インスタンスを取得
            </button>
            <div id="instance-info-b" style="background: rgba(0,0,0,0.2); padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; min-height: 80px;">
              未取得
            </div>
            <button id="btn-refresh-b" class="btn" style="width: 100%;" disabled>
              設定を再読み込み
            </button>
          </div>
        </div>

        <div class="console-log" id="singleton-log" style="margin-top: 2rem;">
          <div class="log-entry">システム起動。設定マネージャーはまだ初期化されていません。</div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private log(message: string) {
    const logEl = this.container.querySelector('#singleton-log');
    if (logEl) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = message;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  private updateInstanceInfo(elId: string, instance: SettingsManager) {
    const infoEl = this.container.querySelector(`#${elId}`);
    if (infoEl) {
      const settings = instance.getAllSettings();
      infoEl.innerHTML = `
        <div style="color: var(--success-color); font-weight: bold; margin-bottom: 0.5rem;">Instance ID: ${instance.instanceId}</div>
        <div style="font-size: 0.875rem;">Theme: ${settings.theme}</div>
      `;
      
      // highlight animation
      infoEl.classList.remove('pulse-highlight');
      void (infoEl as HTMLElement).offsetWidth;
      infoEl.classList.add('pulse-highlight');
    }
  }

  private bindEvents() {
    let instanceA: SettingsManager | null = null;
    let instanceB: SettingsManager | null = null;

    const btnGetA = this.container.querySelector('#btn-get-a') as HTMLButtonElement;
    const btnGetB = this.container.querySelector('#btn-get-b') as HTMLButtonElement;
    const btnDark = this.container.querySelector('#btn-theme-dark') as HTMLButtonElement;
    const btnLight = this.container.querySelector('#btn-theme-light') as HTMLButtonElement;
    const btnRefreshB = this.container.querySelector('#btn-refresh-b') as HTMLButtonElement;

    btnGetA.addEventListener('click', () => {
      instanceA = SettingsManager.getInstance();
      this.log(`コンポーネントA: インスタンスを取得しました。(ID: ${instanceA.instanceId})`);
      this.updateInstanceInfo('instance-info-a', instanceA);
      btnDark.disabled = false;
      btnLight.disabled = false;
    });

    btnGetB.addEventListener('click', () => {
      instanceB = SettingsManager.getInstance();
      this.log(`コンポーネントB: インスタンスを取得しました。(ID: ${instanceB.instanceId})`);
      if (instanceA && instanceA === instanceB) {
        this.log('検証: コンポーネントAとBのインスタンスは完全に同一です。');
      }
      this.updateInstanceInfo('instance-info-b', instanceB);
      btnRefreshB.disabled = false;
    });

    btnDark.addEventListener('click', () => {
      if (instanceA) {
        instanceA.setSetting('theme', 'dark');
        this.log('コンポーネントA: テーマを dark に変更しました。');
        this.updateInstanceInfo('instance-info-a', instanceA);
      }
    });

    btnLight.addEventListener('click', () => {
      if (instanceA) {
        instanceA.setSetting('theme', 'light');
        this.log('コンポーネントA: テーマを light に変更しました。');
        this.updateInstanceInfo('instance-info-a', instanceA);
      }
    });

    btnRefreshB.addEventListener('click', () => {
      if (instanceB) {
        this.log(`コンポーネントB: 設定を読み込みました -> テーマは ${instanceB.getSetting('theme')} です。`);
        this.updateInstanceInfo('instance-info-b', instanceB);
      }
    });
  }
}
