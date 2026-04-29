import { ShoppingCart, CreditCardStrategy, HogePayStrategy, CryptoStrategy } from './Strategy';
import type { PaymentStrategy } from './Strategy';
import { applyCodeTab } from '../../utils/CodeViewer';
import sourceCode from './Strategy.ts?raw';

export class StrategyView {
  private cart: ShoppingCart;
  private container: HTMLElement;
  private strategies: Record<string, PaymentStrategy> = {
    creditcard: new CreditCardStrategy(),
    hogepay: new HogePayStrategy(),
    crypto: new CryptoStrategy()
  };

  constructor(container: HTMLElement) {
    this.container = container;
    this.cart = new ShoppingCart(this.strategies.creditcard);
  }

  render() {
    this.container.innerHTML = `
      <div class="pattern-container">
        <div class="pattern-header">
          <h2>Strategy（ストラテジー）パターン</h2>
          <p>アルゴリズムをそれぞれカプセル化して、動的に切り替えられるようにするパターンです。利用するクライアント側（ここではショッピングカート）のコードを変更することなく、決済アルゴリズムを切り替えることができます。</p>
        </div>
        
        <div class="strategy-container">
          <div class="payment-form glass-panel">
            <h3>決済（チェックアウト）</h3>
            
            <div class="amount-input-group">
              <label for="amount">支払い金額 ($)</label>
              <input type="number" id="amount" class="amount-input" value="100.00" step="0.01">
            </div>
            
            <div style="margin-top: 1rem;">
              <label style="display:block;margin-bottom:0.5rem;color:var(--text-secondary);font-weight:500;">支払い戦略（決済方法）を選択</label>
              <div class="strategy-options">
                <div class="strategy-card selected" data-strategy="creditcard">
                  <div class="strategy-icon">💳</div>
                  <div class="strategy-name">クレジットカード</div>
                </div>
                <div class="strategy-card" data-strategy="hogepay">
                  <div class="strategy-icon">🅿️</div>
                  <div class="strategy-name">HogePay</div>
                </div>
                <div class="strategy-card" data-strategy="crypto">
                  <div class="strategy-icon">₿</div>
                  <div class="strategy-name">暗号資産</div>
                </div>
              </div>
            </div>
            
            <button id="pay-btn" class="btn" style="margin-top: 1.5rem; width: 100%;">
              支払いを実行する
            </button>
          </div>
          
          <div class="processing-view glass-panel">
            <div id="processing-content" style="text-align: center; color: var(--text-secondary);">
              支払い処理の開始を待機しています...
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    applyCodeTab(this.container, sourceCode);
  }

  private bindEvents() {
    // Strategy selection
    this.container.querySelectorAll('.strategy-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const strategyKey = target.getAttribute('data-strategy');
        
        // Update UI
        this.container.querySelectorAll('.strategy-card').forEach(c => c.classList.remove('selected'));
        target.classList.add('selected');
        
        // Update Context
        if (strategyKey && this.strategies[strategyKey]) {
          this.cart.setStrategy(this.strategies[strategyKey]);
        }
      });
    });

    // Payment processing
    const payBtn = this.container.querySelector('#pay-btn') as HTMLButtonElement;
    payBtn?.addEventListener('click', async () => {
      const amountInput = this.container.querySelector('#amount') as HTMLInputElement;
      const amount = parseFloat(amountInput.value) || 0;
      const processingContent = this.container.querySelector('#processing-content');
      
      if (!processingContent) return;
      
      // Update UI to processing state
      payBtn.disabled = true;
      payBtn.style.opacity = '0.5';
      
      processingContent.innerHTML = `
        <div class="processing-animation">
          <div class="spinner"></div>
          <div>支払い戦略を実行中...</div>
        </div>
      `;

      try {
        const resultMsg = await this.cart.checkout(amount);
        
        // Update UI to success state
        processingContent.innerHTML = `
          <div class="processing-animation">
            <div class="success-mark">✓</div>
            <div style="color: white; font-weight: bold; font-size: 1.25rem;">${resultMsg}</div>
          </div>
        `;
      } catch (error) {
        processingContent.innerHTML = `<div style="color: var(--danger-color);">支払いに失敗しました</div>`;
      } finally {
        payBtn.disabled = false;
        payBtn.style.opacity = '1';
      }
    });
  }
}
