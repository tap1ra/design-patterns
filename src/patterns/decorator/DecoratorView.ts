import { SimpleCoffee, MilkDecorator, WhipCreamDecorator, CaramelSyrupDecorator } from './Decorator';
import type { Coffee } from './Decorator';
import { applyCodeTab } from '../../utils/CodeViewer';
import sourceCode from './Decorator.ts?raw';

export class DecoratorView {
  private container: HTMLElement;
  private currentCoffee: Coffee;

  constructor(container: HTMLElement) {
    this.container = container;
    this.currentCoffee = new SimpleCoffee();
  }

  render() {
    this.container.innerHTML = `
      <div class="pattern-container">
        <div class="pattern-header">
          <h2>Decorator（デコレーター）パターン</h2>
          <p>オブジェクトに動的に新しい責任（機能や装飾）を追加するパターンです。サブクラス化の代わりに、デコレーターオブジェクトで元のオブジェクトを包み込むことで柔軟な機能拡張を実現します。</p>
        </div>
        
        <div style="display:flex; gap: 2rem; margin-top: 2rem;">
          <!-- Controls -->
          <div class="glass-panel" style="flex: 1;">
            <h3>コーヒーをカスタマイズ</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem;">トッピングを追加して、元のコーヒーオブジェクトをデコレート（装飾）します。</p>
            
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
              <button id="btn-milk" class="btn btn-secondary">
                🥛 ミルクを追加 (+¥50)
              </button>
              <button id="btn-whip" class="btn btn-secondary">
                🍦 ホイップを追加 (+¥100)
              </button>
              <button id="btn-caramel" class="btn btn-secondary">
                🍯 キャラメルを追加 (+¥80)
              </button>
              
              <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1rem 0;">
              
              <button id="btn-reset" class="btn" style="background: var(--danger-color);">
                🗑️ 最初から作り直す
              </button>
            </div>
          </div>
          
          <!-- Visualization -->
          <div class="glass-panel" style="flex: 1.5; display: flex; flex-direction: column; align-items: center; justify-content: center; position: relative; min-height: 350px;">
            <h3>完成品プレビュー</h3>
            
            <!-- Coffee Cup Visualization -->
            <div id="coffee-cup-container" style="position: relative; width: 150px; height: 200px; margin: 2rem auto;">
              <!-- Visualized via JS -->
            </div>

            <!-- Receipt -->
            <div style="width: 100%; background: #fff; color: #000; padding: 1rem; border-radius: 0.25rem; font-family: 'Courier New', monospace; font-size: 0.875rem; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
              <div style="text-align: center; border-bottom: 1px dashed #000; padding-bottom: 0.5rem; margin-bottom: 0.5rem; font-weight: bold;">ORDER RECEIPT</div>
              <div id="receipt-desc" style="margin-bottom: 0.5rem;">シンプルなコーヒー</div>
              <div style="display: flex; justify-content: space-between; border-top: 1px dashed #000; padding-top: 0.5rem; font-weight: bold;">
                <span>TOTAL</span>
                <span id="receipt-cost">¥300</span>
              </div>
            </div>
            
          </div>
        </div>

        <div class="console-log" id="decorator-log" style="margin-top: 2rem;">
          <div class="log-entry">新しい注文を開始しました。</div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.updateUI();
    applyCodeTab(this.container, sourceCode);
  }

  private log(message: string) {
    const logEl = this.container.querySelector('#decorator-log');
    if (logEl) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = message;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  private updateUI() {
    const desc = this.container.querySelector('#receipt-desc');
    const cost = this.container.querySelector('#receipt-cost');
    const cupContainer = this.container.querySelector('#coffee-cup-container');
    
    if (desc) desc.textContent = this.currentCoffee.getDescription();
    if (cost) cost.textContent = `¥${this.currentCoffee.getCost()}`;
    
    if (cupContainer) {
      cupContainer.innerHTML = ''; // clear
      
      const ingredients = this.currentCoffee.getIngredients();
      
      // Base Cup
      const cup = document.createElement('div');
      cup.style.cssText = `
        position: absolute;
        bottom: 0; left: 25px;
        width: 100px; height: 120px;
        background: #e2e8f0;
        border-radius: 5px 5px 40px 40px;
        box-shadow: inset -10px 0 20px rgba(0,0,0,0.1);
        z-index: 10;
        overflow: hidden;
      `;
      cupContainer.appendChild(cup);

      // Handle (just for visuals)
      const handle = document.createElement('div');
      handle.style.cssText = `
        position: absolute;
        bottom: 40px; right: 5px;
        width: 40px; height: 60px;
        border: 15px solid #e2e8f0;
        border-radius: 20px;
        z-index: 5;
      `;
      cupContainer.appendChild(handle);

      // Coffee Liquid
      const liquid = document.createElement('div');
      liquid.style.cssText = `
        position: absolute;
        bottom: 0; left: 0;
        width: 100%; height: 80%;
        background: #422006;
        z-index: 11;
      `;
      cup.appendChild(liquid);

      // Decorators
      let currentBottom = 120; // top of cup

      ingredients.forEach((ing, idx) => {
        if (ing === 'coffee_base') return;

        const layer = document.createElement('div');
        layer.style.position = 'absolute';
        layer.style.left = '25px';
        layer.style.width = '100px';
        layer.style.zIndex = (20 + idx).toString();
        layer.style.animation = 'dropIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

        if (ing === 'milk') {
          // Add milk into liquid
          const milkLayer = document.createElement('div');
          milkLayer.style.cssText = `
            position: absolute;
            bottom: ${20 * idx}%; left: 0;
            width: 100%; height: 30%;
            background: rgba(255,255,255,0.4);
            z-index: 12;
            animation: fadeIn 0.5s;
          `;
          cup.appendChild(milkLayer);
        } else if (ing === 'whip') {
          layer.style.bottom = `${currentBottom - 20}px`;
          layer.style.height = '60px';
          layer.style.background = '#f8fafc';
          layer.style.borderRadius = '50px 50px 10px 10px';
          layer.style.boxShadow = '0 -5px 10px rgba(0,0,0,0.1)';
          cupContainer.appendChild(layer);
          currentBottom += 30;
        } else if (ing === 'caramel') {
          layer.style.bottom = `${currentBottom - 10}px`;
          layer.style.height = '15px';
          layer.style.background = '#ca8a04';
          layer.style.borderRadius = '10px';
          layer.style.width = '80px';
          layer.style.left = '35px';
          cupContainer.appendChild(layer);
          currentBottom += 10;
        }
      });
    }
  }

  private bindEvents() {
    this.container.querySelector('#btn-milk')?.addEventListener('click', () => {
      this.currentCoffee = new MilkDecorator(this.currentCoffee);
      this.log('デコレーター適用: ミルクを追加しました。');
      this.updateUI();
    });

    this.container.querySelector('#btn-whip')?.addEventListener('click', () => {
      this.currentCoffee = new WhipCreamDecorator(this.currentCoffee);
      this.log('デコレーター適用: ホイップクリームを追加しました。');
      this.updateUI();
    });

    this.container.querySelector('#btn-caramel')?.addEventListener('click', () => {
      this.currentCoffee = new CaramelSyrupDecorator(this.currentCoffee);
      this.log('デコレーター適用: キャラメルシロップを追加しました。');
      this.updateUI();
    });

    this.container.querySelector('#btn-reset')?.addEventListener('click', () => {
      this.currentCoffee = new SimpleCoffee();
      this.log('リセット: シンプルなコーヒーに戻しました。');
      this.updateUI();
    });
  }
}
