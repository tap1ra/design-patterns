function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlight(raw: string): string {
  const MARKER = '___HL_SLOT_';
  const MARKER_END = '___';
  const slots: string[] = [];

  function protect(inner: string, cls: string): string {
    const id = slots.length;
    slots.push(`<span class="hl-${cls}">${escapeHtml(inner)}</span>`);
    return `${MARKER}${id}${MARKER_END}`;
  }

  let s = raw;
  s = s.replace(/\/\/[^\n]*/g, m => protect(m, 'comment'));
  s = s.replace(/\/\*[\s\S]*?\*\//g, m => protect(m, 'comment'));
  s = s.replace(/`[^`]*`/g, m => protect(m, 'string'));
  s = s.replace(/'[^'\n\\]*(?:\\.[^'\n\\]*)*'/g, m => protect(m, 'string'));
  s = s.replace(/"[^"\n\\]*(?:\\.[^"\n\\]*)*"/g, m => protect(m, 'string'));

  const KW = ['export','import','class','interface','implements','extends','constructor',
    'return','void','string','number','boolean','private','public','protected','abstract',
    'const','let','var','if','else','for','while','new','this','null','undefined','true',
    'false','type','from','async','await','static','readonly','typeof','instanceof','any',
    'function','declare'];
  s = s.replace(new RegExp(`\\b(${KW.join('|')})\\b`, 'g'), m => protect(m, 'keyword'));
  s = s.replace(/\b([A-Z][A-Za-z0-9]*)\b/g, m => protect(m, 'type'));
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, m => protect(m, 'number'));

  const markerRe = new RegExp(`${MARKER}(\\d+)${MARKER_END}`, 'g');
  let result = '';
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  markerRe.lastIndex = 0;
  while ((m = markerRe.exec(s)) !== null) {
    result += escapeHtml(s.slice(lastIndex, m.index));
    result += slots[parseInt(m[1])];
    lastIndex = m.index + m[0].length;
  }
  result += escapeHtml(s.slice(lastIndex));
  return result;
}

function addLineNumbers(highlighted: string): string {
  const lines = highlighted.split('\n');
  return lines.map((line, i) =>
    `<span class="code-line" data-line="${i + 1}"><span class="line-num">${i + 1}</span>${line}</span>`
  ).join('\n');
}

function renderCode(source: string): string {
  const h = addLineNumbers(highlight(source));
  return `
    <div class="code-viewer">
      <div class="code-viewer-header">
        <span class="code-lang-badge">TypeScript</span>
        <span class="code-hint">💡 デモ操作時に対応箇所がハイライトされます</span>
      </div>
      <pre class="code-content"><code>${h}</code></pre>
    </div>`;
}

/** デモ操作に対応するコード内の関数をハイライトし、並列表示へ自動切替 */
export function highlightFunction(container: HTMLElement, funcName: string): void {
  const codeViewer = container.querySelector('.code-viewer');
  if (!codeViewer) return;

  // Clear previous highlights
  codeViewer.querySelectorAll('.code-line.hl-active').forEach(el =>
    el.classList.remove('hl-active'));

  const allLines = Array.from(codeViewer.querySelectorAll<HTMLElement>('.code-line'));

  // Find start: line containing funcName( or class funcName
  const startIdx = allLines.findIndex(line => {
    const text = line.textContent || '';
    return (text.includes(`${funcName}(`) || text.includes(`${funcName} (`) || text.includes(`class ${funcName}`));
  });
  if (startIdx === -1) return;

  // Find end via brace counting
  let depth = 0;
  let started = false;
  let endIdx = startIdx;
  for (let i = startIdx; i < allLines.length; i++) {
    const text = allLines[i].textContent || '';
    for (const ch of text) {
      if (ch === '{') { depth++; started = true; }
      if (ch === '}') depth--;
    }
    endIdx = i;
    if (started && depth <= 0) break;
  }

  // Apply highlight with animation replay
  for (let i = startIdx; i <= endIdx; i++) {
    const el = allLines[i];
    el.classList.remove('hl-active');
    // Force reflow so animation restarts
    void (el as HTMLElement).offsetWidth;
    el.classList.add('hl-active');
  }

  // Auto-enable split view if not already in split/code mode
  const splitWrapper = container.querySelector('.split-wrapper');
  if (splitWrapper) {
    const isAlreadySplit = splitWrapper.classList.contains('is-split');
    const codePanel = splitWrapper.querySelector<HTMLElement>('.tab-panel[data-tab-id="code"]');
    const isCodeVisible = codePanel && codePanel.style.display !== 'none';

    if (!isAlreadySplit && !isCodeVisible) {
      splitWrapper.classList.add('is-split');
      splitWrapper.querySelectorAll<HTMLElement>('.tab-panel').forEach(p => {
        p.style.display = '';
      });
      container.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
      container.querySelector<HTMLElement>('.view-tab[data-tab="split"]')?.classList.add('active');
    }
  }

  // Scroll the highlighted line into view within the code panel
  const codeContent = codeViewer.querySelector('.code-content');
  if (codeContent && allLines[startIdx]) {
    const lineEl = allLines[startIdx];
    const panelTop = codeContent.getBoundingClientRect().top;
    const lineTop = lineEl.getBoundingClientRect().top;
    const offset = lineTop - panelTop - codeContent.clientHeight / 3;
    codeContent.scrollBy({ top: offset, behavior: 'smooth' });
  }
}

/** ハイライトをクリア */
export function clearHighlight(container: HTMLElement): void {
  container.querySelectorAll('.code-line.hl-active').forEach(el =>
    el.classList.remove('hl-active'));
}

export function applyCodeTab(container: HTMLElement, sourceCode: string): void {
  const pc = container.querySelector('.pattern-container') as HTMLElement;
  if (!pc) return;
  const header = pc.querySelector('.pattern-header') as HTMLElement;
  if (!header) return;

  const children = Array.from(pc.children).filter(c => c !== header);

  // Demo panel
  const demoPanel = document.createElement('div');
  demoPanel.className = 'tab-panel';
  demoPanel.dataset.tabId = 'demo';
  children.forEach(el => demoPanel.appendChild(el));

  // Code panel
  const codePanel = document.createElement('div');
  codePanel.className = 'tab-panel';
  codePanel.dataset.tabId = 'code';
  codePanel.style.display = 'none';
  codePanel.innerHTML = renderCode(sourceCode);

  // Split wrapper holds both panels
  const splitWrapper = document.createElement('div');
  splitWrapper.className = 'split-wrapper';
  splitWrapper.appendChild(demoPanel);
  splitWrapper.appendChild(codePanel);

  // Tab bar — 3 modes
  const tabBar = document.createElement('div');
  tabBar.className = 'view-tab-bar';
  tabBar.innerHTML = `
    <button class="view-tab active" data-tab="demo">🎯 デモ</button>
    <button class="view-tab" data-tab="code">📄 コード</button>
    <button class="view-tab" data-tab="split">⬛ 並列表示</button>
  `;

  header.appendChild(tabBar);
  pc.appendChild(splitWrapper);

  // Tab switching
  tabBar.querySelectorAll('.view-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = (tab as HTMLElement).dataset.tab;
      tabBar.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (target === 'split') {
        splitWrapper.classList.add('is-split');
        splitWrapper.querySelectorAll<HTMLElement>('.tab-panel').forEach(p => {
          p.style.display = '';
        });
      } else {
        splitWrapper.classList.remove('is-split');
        splitWrapper.querySelectorAll<HTMLElement>('.tab-panel').forEach(p => {
          p.style.display = p.dataset.tabId === target ? '' : 'none';
        });
      }
    });
  });
}
