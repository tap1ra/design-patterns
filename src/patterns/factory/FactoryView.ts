import { UIFactory, DarkThemeFactory, LightThemeFactory } from './Factory';
import type { UIComponent } from './Factory';

export class FactoryView {
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  render() {
    this.container.innerHTML = `
      <div class="pattern-container">
        <div class="pattern-header">
          <h2>Factory Method（ファクトリ）パターン</h2>
          <p>インスタンスの生成をサブクラス（ファクトリ）に委譲するパターンです。クライアント（呼び出し側）は具象クラス（例：DarkButton）を直接 new せず、ファクトリに「ボタンを作って」と依頼するだけで適切なオブジェクトを受け取れます。</p>
        </div>
        
        <div class="factory-container" style="display:flex; gap: 2rem; margin-top: 2rem;">
          
          <div class="glass-panel" style="flex: 1;">
            <h3>コンポーネント製造ライン</h3>
            
            <div style="margin-top: 1.5rem; margin-bottom: 1rem;">
              <label style="display:block;margin-bottom:0.5rem;color:var(--text-secondary);">テーマファクトリの選択</label>
              <select id="factory-theme" style="width:100%; padding: 0.75rem; background: rgba(15,23,42,0.6); color: white; border: 1px solid var(--border-color); border-radius: 0.5rem;">
                <option value="dark">Dark Theme Factory</option>
                <option value="light">Light Theme Factory</option>
              </select>
            </div>
            
            <div style="display: flex; gap: 1rem;">
              <button id="btn-create-btn" class="btn" style="flex:1;">Buttonを製造</button>
              <button id="btn-create-input" class="btn" style="flex:1;">Inputを製造</button>
            </div>
          </div>
          
          <div class="glass-panel" style="flex: 1; display:flex; flex-direction:column;">
            <h3>製造されたプロダクト</h3>
            <div id="product-display" style="flex:1; background: rgba(0,0,0,0.2); border-radius: 0.5rem; padding: 1.5rem; margin-top: 1rem; display:flex; flex-direction:column; gap:1rem; align-items:center; overflow-y:auto; max-height: 250px;">
              <span style="color:var(--text-secondary);">ここにコンポーネントが出力されます</span>
            </div>
          </div>
        </div>

        <div class="console-log" id="factory-log" style="margin-top: 2rem;">
          <div class="log-entry">UIコンポーネント工場が稼働開始しました。</div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private log(message: string) {
    const logEl = this.container.querySelector('#factory-log');
    if (logEl) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = message;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  private renderProduct(component: UIComponent) {
    const display = this.container.querySelector('#product-display');
    if (display) {
      // Remove placeholder if exists
      const placeholder = display.querySelector('span');
      if (placeholder) placeholder.remove();

      const wrapper = document.createElement('div');
      wrapper.innerHTML = component.render();
      wrapper.style.animation = 'fadeIn 0.5s ease-out';
      
      display.appendChild(wrapper);
      display.scrollTop = display.scrollHeight;
    }
  }

  private bindEvents() {
    const btnCreateBtn = this.container.querySelector('#btn-create-btn');
    const btnCreateInput = this.container.querySelector('#btn-create-input');
    const selectTheme = this.container.querySelector('#factory-theme') as HTMLSelectElement;

    const getFactory = (): UIFactory => {
      if (selectTheme.value === 'dark') return new DarkThemeFactory();
      return new LightThemeFactory();
    };

    btnCreateBtn?.addEventListener('click', () => {
      const factory = getFactory();
      this.log(`${factory.constructor.name} に Button の製造を依頼しました...`);
      
      const component = factory.createButton();
      this.log(`-> ${component.getType()} が製造されました！`);
      
      this.renderProduct(component);
    });

    btnCreateInput?.addEventListener('click', () => {
      const factory = getFactory();
      this.log(`${factory.constructor.name} に Input の製造を依頼しました...`);
      
      const component = factory.createInput();
      this.log(`-> ${component.getType()} が製造されました！`);
      
      this.renderProduct(component);
    });
  }
}
