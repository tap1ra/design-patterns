import { NewsletterPublisher, Subscriber } from './Observer';
import { applyCodeTab, highlightFunction } from '../../utils/CodeViewer';
import sourceCode from './Observer.ts?raw';

export class ObserverView {
  private publisher: NewsletterPublisher;
  private container: HTMLElement;
  private allSubscribers: Subscriber[] = [
    new Subscriber('sub1', 'アリス'),
    new Subscriber('sub2', 'ボブ'),
    new Subscriber('sub3', 'チャーリー'),
    new Subscriber('sub4', 'デイブ'),
    new Subscriber('sub5', 'イブ'),
  ];

  constructor(container: HTMLElement) {
    this.container = container;
    this.publisher = new NewsletterPublisher();
    
    // Subscribe first 3 by default
    this.publisher.subscribe(this.allSubscribers[0]);
    this.publisher.subscribe(this.allSubscribers[1]);
    this.publisher.subscribe(this.allSubscribers[2]);
  }

  render() {
    this.container.innerHTML = `
      <div class="pattern-container">
        <div class="pattern-header">
          <h2>Observer（オブザーバー）パターン</h2>
          <p>状態の変化を複数のオブジェクトに一斉に伝播させるパターンです。オブジェクト間に一対多の依存関係を定義し、あるオブジェクトの状態が変わると、依存するすべてのオブジェクトに自動的に通知されます。</p>
        </div>
        
        <div class="observer-grid">
          <div class="publisher-panel glass-panel">
            <h3>発行者 (Subject)</h3>
            <p>ニュースレター配信システム</p>
            <div style="margin-top: auto; padding-top: 1rem;">
              <button id="publish-btn" class="btn">
                <span>📝</span> ニュースレターを発行する
              </button>
            </div>
            
            <div class="console-log" id="observer-log">
              <div class="log-entry">システム準備完了。</div>
            </div>
          </div>
          
          <div class="subscribers-panel glass-panel">
            <h3>購読者 (Observers)</h3>
            <p>ユーザーをクリックすると、発行者への登録（購読）／解除が切り替わります。</p>
            <div class="subscribers-list" id="subscribers-container">
              <!-- Rendered via JS -->
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
    this.renderSubscribers();
    applyCodeTab(this.container, sourceCode);
  }

  private log(message: string) {
    const logEl = this.container.querySelector('#observer-log');
    if (logEl) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = message;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  private bindEvents() {
    const publishBtn = this.container.querySelector('#publish-btn');
    publishBtn?.addEventListener('click', () => {
      highlightFunction(this.container, 'notify');
      this.log('最新のニュースレターを発行中...');
      this.publisher.notify('最新のアップデート情報！');
      this.playPublishAnimation();
    });
  }

  private renderSubscribers() {
    const container = this.container.querySelector('#subscribers-container');
    if (!container) return;
    
    container.innerHTML = '';
    const activeObservers = this.publisher.getObservers();

    this.allSubscribers.forEach(sub => {
      const isActive = activeObservers.includes(sub);
      const card = document.createElement('div');
      card.className = `subscriber-card ${isActive ? 'active' : ''}`;
      card.id = `sub-card-${sub.id}`;
      
      card.innerHTML = `
        <div class="subscriber-icon">${isActive ? '👤' : '👻'}</div>
        <div class="subscriber-name">${sub.name}</div>
        <div style="font-size: 0.75rem; margin-top: 0.5rem; color: ${isActive ? 'var(--success-color)' : 'var(--text-secondary)'}">
          ${isActive ? '購読中' : '未購読'}
        </div>
      `;

      card.addEventListener('click', () => {
        if (isActive) {
          highlightFunction(this.container, 'unsubscribe');
          this.publisher.unsubscribe(sub);
          this.log(`購読を解除しました: ${sub.name}`);
        } else {
          highlightFunction(this.container, 'subscribe');
          this.publisher.subscribe(sub);
          this.log(`購読を開始しました: ${sub.name}`);
        }
        this.renderSubscribers();
      });

      container.appendChild(card);
    });
  }

  private playPublishAnimation() {
    const activeObservers = this.publisher.getObservers();
    const publishBtn = this.container.querySelector('#publish-btn');
    if (!publishBtn) return;
    
    const btnRect = publishBtn.getBoundingClientRect();
    
    activeObservers.forEach((sub, index) => {
      setTimeout(() => {
        const targetCard = this.container.querySelector(`#sub-card-${sub.id}`);
        if (!targetCard) return;
        
        const targetRect = targetCard.getBoundingClientRect();
        
        const particle = document.createElement('div');
        particle.className = 'message-particle';
        
        // Start at button
        particle.style.left = `${btnRect.left + btnRect.width / 2}px`;
        particle.style.top = `${btnRect.top + btnRect.height / 2}px`;
        
        document.body.appendChild(particle);
        
        // Trigger animation
        requestAnimationFrame(() => {
          particle.style.left = `${targetRect.left + targetRect.width / 2}px`;
          particle.style.top = `${targetRect.top + targetRect.height / 2}px`;
        });
        
        // Flash card when message arrives
        setTimeout(() => {
          targetCard.classList.add('receiving');
          (targetCard as HTMLElement).style.transform = 'scale(1.1)';
          (targetCard as HTMLElement).style.boxShadow = '0 0 25px var(--success-color)';
          
          this.log(`[${sub.name}] メッセージを受信・処理しました。`);
          
          setTimeout(() => {
            (targetCard as HTMLElement).style.transform = '';
            (targetCard as HTMLElement).style.boxShadow = '';
          }, 300);
          
          particle.remove();
        }, 800);
        
      }, index * 150); // Stagger animations
    });
  }
}
