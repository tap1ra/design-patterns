import { Director, GamingComputerBuilder, OfficeComputerBuilder } from './Builder';

export class BuilderView {
  private container: HTMLElement;
  private director: Director;

  constructor(container: HTMLElement) {
    this.container = container;
    this.director = new Director();
  }

  render() {
    this.container.innerHTML = `
      <div class="pattern-container">
        <div class="pattern-header">
          <h2>Builder（ビルダー）パターン</h2>
          <p>複雑なオブジェクトの構築手順（Director）と、実際の部品の表現（Builder）を分離するパターンです。同じ手順で異なる構成のオブジェクトを作り出すことができます。</p>
        </div>
        
        <div style="display:flex; gap: 2rem; margin-top: 2rem;">
          
          <!-- Director Panel -->
          <div class="glass-panel" style="flex: 1;">
            <h3>ディレクター（構築指示）</h3>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-bottom: 1.5rem;">どのようなPCを作るかビルダーを指定し、組み立てを指示します。</p>
            
            <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
              <button id="btn-build-gaming" class="btn" style="flex:1;">
                🎮 ゲーミングPCを構築
              </button>
              <button id="btn-build-office" class="btn btn-secondary" style="flex:1;">
                💼 オフィスPCを構築
              </button>
            </div>
            
            <div id="build-progress" style="display: none; flex-direction: column; gap: 0.5rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.875rem;">
                <span id="progress-text">準備中...</span>
                <span id="progress-percent">0%</span>
              </div>
              <div style="width: 100%; height: 8px; background: rgba(0,0,0,0.3); border-radius: 4px; overflow: hidden;">
                <div id="progress-bar" style="height: 100%; width: 0%; background: var(--primary-color); transition: width 0.3s;"></div>
              </div>
            </div>
          </div>
          
          <!-- Product Panel -->
          <div class="glass-panel" style="flex: 1.5; min-height: 350px; display: flex; flex-direction: column;">
            <h3>組み立て中のPC (Product)</h3>
            
            <div style="flex: 1; display: flex; align-items: center; justify-content: center; position: relative;">
              
              <!-- PC Chassis Visual -->
              <div id="pc-chassis" style="width: 200px; height: 250px; border: 3px solid #334155; border-radius: 10px; background: #0f172a; position: relative; display: flex; flex-direction: column; padding: 1rem; gap: 1rem; transition: all 0.5s;">
                
                <div id="part-cpu" class="pc-part" style="opacity: 0.2; width: 60px; height: 60px; background: #3b82f6; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; margin: 0 auto;">CPU</div>
                
                <div style="display: flex; gap: 0.5rem; justify-content: center;">
                  <div id="part-ram" class="pc-part" style="opacity: 0.2; width: 15px; height: 80px; background: #10b981; border-radius: 2px;"></div>
                  <div id="part-ram" class="pc-part" style="opacity: 0.2; width: 15px; height: 80px; background: #10b981; border-radius: 2px;"></div>
                </div>
                
                <div id="part-gpu" class="pc-part" style="opacity: 0.2; width: 150px; height: 30px; background: #8b5cf6; border-radius: 5px; position: absolute; bottom: 50px; left: 25px; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;">GPU</div>
                
                <div id="part-storage" class="pc-part" style="opacity: 0.2; width: 40px; height: 20px; background: #f59e0b; border-radius: 2px; position: absolute; bottom: 20px; right: 20px; font-size: 0.5rem; display: flex; align-items: center; justify-content: center; color: black;">SSD</div>

              </div>
              
              <!-- Specs Details -->
              <div id="pc-specs" style="position: absolute; right: 0; background: rgba(30, 41, 59, 0.9); padding: 1rem; border-radius: 0.5rem; border: 1px solid var(--border-color); font-size: 0.875rem; opacity: 0; transition: opacity 0.3s; transform: translateX(20px);">
                <!-- Rendered via JS -->
              </div>
            </div>
            
          </div>
        </div>

        <div class="console-log" id="builder-log" style="margin-top: 2rem;">
          <div class="log-entry">構築指示をお待ちしています。</div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  private log(message: string) {
    const logEl = this.container.querySelector('#builder-log');
    if (logEl) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.textContent = message;
      logEl.appendChild(entry);
      logEl.scrollTop = logEl.scrollHeight;
    }
  }

  private setPartOpacity(partId: string, opacity: string, animate: boolean = false) {
    const parts = this.container.querySelectorAll(`#${partId}`);
    parts.forEach(p => {
      const el = p as HTMLElement;
      el.style.opacity = opacity;
      if (animate && opacity === '1') {
        el.style.boxShadow = '0 0 15px currentColor';
        setTimeout(() => el.style.boxShadow = 'none', 500);
      }
    });
  }

  private resetUI() {
    this.setPartOpacity('part-cpu', '0.2');
    this.setPartOpacity('part-ram', '0.2');
    this.setPartOpacity('part-gpu', '0.2');
    this.setPartOpacity('part-storage', '0.2');
    
    const chassis = this.container.querySelector('#pc-chassis') as HTMLElement;
    if (chassis) chassis.style.boxShadow = 'none';
    
    const specs = this.container.querySelector('#pc-specs') as HTMLElement;
    if (specs) specs.style.opacity = '0';
  }

  private updateProgress(text: string, percent: number) {
    const pContainer = this.container.querySelector('#build-progress') as HTMLElement;
    const pText = this.container.querySelector('#progress-text') as HTMLElement;
    const pPercent = this.container.querySelector('#progress-percent') as HTMLElement;
    const pBar = this.container.querySelector('#progress-bar') as HTMLElement;
    
    if (pContainer) pContainer.style.display = 'flex';
    if (pText) pText.textContent = text;
    if (pPercent) pPercent.textContent = `${percent}%`;
    if (pBar) pBar.style.width = `${percent}%`;
  }

  private bindEvents() {
    const btnGaming = this.container.querySelector('#btn-build-gaming') as HTMLButtonElement;
    const btnOffice = this.container.querySelector('#btn-build-office') as HTMLButtonElement;

    const build = async (type: 'gaming' | 'office') => {
      btnGaming.disabled = true;
      btnOffice.disabled = true;
      this.resetUI();
      
      const builder = type === 'gaming' ? new GamingComputerBuilder() : new OfficeComputerBuilder();
      this.director.setBuilder(builder);
      
      this.log(`ディレクター: ${type === 'gaming' ? 'ゲーミングPC' : 'オフィスPC'} の構築を開始します。`);
      
      const chassis = this.container.querySelector('#pc-chassis') as HTMLElement;
      if (chassis && type === 'gaming') {
        chassis.style.boxShadow = 'inset 0 0 20px rgba(139, 92, 246, 0.2), 0 0 30px rgba(139, 92, 246, 0.4)';
      }

      try {
        const finalPc = await this.director.constructComputer((step, currentPc) => {
          let percent = 0;
          let text = '';
          
          if (step === 'cpu') {
            percent = 25; text = 'CPUを組み込み中...';
            this.setPartOpacity('part-cpu', '1', true);
          } else if (step === 'ram') {
            percent = 50; text = 'RAMを組み込み中...';
            this.setPartOpacity('part-ram', '1', true);
          } else if (step === 'storage') {
            percent = 75; text = 'ストレージを組み込み中...';
            this.setPartOpacity('part-storage', '1', true);
          } else if (step === 'gpu') {
            percent = 100; text = 'GPUを組み込み中...';
            if (currentPc.gpu) {
              this.setPartOpacity('part-gpu', '1', true);
            }
          }
          
          this.log(`ビルダー: ${text}`);
          this.updateProgress(text, percent);
        });

        this.log('構築完了！完成した製品を取得します。');
        this.updateProgress('完成！', 100);
        
        const specs = this.container.querySelector('#pc-specs') as HTMLElement;
        if (specs) {
          specs.innerHTML = finalPc.display();
          specs.style.opacity = '1';
        }

      } catch (e) {
        console.error(e);
      } finally {
        btnGaming.disabled = false;
        btnOffice.disabled = false;
      }
    };

    btnGaming?.addEventListener('click', () => build('gaming'));
    btnOffice?.addEventListener('click', () => build('office'));
  }
}
