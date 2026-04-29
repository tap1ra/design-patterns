function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlight(raw: string): string {
  // Use a unique marker unlikely to appear in source code
  const MARKER = '___HL_SLOT_';
  const MARKER_END = '___';
  const slots: string[] = [];

  function protect(inner: string, cls: string): string {
    const id = slots.length;
    slots.push(`<span class="hl-${cls}">${escapeHtml(inner)}</span>`);
    return `${MARKER}${id}${MARKER_END}`;
  }

  let s = raw;

  // Comments first
  s = s.replace(/\/\/[^\n]*/g, m => protect(m, 'comment'));
  s = s.replace(/\/\*[\s\S]*?\*\//g, m => protect(m, 'comment'));

  // Template literals
  s = s.replace(/`[^`]*`/g, m => protect(m, 'string'));

  // Regular strings
  s = s.replace(/'[^'\n\\]*(?:\\.[^'\n\\]*)*'/g, m => protect(m, 'string'));
  s = s.replace(/"[^"\n\\]*(?:\\.[^"\n\\]*)*"/g, m => protect(m, 'string'));

  // Keywords
  const KW = ['export','import','class','interface','implements','extends','constructor',
    'return','void','string','number','boolean','private','public','protected','abstract',
    'const','let','var','if','else','for','while','new','this','null','undefined','true',
    'false','type','from','async','await','static','readonly','typeof','instanceof','any',
    'function','declare'];
  s = s.replace(new RegExp(`\\b(${KW.join('|')})\\b`, 'g'), m => protect(m, 'keyword'));

  // PascalCase class/type names
  s = s.replace(/\b([A-Z][A-Za-z0-9]*)\b/g, m => protect(m, 'type'));

  // Numbers
  s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, m => protect(m, 'number'));

  // Now reconstruct: escape non-placeholder text, restore spans
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
    `<span class="code-line"><span class="line-num">${i + 1}</span>${line}</span>`
  ).join('\n');
}

function renderCode(source: string): string {
  const h = addLineNumbers(highlight(source));
  return `
    <div class="code-viewer">
      <div class="code-viewer-header">
        <span class="code-lang-badge">TypeScript</span>
        <span style="font-size:0.75rem;color:var(--text-secondary);">${source.split('\n').length} lines</span>
      </div>
      <pre class="code-content"><code>${h}</code></pre>
    </div>`;
}

export function applyCodeTab(container: HTMLElement, sourceCode: string): void {
  const pc = container.querySelector('.pattern-container') as HTMLElement;
  if (!pc) return;
  const header = pc.querySelector('.pattern-header') as HTMLElement;
  if (!header) return;

  // Collect all children after header
  const children = Array.from(pc.children).filter(c => c !== header);

  // Wrap demo content
  const demoPanel = document.createElement('div');
  demoPanel.className = 'tab-panel';
  demoPanel.dataset.tabId = 'demo';
  children.forEach(el => demoPanel.appendChild(el));

  // Create code panel
  const codePanel = document.createElement('div');
  codePanel.className = 'tab-panel';
  codePanel.dataset.tabId = 'code';
  codePanel.style.display = 'none';
  codePanel.innerHTML = renderCode(sourceCode);

  // Tab bar
  const tabBar = document.createElement('div');
  tabBar.className = 'view-tab-bar';
  tabBar.innerHTML = `
    <button class="view-tab active" data-tab="demo">🎯 デモ</button>
    <button class="view-tab" data-tab="code">📄 コード</button>
  `;

  // Append
  header.appendChild(tabBar);
  pc.appendChild(demoPanel);
  pc.appendChild(codePanel);

  // Tab switching
  tabBar.querySelectorAll('.view-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = (tab as HTMLElement).dataset.tab;
      tabBar.querySelectorAll('.view-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      pc.querySelectorAll<HTMLElement>('.tab-panel').forEach(p => {
        p.style.display = p.dataset.tabId === target ? '' : 'none';
      });
    });
  });
}
