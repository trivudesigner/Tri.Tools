(() => {
  'use strict';

  /* ================= Storage & Tab Model ================= */
  const LS_KEY = 'mdv_tabs_v1';
  const LS_THEME = 'mdv_theme';
  let tabs = [];
  let activeId = null;

  function uid() { return 't' + Math.random().toString(36).slice(2, 10); }

  function newTab(name, content) {
    return { id: uid(), name: name || 'Untitled', content: content || '', dirty: false };
  }

  function loadTabs() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.tabs && data.tabs.length) {
          tabs = data.tabs;
          activeId = data.activeId || tabs[0].id;
          // ensure 'Tri.Markdown' cheat-sheet tab exists
          if (!tabs.some(t => t.name === 'Tri.Markdown')) {
            tabs.unshift(newTab('Tri.Markdown', SAMPLE_MD));
            activeId = tabs[0].id;
          }
          return;
        }
      }
    } catch (e) { /* ignore */ }
    const t = newTab('Tri.Markdown', SAMPLE_MD);
    tabs = [t];
    activeId = t.id;
  }

  function saveTabs() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ tabs, activeId }));
    } catch (e) { /* storage full or unavailable */ }
  }

  function getActiveTab() { return tabs.find(t => t.id === activeId); }

  const SAMPLE_MD = `# Markdown Syntax Cheat Sheet

This document explains every syntax feature supported in this editor — standard Markdown, GitHub Flavored Markdown (GFM), and GitHub's advanced formatting. Each section explains what the syntax does, then shows it rendered next to the raw code. Open **Edit** to compare the raw text with this preview, and use the **TOC** to jump between sections.

# Headings

Start a line with 1–6 \`#\` characters to create a heading; the number of \`#\` sets the level (H1–H6). Headings automatically appear in the table of contents.

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

\`\`\`
# Heading 1
## Heading 2
### Heading 3
\`\`\`

# Paragraphs & line breaks

Leave a **blank line** between lines of text to start a new paragraph. To force a single line break without a new paragraph, end a line with two or more spaces, or use \`<br>\`.

This is one paragraph.

This is a separate paragraph, because a blank line came before it.

\`\`\`
This is one paragraph.

This is a separate paragraph.
\`\`\`

# Text formatting

Wrap text in special characters to change its emphasis:

**Bold** — wrap in double asterisks or underscores: \`**Bold**\` or \`__Bold__\`

*Italic* — wrap in single asterisks or underscores: \`*Italic*\` or \`_Italic_\`

***Bold and italic*** — combine both: \`***Bold and italic***\`

~~Strikethrough~~ — wrap in double tildes (GFM): \`~~Strikethrough~~\`

==Highlight== — wrap in double equals signs to mark text, like a highlighter: \`==Highlight==\`

Super^script^ — wrap in single carets: \`Super^script^\`

Sub~script~ — wrap in single tildes: \`Sub~script~\`

\`inline code\` — wrap in backticks

# Escaping characters

Put a backslash before a Markdown character to display it literally instead of it being interpreted as formatting.

Escaped: \*not italic\*  ·  Unescaped: *becomes italic*

\`\`\`
Escaped: \*not italic\*
Unescaped: *becomes italic*
\`\`\`

---

# Lists

**Unordered lists** start each item with \`-\`, \`*\`, or \`+\`. Indent an item by 2 spaces to nest it inside the item above.

- Item one
- Item two
  - Nested item
    - Deeper nested item

\`\`\`
- Item one
- Item two
  - Nested item
\`\`\`

**Ordered lists** start each item with a number and a period; Markdown renumbers automatically, so the actual digits you type don't matter.

1. First step
2. Second step
   1. Sub-step

\`\`\`
1. First step
2. Second step
   1. Sub-step
\`\`\`

**Task lists** (GFM) use \`- [ ]\` for an open task and \`- [x]\` for a completed one — click the checkboxes right in the preview.

- [x] Write the cheat sheet
- [x] Support GFM extras
- [ ] Ship it 🚀

\`\`\`
- [x] Done task
- [ ] Open task
\`\`\`

# Links & images

**Inline links** use \`[label](url)\`. Add a \`"title"\` after the URL for a tooltip.

[Inline link](https://github.com "GitHub")

\`\`\`
[Inline link](https://github.com "GitHub")
\`\`\`

**Autolinks** — wrap a bare URL in angle brackets, or GFM will often auto-detect it even without them.

<https://github.com>

\`\`\`
<https://github.com>
\`\`\`

**Images** use the same syntax as links with a leading \`!\`.

![Alt text](https://upload.wikimedia.org/wikipedia/commons/a/a9/Example.jpg "Optional title")

\`\`\`
![Alt text](image-url.jpg "Optional title")
\`\`\`

# Code

**Inline code** wraps text in single backticks: \`const x = 1\`

**Fenced code blocks** wrap multiple lines in triple backticks. Add a language name after the opening fence to enable syntax highlighting.

\`\`\`js
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

Written as: a line of three backticks plus \`js\`, then the code, then a closing line of three backticks.

# Blockquotes

Start a line with \`>\` to quote text. Use \`>\` on consecutive lines to quote multiple lines, or blank \`>\` lines to separate quoted paragraphs.

> A regular blockquote.
> It can span multiple lines.

\`\`\`
> A regular blockquote.
> It can span multiple lines.
\`\`\`

# Alerts

GitHub's five alert types are blockquotes whose first line is \`[!TYPE]\`. Each renders with its own color and icon to draw attention.

> [!NOTE]
> Useful information the user should know, even when skimming.

> [!TIP]
> Helpful advice for doing things better.

> [!IMPORTANT]
> Key information the user needs to know to achieve their goal.

> [!WARNING]
> Urgent info that needs immediate attention to avoid problems.

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

\`\`\`
> [!NOTE]
> Useful information the user should know.
\`\`\`

# Tables

Separate columns with \`|\` and add a divider row of dashes below the header. Put \`:\` on either side of the dashes to control alignment: left (default), \`:---:\` center, or \`---:\` right.

| Left | Center | Right |
|:-----|:------:|------:|
| a    | b      | c     |
| 123  | 456    | 789   |

\`\`\`
| Left | Center | Right |
|:-----|:------:|------:|
| a    | b      | c     |
\`\`\`

# Collapsed sections

Wrap content in \`<details><summary>...</summary> ... </details>\` (plain HTML) to make a click-to-expand section — handy for long logs or optional detail.

<details>
<summary>Click to expand</summary>

Hidden content goes here — great for long logs, spoilers, or optional details.

\`\`\`bash
npm install
\`\`\`
</details>

Written as: \`<details>\`, then \`<summary>title</summary>\`, then the hidden content, then \`</details>\`.

# Diagrams (Mermaid)

Fence a code block with the language \`mermaid\` to render flowcharts, sequence diagrams, and more.

\`\`\`mermaid
graph TD
A[Write Markdown] --> B{Looks good?}
B -- Yes --> C[Export]
B -- No --> A
\`\`\`

Written as: a fence tagged \`mermaid\`, then diagram syntax such as \`A[Start] --> B[End]\`.

# Mathematical expressions

Wrap LaTeX in single \`$\` for inline math, or double \`$$\` for a centered display equation.

Inline: $E = mc^2$

Display:
$$\sum_{i=1}^{n} x_i = x_1 + x_2 + \cdots + x_n$$

\`\`\`
Inline: $E = mc^2$
Display: $$\sum_{i=1}^{n} x_i$$
\`\`\`

# Horizontal rule

Three or more hyphens, asterisks, or underscores alone on a line draw a horizontal divider:

---

\`\`\`
---
\`\`\`

# Footnotes

Reference a footnote inline with \`[^id]\`, then define its text anywhere in the document with \`[^id]: text\`. Definitions are collected and numbered automatically at the bottom of the page, with a back-link to return to the reference.

Here's a claim that needs a source[^1].

\`\`\`
Here's a claim that needs a source[^1].

[^1]: The footnote text.
\`\`\`

[^1]: A footnote definition, shown at the bottom of the document, with a back-link to return to the reference.

---

# Regex syntax reference

A bonus quick-reference for regular expressions, useful with this editor's Find & Replace (enable the \`.*\` option).

| Pattern | Meaning |
|---------|---------|
| \`.\` | Any char |
| \`*\` | Zero or more |
| \`+\` | One or more |
| \`?\` | Optional |
| \`^\` | Start of string |
| \`$\` | End of string |
| \`\\d\` | Digit |
| \`\\w\` | Word char |
| \`\\s\` | Whitespace |
| \`[abc]\` | Character class |
| \`(a\|b)\` | Alternation |
| \`{n,m}\` | Range quantifier |
`;

  /* ================= Markdown Rendering ================= */
  marked.setOptions({
    gfm: true,
    breaks: true,
    highlight: null
  });

  const renderer = new marked.Renderer();
  renderer.code = (code, lang) => {
    if (lang === 'mermaid') {
      return `<div class="mermaid">${escapeHtml(code)}</div>`;
    }
    let highlighted;
    let langClass = '';
    try {
      if (lang && hljs.getLanguage(lang)) {
        highlighted = hljs.highlight(code, { language: lang }).value;
        langClass = ' language-' + lang;
      } else {
        highlighted = hljs.highlightAuto(code).value;
      }
    } catch (e) { highlighted = escapeHtml(code); }
    return `<pre><button class="fmt-btn mdv-code-copy" data-copy title="Copy"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg></button><code class="hljs${langClass}">${highlighted}</code></pre>`;
  };
  renderer.checkbox = () => ''; // suppress marked's own <input type="checkbox">; we render a custom SVG below
  renderer.listitem = (text, task, checked) => {
    if (task) {
      // strip marked's rendered checkbox input (and any literal "[ ]"/"[x]") so only our SVG remains
      const clean = text.replace(/<input[^>]*>\s*/i, '').replace(/^\[[ xX]\]\s*/, '').trim();
      const check = checked
        ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="2" y="2" width="20" height="20" rx="4" fill="var(--tri-accent, #2563EB)"/><path d="M7 13l3 3 7-7" stroke="var(--tri-text-inverse, #fff)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
        : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="var(--tri-text-tertiary, #94A3B8)" stroke-width="1.5" fill="none"/></svg>';
      return `<li class="task-list-item">${check}<span>${clean}</span></li>`;
    }
    return `<li>${text}</li>`;
  };
  renderer.blockquote = (quote) => {
    const m = quote.match(/^\s*<p>\[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]\s*/i);
    if (m) {
      const kind = m[1].toUpperCase();
      const map = {
		  NOTE: { cls: 'callout-note', label: 'Note', icon: iconInfo() },
		  TIP: { cls: 'callout-tip', label: 'Tip', icon: iconTip() },
		  WARNING: { cls: 'callout-warning', label: 'Warning', icon: iconWarn() },
		  IMPORTANT: { cls: 'callout-important', label: 'Important', icon: iconImportant() },
		  CAUTION: { cls: 'callout-caution', label: 'Caution', icon: iconCaution() }
	  };
      const conf = map[kind];
      const rest = quote.replace(m[0], '<p>');
      return `<div class="${conf.cls}"><div class="callout-head"><span class="callout-icon">${conf.icon}</span><strong class="callout-label">${conf.label}</strong></div><div class="callout-body">${rest}</div></div>`;
    }
    return `<blockquote>${quote}</blockquote>`;
  };

  const COLOR_RE = new RegExp(
    '^(' +
      '#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})' +          // hex: #fff, #ffff, #ffffff, #ffffffff
      '|rgba?\\(\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*,\\s*\\d{1,3}\\s*(,\\s*[\\d.]+\\s*)?\\)' + // rgb/rgba
      '|hsla?\\(\\s*\\d{1,3}\\s*,\\s*\\d{1,3}%\\s*,\\s*\\d{1,3}%\\s*(,\\s*[\\d.]+\\s*)?\\)' + // hsl/hsla
    ')$', 'i'
  );

  renderer.codespan = (code) => {
    const raw = typeof code === 'string' ? code : String(code);
    const escaped = escapeHtml(raw);
    const trimmed = raw.trim();
    if (COLOR_RE.test(trimmed)) {
      return `<code>${escaped}<span class="mdv-color-dot" style="background:${trimmed}"></span></code>`;
    }
    return `<code>${escaped}</code>`;
  };

  marked.use({ renderer });

  /* ---- Extra GFM syntax: ==highlight==, ^superscript^, ~subscript~, [^footnotes] ---- */
  let footnoteOrder = [];
  let footnoteDefs = {};

  marked.use({
    extensions: [
      {
        name: 'mark', level: 'inline',
        start(src) { const m = src.match(/==/); return m ? m.index : undefined; },
        tokenizer(src) {
          const m = /^==(?!=)([^=\n]+?)==(?!=)/.exec(src);
          if (m) return { type: 'mark', raw: m[0], tokens: this.lexer.inlineTokens(m[1]) };
        },
        renderer(token) { return `<mark>${this.parser.parseInline(token.tokens)}</mark>`; }
      },
      {
        name: 'sup', level: 'inline',
        start(src) { const m = src.match(/\^/); return m ? m.index : undefined; },
        tokenizer(src) {
          const m = /^\^([^\^\s]+)\^/.exec(src);
          if (m) return { type: 'sup', raw: m[0], tokens: this.lexer.inlineTokens(m[1]) };
        },
        renderer(token) { return `<sup>${this.parser.parseInline(token.tokens)}</sup>`; }
      },
      {
        name: 'sub', level: 'inline',
        start(src) { const m = src.match(/~(?!~)/); return m ? m.index : undefined; },
        tokenizer(src) {
          const m = /^~(?!~)([^~\s]+)~(?!~)/.exec(src);
          if (m) return { type: 'sub', raw: m[0], tokens: this.lexer.inlineTokens(m[1]) };
        },
        renderer(token) { return `<sub>${this.parser.parseInline(token.tokens)}</sub>`; }
      },
      {
        name: 'footnoteRef', level: 'inline',
        start(src) { const m = src.match(/\[\^/); return m ? m.index : undefined; },
        tokenizer(src) {
          const m = /^\[\^([^\]\n]+)\](?!:)/.exec(src);
          if (m) return { type: 'footnoteRef', raw: m[0], id: m[1] };
        },
        renderer(token) {
          let idx = footnoteOrder.indexOf(token.id);
          if (idx === -1) { footnoteOrder.push(token.id); idx = footnoteOrder.length - 1; }
          const n = idx + 1;
          return `<sup class="footnote-ref" id="fnref-${n}"><a href="#fn-${n}">[${n}]</a></sup>`;
        }
      },
      {
        name: 'footnoteDef', level: 'block',
        start(src) { const m = src.match(/^\[\^[^\]\n]+\]:/m); return m ? m.index : undefined; },
        tokenizer(src) {
          const m = /^\[\^([^\]\n]+)\]:[ \t]*([^\n]*(?:\n(?:[ \t]{2,}[^\n]*|\n))*)/.exec(src);
          if (m) {
            const body = m[2].replace(/^\n+|\n+$/g, '').split('\n').map(l => l.replace(/^\s{2,}/, '')).join('\n');
            return { type: 'footnoteDef', raw: m[0], id: m[1], tokens: this.lexer.blockTokens(body || ' ') };
          }
        },
        renderer(token) { footnoteDefs[token.id] = token; return ''; }
      }
    ]
  });

  function renderFootnotes() {
    if (!footnoteOrder.length) return '';
    const items = footnoteOrder.map((id, i) => {
      const n = i + 1;
      const def = footnoteDefs[id];
      const body = def ? marked.Parser.parse(def.tokens) : '';
      return `<li id="fn-${n}">${body} <a href="#fnref-${n}" class="footnote-backref">↩</a></li>`;
    }).join('');
    return `<section class="footnotes"><hr><ol>${items}</ol></section>`;
  }

  function iconInfo() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.5" r="0.75" fill="currentColor" stroke="none"/></svg>'; }
	function iconTip() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18h6M10 22h4M12 2a6 6 0 0 0-4 10.5c.6.6 1 1.5 1 2.5h6c0-1 .4-1.9 1-2.5A6 6 0 0 0 12 2z"/></svg>'; }
	function iconWarn() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9.5" x2="12" y2="13.5"/><circle cx="12" cy="16.5" r="0.75" fill="currentColor" stroke="none"/></svg>'; }
	function iconImportant() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/></svg>'; }
	function iconCaution() { return '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 4.5 1.5 6.5 2.2 7.3.3.3.1.7-.3.7H4.1c-.4 0-.6-.4-.3-.7C4.5 14.5 6 12.5 6 8z"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><line x1="12" y1="6.5" x2="12" y2="10"/><circle cx="12" cy="12.5" r="0.75" fill="currentColor" stroke="none"/></svg>'; }
  function escapeHtml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function extractFrontmatter(raw) {
    const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
    if (!m) return { body: raw, meta: null };
    let meta = null;
    try { meta = jsyaml.load(m[1]); } catch (e) { meta = null; }
    return { body: raw.slice(m[0].length), meta };
  }

  function frontmatterTable(meta) {
    if (!meta || typeof meta !== 'object') return '';
    const rows = Object.entries(meta).map(([k, v]) =>
      `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(String(v))}</td></tr>`).join('');
    return `<table class="frontmatter-table"><tbody>${rows}</tbody></table>`;
  }

  let mermaidReady = false;
  function initMermaid() {
    if (window.mermaid && !mermaidReady) {
      mermaid.initialize({ startOnLoad: false, theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default' });
      mermaidReady = true;
    }
  }

  function getBlocksWithLines(body, lineOffset) {
	  let tokens;
	  try { tokens = marked.lexer(body); } catch (e) { return []; }
	  let pos = 0;
	  const rawItems = [];
	  for (const t of tokens) {
		const raw = typeof t.raw === 'string' ? t.raw : '';
		const start = pos, end = pos + raw.length;
		if (t.type !== 'space' && raw.trim().length) {
		  const startLine = lineOffset + body.slice(0, start).split('\n').length;
		  const endLine = lineOffset + body.slice(0, Math.max(start, end - 1)).split('\n').length;
		  rawItems.push({ token: t, startLine, endLine, links: tokens.links, raw });
		}
		pos = end;
	  }

	  const VOID_TAGS = new Set(['br','hr','img','input','meta','link','area','base','col','embed','source','track','wbr']);
	  function tagDelta(raw) {
		let delta = 0;
		const openRe = /<([a-zA-Z][a-zA-Z0-9-]*)(?:\s[^>]*)?\/?>/g;
		const closeRe = /<\/([a-zA-Z][a-zA-Z0-9-]*)\s*>/g;
		let m;
		while ((m = openRe.exec(raw))) {
		  if (m[0].endsWith('/>')) continue;
		  if (!VOID_TAGS.has(m[1].toLowerCase())) delta++;
		}
		while ((m = closeRe.exec(raw))) delta--;
		return delta;
	  }

	  const blocks = [];
	  let depth = 0, group = null;
	  for (const it of rawItems) {
		const delta = tagDelta(it.raw);
		if (depth > 0) {
		  group.tokens.push(it.token);
		  group.endLine = it.endLine;
		  depth += delta;
		  if (depth <= 0) { blocks.push(group); group = null; depth = 0; }
		} else if (delta > 0) {
		  group = { tokens: [it.token], startLine: it.startLine, endLine: it.endLine, links: it.links };
		  depth = delta;
		} else {
		  blocks.push({ tokens: [it.token], startLine: it.startLine, endLine: it.endLine, links: it.links });
		}
	  }
	  if (group) blocks.push(group);

	  return blocks;
	}

  function clearBlockHighlight() {
    const layer = document.getElementById('editorBlockLayer');
    if (layer) layer.innerHTML = escapeHtml(editor.value);
    preview.querySelectorAll('.mdv-block.mdv-block-active').forEach(el => el.classList.remove('mdv-block-active'));
  }

  function updateActiveBlockHighlight() {
    const layer = document.getElementById('editorBlockLayer');
    if (!layer) return;
    if (currentViewMode !== 'edit' || !mdvBlocks.length) { clearBlockHighlight(); return; }

    const text = editor.value;
    const line = text.slice(0, editor.selectionStart).split('\n').length;
    const block = mdvBlocks.find(b => line >= b.startLine && line <= b.endLine);
    if (!block) { clearBlockHighlight(); return; }

    const lines = text.split('\n');
    const before = lines.slice(0, block.startLine - 1).join('\n');
    const blockText = lines.slice(block.startLine - 1, block.endLine).join('\n');
    const afterLines = lines.slice(block.endLine);
    const beforeStr = before ? before + '\n' : '';
    const afterStr = afterLines.length ? '\n' + afterLines.join('\n') : '';

    layer.innerHTML =
      escapeHtml(beforeStr) +
      '<div class="mdv-block-band">' + escapeHtml(blockText) + '</div>' +
      escapeHtml(afterStr);
    layer.scrollTop = editor.scrollTop;

    preview.querySelectorAll('.mdv-block.mdv-block-active').forEach(el => el.classList.remove('mdv-block-active'));
    const idx = mdvBlocks.indexOf(block);
    const target = preview.querySelector(`.mdv-block[data-block-i="${idx}"]`);
    if (target) target.classList.add('mdv-block-active');
  }
	
  function render() {
    const tab = getActiveTab();
    if (!tab) return;
    const { body, meta } = extractFrontmatter(tab.content);
    footnoteOrder = [];
    footnoteDefs = {};

    const prefixRaw = tab.content.slice(0, tab.content.length - body.length);
    const lineOffset = prefixRaw.split('\n').length - 1;
    mdvBlocks = getBlocksWithLines(body, lineOffset);
    const bodyHtml = mdvBlocks.map((b, i) => {
	  const multi = b.tokens;
	  multi.links = b.links;
	  let h = '';
	  try { h = marked.parser(multi); } catch (e) { h = ''; }
	  return `<div class="mdv-block" data-block-i="${i}"><div class="mdv-block-inner">${h}</div></div>`;
	}).join('');

    const fm = frontmatterTable(meta);
    const fn = renderFootnotes();
    let html =
      (fm ? `<div class="mdv-block"><div class="mdv-block-inner">${fm}</div></div>` : '') +
      bodyHtml +
      (fn ? `<div class="mdv-block"><div class="mdv-block-inner">${fn}</div></div>` : '');
    html = DOMPurify.sanitize(html, {
	  ADD_TAGS: ['input', 'div'],
	  ADD_ATTR: ['checked', 'disabled', 'type', 'data-block-i', 'class', 'style']
	});
    preview.innerHTML = html;
    buildToc();

    // Open external links in a new tab (leave in-page anchors like #heading / #fn-1 alone)
    preview.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
    });

    // Re-apply the preview search highlight if Find is open in view mode
    if (findBar.classList.contains('open') && findBar.classList.contains('mdv-find-only') && findInput.value) {
      previewMatchIdx = -1;
      highlightPreviewMatches(findInput.value);
      lastPreviewQuery = findInput.value;
      if (previewMatches.length) { previewMatches[0].classList.add('current'); previewMatchIdx = 0; findCount.textContent = `1/${previewMatches.length}`; }
      else { findCount.textContent = '0/0'; }
    }

    // Mermaid
    if (window.mermaid) {
      initMermaid();
      const blocks = preview.querySelectorAll('.mermaid');
      if (blocks.length) {
        try { mermaid.run({ nodes: blocks }); } catch (e) { /* ignore render errors */ }
      }
    }
    // MathJax
    if (window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetClear && MathJax.typesetClear([preview]);
      MathJax.typesetPromise([preview]).catch(() => {});
    }
    updateWordCount();
    updateGutter();
	updateActiveBlockHighlight();
  }

  /* ================= DOM refs ================= */
  const editor = document.getElementById('editor');
  const editorScroll = document.getElementById('editorScroll');
  const preview = document.getElementById('preview');
  const gutter = document.getElementById('gutter');
  const tabbar = document.getElementById('tabbar');
  const wordCount = document.getElementById('wordCount');
  const charCount = document.getElementById('charCount');
  const readTime = document.getElementById('readTime');
  const statusMsg = document.getElementById('statusMsg');
  const lineInfo = document.getElementById('lineInfo');

  /* ================= Tab bar rendering ================= */
  function renderTabbar() {
    tabbar.innerHTML = '';
    tabs.forEach(t => {
      const el = document.createElement('div');
      el.className = 'mdv-doc-tab' + (t.id === activeId ? ' active' : '');
      el.dataset.id = t.id;
      const isCheat = t.name === 'Tri.Markdown';
      el.innerHTML = isCheat
        ? `<span class="name bold"><span class="tri">Tri</span><span class="dot">.</span><span class="md">Markdown</span></span>`
        : `<span class="name">${escapeHtml(t.name)}</span>${isCheat ? '' : `<span class="close${t.dirty ? ' dirty' : ''}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></span>`}`;
      el.addEventListener('click', (e) => {
        if (e.target.closest('.close')) { closeTab(t.id); return; }
        switchTab(t.id);
      });
      el.addEventListener('dblclick', (e) => {
        if (e.target.closest('.close')) return;
        renameTab(t.id);
      });
      tabbar.appendChild(el);
    });
    const addBtn = document.createElement('div');
    addBtn.className = 'mdv-tab-add';
    addBtn.title = 'New tab (Ctrl+T)';
    addBtn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
    addBtn.addEventListener('click', addTab);
    tabbar.appendChild(addBtn);
  }

  function switchTab(id) {
    saveEditorIntoTab();
    activeId = id;
    const t = getActiveTab();
    editor.value = t.content;
    editor.readOnly = t.name === 'Tri.Markdown';
    renderTabbar();
    render();
    saveTabs();
  }

  function addTab() {
	  if (tabs.length >= 20) { alert('Maximum 20 tabs reached.'); return; }
	  saveEditorIntoTab();
	  const t = newTab('Untitled ' + (tabs.length + 1), '');
	  tabs.push(t);
	  activeId = t.id;
	  editor.value = '';
	  editor.readOnly = false;
	  setViewMode('edit');
	  renderTabbar();
	  render();
	  saveTabs();
	}

  function closeTab(id) {
	  const t = tabs.find(x => x.id === id);
	  if (!t || t.name === 'Tri.Markdown') return;
	  const idx = tabs.indexOf(t);
	  if (tabs.length === 1) {
		tabs[idx] = newTab('Untitled', '');
		activeId = tabs[idx].id;
	  } else {
		tabs.splice(idx, 1);
		if (activeId === id) activeId = tabs[Math.max(0, idx - 1)].id;
	  }
	  editor.value = getActiveTab().content;
	  editor.readOnly = getActiveTab().name === 'Tri.Markdown';   // thêm dòng này
	  renderTabbar();
	  render();
	  saveTabs();
	}

  function renameTab(id) {
    const t = tabs.find(x => x.id === id);
    if (!t || t.name === 'Tri.Markdown') return;
    const name = prompt('Rename document:', t.name);
    if (name && name.trim()) { t.name = name.trim(); renderTabbar(); saveTabs(); }
  }

  function saveEditorIntoTab() {
    const t = getActiveTab();
    if (t) t.content = editor.value;
  }

  /* ================= Editor events ================= */
  let debounceTimer = null;
  editor.addEventListener('input', () => {
    const t = getActiveTab();
    if (t) { t.content = editor.value; t.dirty = true; }
    updateGutter();
    updateLineInfo();
    renderTabbar();
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => { render(); saveTabs(); const tt = getActiveTab(); if (tt) tt.dirty = false; renderTabbar(); }, 220);
  });
  editor.addEventListener('scroll', () => {
	  const top = editor.scrollTop;
	  gutter.scrollTop = top;
	  const hl = document.getElementById('editorHighlightLayer');
	  if (hl) hl.scrollTop = top;
	  const bl = document.getElementById('editorBlockLayer');
	  if (bl) bl.scrollTop = top;
	  if (syncScrollOn) syncPreviewScroll();
	});
  editor.addEventListener('keyup', () => { updateActiveBlockHighlight(); });
  editor.addEventListener('click', () => { updateActiveBlockHighlight(); });

  function updateGutter() {
    const lines = editor.value.split('\n').length;
    let out = '';
    for (let i = 1; i <= lines; i++) out += i + '\n';
    gutter.textContent = out;
  }

  function updateLineInfo() {
	const lines = editor.value.split('\n').length;
	lineInfo.textContent = lines;
  }

  function updateWordCount() {
	  const text = editor.value.trim();
	  const words = text ? text.split(/\s+/).length : 0;
	  const chars = editor.value.length;
	  wordCount.textContent = words;
	  charCount.textContent = chars;
	  readTime.textContent = `~${Math.max(1, Math.round(words / 200))} min`;
	  statusMsg.textContent = '';
	  updateLineInfo();
	}
  /* ================= Toolbar formatting ================= */
  function wrapSelection(before, after, placeholder) {
    const scrollTop = editor.scrollTop;
    after = after === undefined ? before : after;
    const start = editor.selectionStart, end = editor.selectionEnd;
    const val = editor.value;
    const sel = val.slice(start, end) || placeholder || '';
    editor.value = val.slice(0, start) + before + sel + after + val.slice(end);
    if (document.activeElement !== editor) editor.focus({preventScroll: true});
    editor.selectionStart = start + before.length;
    editor.selectionEnd = start + before.length + sel.length;
    editor.dispatchEvent(new Event('input'));
    editor.scrollTop = scrollTop;
  }

  function insertAtLineStart(prefix) {
    const scrollTop = editor.scrollTop;
    const start = editor.selectionStart;
    const val = editor.value;
    const lineStart = val.lastIndexOf('\n', start - 1) + 1;
    editor.value = val.slice(0, lineStart) + prefix + val.slice(lineStart);
    if (document.activeElement !== editor) editor.focus({preventScroll: true});
    editor.selectionStart = editor.selectionEnd = start + prefix.length;
    editor.dispatchEvent(new Event('input'));
    editor.scrollTop = scrollTop;
  }

  function transformSelection(fn) {
    const scrollTop = editor.scrollTop;
    const start = editor.selectionStart, end = editor.selectionEnd;
    const val = editor.value;
    const sel = val.slice(start, end);
    if (!sel) return;
    const result = fn(sel);
    editor.value = val.slice(0, start) + result + val.slice(end);
    if (document.activeElement !== editor) editor.focus({preventScroll: true});
    editor.selectionStart = start;
    editor.selectionEnd = start + result.length;
    editor.dispatchEvent(new Event('input'));
    editor.scrollTop = scrollTop;
  }

  const EMOJIS = ['😊','😂','❤️','👍','🎉','🔥','😎','💯','✅','⭐','🙏','💪','🥰','😍','🤔','😢','😡','👀','💡','🎨','📝','🚀','✨','🔧'];
  const SYMBOLS = ['©','®','™','§','¶','†','‡','•','→','⇒','⇔','±','×','÷','≈','≠','≤','≥','∞','∑','∏','∫','√','∂','∆','∅','π','α','β','μ'];

  const insertPopup = document.getElementById('insertPopup');
  const insertPopupTitle = document.getElementById('insertPopupTitle');
  const insertPopupGrid = document.getElementById('insertPopupGrid');

  function openInsertPopup(type) {
    const items = type === 'emoji' ? EMOJIS : SYMBOLS;
    insertPopupTitle.textContent = type === 'emoji' ? 'Emoji' : 'Symbol';
    insertPopupGrid.innerHTML = items.map(c =>
      `<span class="mdv-insert-item" data-char="${escapeHtml(c)}">${c}</span>`
    ).join('');
    insertPopup.classList.add('open');
  }

  function closeInsertPopup() { insertPopup.classList.remove('open'); }

  insertPopupGrid.addEventListener('click', (e) => {
    const item = e.target.closest('.mdv-insert-item');
    if (!item) return;
    wrapSelection('', '', item.dataset.char);
    closeInsertPopup();
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.mdv-insert-popup') && !e.target.closest('[data-cmd="emoji"]') && !e.target.closest('[data-cmd="symbol"]')) {
      closeInsertPopup();
    }
  });

  function insertBlock(text) {
    const scrollTop = editor.scrollTop;
    const start = editor.selectionStart, end = editor.selectionEnd;
    const val = editor.value;
    const needsNlBefore = start > 0 && val[start - 1] !== '\n';
    const insertion = (needsNlBefore ? '\n' : '') + text + '\n';
    const pos = start + insertion.length;
    editor.value = val.slice(0, start) + insertion + val.slice(end);
    if (document.activeElement !== editor) editor.focus({preventScroll: true});
    editor.selectionStart = editor.selectionEnd = pos;
    editor.dispatchEvent(new Event('input'));
    editor.scrollTop = scrollTop;
  }

  const toolbarActions = {
    bold: () => wrapSelection('**', '**', 'bold text'),
    italic: () => wrapSelection('*', '*', 'italic text'),
    strike: () => wrapSelection('~~', '~~', 'strikethrough text'),
    ul: () => insertAtLineStart('- '),
    ol: () => insertAtLineStart('1. '),
    task: () => insertAtLineStart('- [ ] '),
    quote: () => insertAtLineStart('> '),
    link: () => wrapSelection('[', '](https://)', 'link'),
    image: () => insertBlock('![image description](https://)'),
    table: () => insertBlock('| Column 1 | Column 2 |\n|---|---|\n| Cell 1 | Cell 2 |'),
    code: () => wrapSelection('`', '`', 'code'),
    codeblock: () => insertBlock('```js\n\n```'),
    math: () => wrapSelection('$', '$', 'E = mc^2'),
    mermaid: () => insertBlock('```mermaid\ngraph TD\nA[Start] --> B[End]\n```'),
    hr: () => insertBlock('---'),
    callout: () => insertBlock('> [!NOTE]\n> Note content.'),
    sentenceCase: () => transformSelection(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()),
    upperCase: () => transformSelection(s => s.toUpperCase()),
    lowerCase: () => transformSelection(s => s.toLowerCase()),
    dateTime: () => {
      const now = new Date();
      wrapSelection('', '', now.toLocaleString());
    },
    emoji: () => openInsertPopup('emoji'),
    symbol: () => openInsertPopup('symbol')
  };

  document.getElementById('toolbar').addEventListener('click', (e) => {
    const btn = e.target.closest('.fmt-btn[data-cmd]');
    if (!btn) return;
    const fn = toolbarActions[btn.dataset.cmd];
    if (fn) fn();
  });

  function applyHeadingLevel(level) {
    const hashes = level > 0 ? '#'.repeat(level) + ' ' : '';
    const scrollTop = editor.scrollTop;
    const start = editor.selectionStart;
    const val = editor.value;
    const lineStart = val.lastIndexOf('\n', start - 1) + 1;
    const lineEndRaw = val.indexOf('\n', start);
    const lineEnd = lineEndRaw === -1 ? val.length : lineEndRaw;
    const line = val.slice(lineStart, lineEnd).replace(/^#{1,6}\s*/, '');
    editor.value = val.slice(0, lineStart) + hashes + line + val.slice(lineEnd);
    if (document.activeElement !== editor) editor.focus({ preventScroll: true });
    editor.dispatchEvent(new Event('input'));
    editor.scrollTop = scrollTop;
  }

  document.querySelectorAll('.fmt-heading-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyHeadingLevel(parseInt(btn.dataset.heading, 10));
    });
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 'b') { e.preventDefault(); toolbarActions.bold(); }
    else if (mod && e.key.toLowerCase() === 'i') { e.preventDefault(); toolbarActions.italic(); }
    else if (mod && e.key.toLowerCase() === 'f') { e.preventDefault(); openFindBar(); }
    else if (mod && e.key.toLowerCase() === 't') { e.preventDefault(); addTab(); }
    else if (mod && e.key.toLowerCase() === 'w') { e.preventDefault(); closeTab(activeId); }
    else if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); exportMarkdown(); }
    else if (mod && e.key.toLowerCase() === 'o') { e.preventDefault(); fileInput.click(); }
    else if (e.key === 'Escape') {if (findBar.classList.contains('open')) {closeFindBar();} else closeToc();}
  });

  /* ================= Sync scroll ================= */
  let syncScrollOn = true;
  document.getElementById('syncScrollBtn').addEventListener('click', (e) => {
    syncScrollOn = !syncScrollOn;
    e.currentTarget.classList.toggle('active', syncScrollOn);
  });
  document.getElementById('syncScrollBtn').classList.add('active');
  document.getElementById('toggleGutterBtn').addEventListener('click', (e) => {
	gutter.classList.toggle('mdv-gutter-hidden');
	e.currentTarget.classList.toggle('active', gutter.classList.contains('mdv-gutter-hidden'));
  });
  const previewScroll = document.getElementById('previewScroll');
  const SYNC_ANCHOR_RATIO = 0.1;

  function syncPreviewScroll() {
    if (!mdvBlocks || !mdvBlocks.length) {
      const ratio = editor.scrollTop / Math.max(1, (editor.scrollHeight - editor.clientHeight));
      previewScroll.scrollTop = ratio * (previewScroll.scrollHeight - previewScroll.clientHeight);
      return;
    }

    const atTop = editor.scrollTop <= 0;
	const atBottom = editor.scrollTop + editor.clientHeight >= editor.scrollHeight - 2;
    if (atTop) { previewScroll.scrollTop = 0; return; }
    if (atBottom) { previewScroll.scrollTop = previewScroll.scrollHeight - previewScroll.clientHeight; return; }

    const lineHeight = parseInt(getComputedStyle(editor).lineHeight) || 21;
    const paddingTop = parseFloat(getComputedStyle(editor).paddingTop) || 0;

    // Dòng đang nằm ở mốc 30% chiều cao khung editor
    const topLine = (editor.scrollTop - paddingTop) / lineHeight + 1;
    const anchorLine = Math.max(1, topLine + (editor.clientHeight / lineHeight) * SYNC_ANCHOR_RATIO);

    // Tìm block có headline (startLine) gần nhất, nhỏ hơn hoặc bằng anchorLine
    let idx = 0;
    for (let i = 0; i < mdvBlocks.length; i++) {
      if (mdvBlocks[i].startLine <= anchorLine) idx = i; else break;
    }

    const target = preview.querySelector(`.mdv-block[data-block-i="${idx}"]`);
    if (!target) {
      const ratio = editor.scrollTop / Math.max(1, (editor.scrollHeight - editor.clientHeight));
      previewScroll.scrollTop = ratio * (previewScroll.scrollHeight - previewScroll.clientHeight);
      return;
    }

    // Neo headline của block đó tại đúng mốc 30% chiều cao khung preview
    previewScroll.scrollTop = Math.max(0, Math.min(
      target.offsetTop - previewScroll.clientHeight * SYNC_ANCHOR_RATIO,
      previewScroll.scrollHeight - previewScroll.clientHeight
    ));
  };

  /* ================= Resizer ================= */
  const resizer = document.getElementById('resizer');
  const editorPane = document.getElementById('editorPane');
  const previewPane = document.getElementById('previewPane');
  let dragging = false;
  resizer.addEventListener('mousedown', () => { dragging = true; resizer.classList.add('dragging'); document.body.style.userSelect = 'none'; });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = document.getElementById('mainArea').getBoundingClientRect();
    let pct = ((e.clientX - rect.left) / rect.width) * 100;
    pct = Math.min(80, Math.max(20, pct));
    // preview pane sits on the left, editor pane on the right
    previewPane.style.flex = `0 0 ${pct}%`;
    editorPane.style.flex = `1 1 ${100 - pct}%`;
  });
  window.addEventListener('mouseup', () => { dragging = false; resizer.classList.remove('dragging'); document.body.style.userSelect = ''; });

  /* ================= View mode toggle ================= */
  const viewToggle = document.getElementById('viewToggle');
  const mainArea = document.getElementById('mainArea');
  let currentViewMode = 'preview';

  function setViewMode(mode) {
    currentViewMode = mode;
    [...viewToggle.children].forEach(b => b.classList.toggle('active', b.dataset.view === mode));
    document.querySelectorAll('[data-drawer-view]').forEach(b => b.classList.toggle('active', b.dataset.drawerView === mode));
    editorPane.classList.toggle('mdv-pane-hidden', mode === 'preview');
    previewPane.classList.remove('mdv-pane-hidden');
    resizer.style.display = mode === 'edit' ? 'block' : 'none';
    if (mode === 'edit') { editorPane.style.flex = '1 1 50%'; previewPane.style.flex = '1 1 50%'; }
    else { editorPane.style.flex = '1 1 100%'; previewPane.style.flex = '1 1 100%'; }
    if (mode !== 'preview') { editor.focus(); }
	updateActiveBlockHighlight();
  }

  viewToggle.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    setViewMode(btn.dataset.view);
  });
  document.querySelectorAll('[data-drawer-view]').forEach(btn => {
    btn.addEventListener('click', () => { setViewMode(btn.dataset.drawerView); closeDrawer(); });
  });

  setViewMode('preview');

  /* ================= Theme ================= */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeLabel = document.getElementById('themeLabel');
  const drawerThemeBtn = document.getElementById('drawerThemeBtn');
  const drawerThemeLabel = document.getElementById('drawerThemeLabel');
  function syncHljsTheme(isDark) {
	  document.getElementById('hljsTheme').href =
		`https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${isDark ? 'atom-one-dark' : 'github'}.min.css`;
	}
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (drawerThemeLabel) drawerThemeLabel.textContent = theme === 'dark' ? 'Dark' : 'Light';
    localStorage.setItem(LS_THEME, theme);
    if (window.mermaid) { mermaidReady = false; render(); }
  }
  function toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  }
  themeToggleBtn.addEventListener('click', toggleTheme);
  if (drawerThemeBtn) drawerThemeBtn.addEventListener('click', toggleTheme);
  (function initTheme() {
    const saved = localStorage.getItem(LS_THEME);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (prefersDark ? 'dark' : 'light'));
  })();

    /* ================= Find & Replace ================= */
  const findBar = document.getElementById('findBar');
  const findInput = document.getElementById('findInput');
  const replaceInput = document.getElementById('replaceInput');
  const findCount = document.getElementById('findCount');
  let matches = [], matchIdx = -1;
  let mdvBlocks = [];
  let optCase = false, optWord = false, optRegex = false;
  let previewMatches = [], previewMatchIdx = -1, lastPreviewQuery = null;

  function openFindBar() {
    const previewMode = currentViewMode === 'preview';
    findBar.classList.toggle('mdv-find-only', previewMode);
    findBar.classList.add('open');
    findInput.focus();
    findInput.select();
    if (findInput.value) liveSearch();
  }
  function closeFindBar() {
    findBar.classList.remove('open');
    clearPreviewHighlights();
    clearEditorHighlights();
    lastPreviewQuery = null;
  }
  document.getElementById('findBtn').addEventListener('click', openFindBar);
  document.getElementById('findClose').addEventListener('click', closeFindBar);

  ['optCase', 'optWord', 'optRegex'].forEach(id => {
    document.getElementById(id).addEventListener('click', (e) => {
      e.currentTarget.classList.toggle('on');
      if (id === 'optCase') optCase = e.currentTarget.classList.contains('on');
      if (id === 'optWord') optWord = e.currentTarget.classList.contains('on');
      if (id === 'optRegex') optRegex = e.currentTarget.classList.contains('on');
      doFind();
    });
  });

  function buildPattern() {
    const q = findInput.value;
    if (!q) return null;
    try {
      let pattern = optRegex ? q : q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (optWord) pattern = `\\b${pattern}\\b`;
      return new RegExp(pattern, 'g' + (optCase ? '' : 'i'));
    } catch (e) { return null; }
  }

  /* ---- Preview (view-mode) search: highlights every match directly in the rendered DOM ---- */
  function clearPreviewHighlights() {
    previewMatches = [];
    previewMatchIdx = -1;
    preview.querySelectorAll('mark.mdv-search-hit').forEach(m => {
      const parent = m.parentNode;
      if (!parent) return;
      while (m.firstChild) parent.insertBefore(m.firstChild, m);
      parent.removeChild(m);
      parent.normalize();
    });
  }
  function highlightPreviewMatches(query) {
    clearPreviewHighlights();
    if (!query) return;
    const needle = optCase ? query : query.toLowerCase();
    const walker = document.createTreeWalker(preview, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const tag = node.parentNode && node.parentNode.nodeName;
        if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'MARK') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes = [];
    let n;
    while ((n = walker.nextNode())) textNodes.push(n);
    textNodes.forEach(node => {
      const text = node.nodeValue;
      const hay = optCase ? text : text.toLowerCase();
      let last = 0, pos, found = false;
      const frag = document.createDocumentFragment();
      while ((pos = hay.indexOf(needle, last)) !== -1) {
        found = true;
        if (pos > last) frag.appendChild(document.createTextNode(text.slice(last, pos)));
        const mark = document.createElement('mark');
        mark.className = 'mdv-search-hit';
        mark.textContent = text.slice(pos, pos + needle.length);
        frag.appendChild(mark);
        previewMatches.push(mark);
        last = pos + needle.length;
      }
      if (found) {
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      }
    });
  }
  function gotoPreviewMatch(i) {
    if (!previewMatches.length) return;
    if (previewMatches[previewMatchIdx]) previewMatches[previewMatchIdx].classList.remove('current');
    previewMatchIdx = ((i % previewMatches.length) + previewMatches.length) % previewMatches.length;
    const el = previewMatches[previewMatchIdx];
    el.classList.add('current');
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  function findInPreview(forward) {
    const q = findInput.value;
    if (!q) { clearPreviewHighlights(); lastPreviewQuery = null; findCount.textContent = '0/0'; return; }
    if (q !== lastPreviewQuery) {
      highlightPreviewMatches(q);
      lastPreviewQuery = q;
    }
    if (!previewMatches.length) { findCount.textContent = '0/0'; return; }
    gotoPreviewMatch(previewMatchIdx < 0 ? 0 : previewMatchIdx + (forward ? 1 : -1));
    findCount.textContent = `${previewMatchIdx + 1}/${previewMatches.length}`;
  }

  /* ---- Edit-mode search (operates on the textarea's own value) ---- */
  function doFind(shouldSelect = true) {
    if (currentViewMode === 'preview') { findInPreview(true); return; }
    const re = buildPattern();
    matches = [];
    if (re) {
      let m;
      const text = editor.value;
      while ((m = re.exec(text))) {
        matches.push([m.index, m.index + m[0].length]);
        if (m.index === re.lastIndex) re.lastIndex++;
      }
    }
    matchIdx = matches.length ? 0 : -1;
    updateFindCount();
    if (shouldSelect && matchIdx >= 0) selectMatch(matchIdx);
  }

  function updateFindCount() { findCount.textContent = matches.length ? `${matchIdx + 1}/${matches.length}` : '0/0'; }

  function clearEditorHighlights() {
    const layer = document.getElementById('editorHighlightLayer');
    if (layer) layer.innerHTML = escapeHtml(editor.value);
  }

  function selectMatch(i) {
  if (i < 0 || i >= matches.length) return;
  const [s, e] = matches[i];
  const text = editor.value;

  const layer = document.getElementById('editorHighlightLayer');
  if (layer) {
    layer.innerHTML =
      escapeHtml(text.slice(0, s)) +
      '<mark class="mdv-search-hit current">' + escapeHtml(text.slice(s, e)) + '</mark>' +
      escapeHtml(text.slice(e));
  }

  editor.setSelectionRange(s, e);

  // Luôn tính thủ công vì markEl nằm trong lớp overlay riêng,
  // không phải con thật của <textarea> nên scrollIntoView không hoạt động.
  const lineHeight = parseInt(getComputedStyle(editor).lineHeight) || 21;
  const linesBefore = text.substring(0, s).split('\n').length;
  const visibleLines = Math.floor(editor.clientHeight / lineHeight);
  const targetTop = Math.max(0, (linesBefore - Math.floor(visibleLines / 2)) * lineHeight);
  editor.scrollTop = targetTop;

  if (layer) layer.scrollTop = editor.scrollTop;
  gutter.scrollTop = editor.scrollTop;
}

  function liveSearch() {
    if (currentViewMode === 'preview') {
      const q = findInput.value;
      if (!q) { clearPreviewHighlights(); lastPreviewQuery = null; findCount.textContent = '0/0'; return; }
      highlightPreviewMatches(q);
      lastPreviewQuery = q;
      if (previewMatches.length) { gotoPreviewMatch(0); findCount.textContent = `1/${previewMatches.length}`; }
      else { findCount.textContent = '0/0'; }
    } else {
      doFind(true);
      if (!matches.length) clearEditorHighlights();
    }
  }
  findInput.addEventListener('input', liveSearch);
  findInput.addEventListener('keydown', (e) => {
	  if (e.key === 'Enter') {
		e.preventDefault();
		e.stopImmediatePropagation();

		if (currentViewMode === 'preview') { 
		  findInPreview(!e.shiftKey); 
		  return; 
		}
		
		// Edit mode
		if (matches.length) {
		  if (e.shiftKey) {
			matchIdx = (matchIdx - 1 + matches.length) % matches.length;
		  } else {
			matchIdx = (matchIdx + 1) % matches.length;
		  }
		  selectMatch(matchIdx);
		  updateFindCount();
		} else {
		  doFind(true);
		}
		// findInput đã giữ focus sẵn, không cần focus lại
		return;
	  }
	  
	  if (e.key === 'Escape') {
		closeFindBar();
	  }
	});
  document.getElementById('findNext').addEventListener('click', () => {
    if (currentViewMode === 'preview') { findInPreview(true); return; }
    if (!matches.length) return; 
    matchIdx = (matchIdx + 1) % matches.length; 
    selectMatch(matchIdx); 
    updateFindCount();
  });
  document.getElementById('findPrev').addEventListener('click', () => {
    if (currentViewMode === 'preview') { findInPreview(false); return; }
    if (!matches.length) return; 
    matchIdx = (matchIdx - 1 + matches.length) % matches.length; 
    selectMatch(matchIdx); 
    updateFindCount();
  });
  document.getElementById('replaceOneBtn').addEventListener('click', () => {
    if (matchIdx < 0) return;
    const [s, e] = matches[matchIdx];
    editor.value = editor.value.slice(0, s) + replaceInput.value + editor.value.slice(e);
    editor.dispatchEvent(new Event('input'));
    doFind(true);
  });
  document.getElementById('replaceAllBtn').addEventListener('click', () => {
    const re = buildPattern();
    if (!re) return;
    editor.value = editor.value.replace(re, replaceInput.value);
    editor.dispatchEvent(new Event('input'));
    doFind(true);
  });

  /* ================= Import ================= */
  const fileInput = document.getElementById('fileInput');
  document.getElementById('importFileBtn').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => {
    const f = fileInput.files[0];
    if (f) loadFileIntoNewTab(f);
    fileInput.value = '';
  });

  function loadFileIntoNewTab(file) {
	  const reader = new FileReader();
	  reader.onload = () => {
		saveEditorIntoTab();
		const t = newTab(file.name.replace(/\.(md|markdown|txt)$/i, ''), reader.result);
		tabs.push(t);
		activeId = t.id;
		editor.value = t.content;
		editor.readOnly = false;   // thêm dòng này
		renderTabbar();
		render();
		saveTabs();
	  };
	  reader.readAsText(file);
	}

  // Drag & drop
  const dropOverlay = document.getElementById('dropOverlay');
  let dragCounter = 0;
  window.addEventListener('dragenter', (e) => { e.preventDefault(); dragCounter++; dropOverlay.classList.add('active'); });
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('dragleave', () => { dragCounter--; if (dragCounter <= 0) { dragCounter = 0; dropOverlay.classList.remove('active'); } });
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    dropOverlay.classList.remove('active');
    const files = [...(e.dataTransfer.files || [])];
    files.forEach(loadFileIntoNewTab);
  });

  // URL import
  const urlModalOverlay = document.getElementById('urlModalOverlay');
  document.getElementById('importUrlBtn').addEventListener('click', () => urlModalOverlay.classList.add('open'));
  document.getElementById('urlModalClose').addEventListener('click', () => urlModalOverlay.classList.remove('open'));
  document.getElementById('urlCancelBtn').addEventListener('click', () => urlModalOverlay.classList.remove('open'));
  document.getElementById('urlLoadBtn').addEventListener('click', async () => {
    const url = document.getElementById('urlInput').value.trim();
    if (!url) return;
    try {
      const res = await fetch(url);
      const text = await res.text();
      saveEditorIntoTab();
      const name = url.split('/').pop().replace(/\.(md|markdown|txt)$/i, '') || 'url-document';
      const t = newTab(name, text);
      tabs.push(t); activeId = t.id;
      editor.value = t.content;
      renderTabbar(); render(); saveTabs();
      urlModalOverlay.classList.remove('open');
    } catch (e) {
      alert('Cannot load file from this URL (may be due to CORS or network).');
    }
  });

  /* ================= Export ================= */
  function download(filename, content, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  function exportMarkdown() {
    const t = getActiveTab();
    download(`${t.name}.md`, t.content, 'text/markdown;charset=utf-8');
  }

  function exportHtmlStandalone() {
    const t = getActiveTab();
    const doc = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8"><title>${escapeHtml(t.name)}</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,sans-serif;max-width:760px;margin:40px auto;padding:0 24px;line-height:1.7;color:#0F172A;}
h1,h2,h3,h4{color:#0F172A;} h2{border-bottom:1px solid #E2E8F0;padding-bottom:.3em;}
code{background:#E8EAED;padding:2px 6px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:0.87em;color:#DC2626;}
pre{background:#0F172A;color:#E6EDF3;padding:16px 18px;border-radius:10px;overflow-x:auto;}
pre code{background:none;color:inherit;padding:0;}
blockquote{border-left:3px solid #0F172A;padding-left:18px;color:#64748B;font-style:italic;}
table{width:100%;border-collapse:collapse;} th,td{padding:8px 12px;border-bottom:1px solid #E2E8F0;} th{background:#F0F2F5;}
img{max-width:100%;border-radius:8px;}
</style></head><body>${preview.innerHTML}</body></html>`;
    download(`${t.name}.html`, doc, 'text/html;charset=utf-8');
  }

  function exportPdf() {
    const t = getActiveTab();
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHtml(t.name)}</title>
      <link rel="stylesheet" href="${location.origin + location.pathname.replace('index.html','')}core.css">
      <style>body{background:#fff;padding:20px;} .mdv-preview{max-width:100%;margin:0;padding:0;}</style>
      </head><body><div class="post-content mdv-preview">${preview.innerHTML}</div></body></html>`);
    w.document.close();
    w.onload = () => { w.focus(); w.print(); };
  }

  function copyRenderedHtml() {
    navigator.clipboard.writeText(preview.innerHTML).then(() => {
      flashChip('HTML copied!');
    }).catch(() => alert('Cannot copy.'));
  }

  function flashChip(msg) {
    statusMsg.textContent = msg;
    setTimeout(() => { statusMsg.textContent = ''; }, 1400);
  }

  document.getElementById('exportMdBtn').addEventListener('click', exportMarkdown);
  document.getElementById('exportHtmlBtn').addEventListener('click', exportHtmlStandalone);
  document.getElementById('exportPdfBtn').addEventListener('click', exportPdf);
  document.getElementById('copyHtmlBtn').addEventListener('click', copyRenderedHtml);

  /* ================= Copy code-block buttons (event delegation) ================= */
  preview.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (!btn) return;
    const code = btn.parentElement.querySelector('code');
    if (code) navigator.clipboard.writeText(code.innerText);
    btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><polyline points="20 6 9 17 4 12"/></svg>';
    setTimeout(() => { btn.innerHTML = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'; }, 1500);
  });

  /* ================= Dropdown open/close (generic) ================= */
  document.querySelectorAll('.dropdown').forEach(dd => {
    const trigger = dd.querySelector('button');
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = dd.classList.contains('open');
      document.querySelectorAll('.dropdown.open').forEach(o => o.classList.remove('open'));
      if (!wasOpen) dd.classList.add('open');
    });
  });
  document.addEventListener('click', () => document.querySelectorAll('.dropdown.open').forEach(o => o.classList.remove('open')));

  /* ================= Table of Contents (desktop sidebar + drawer) ================= */
  const tocSidebarList = document.getElementById('tocSidebarList');
  const drawerTocList = document.getElementById('drawerTocList');

  function slugify(text, used) {
    let base = text.toLowerCase().trim()
      .replace(/[^\w\u00C0-\uFFFF\- ]/g, '')
      .replace(/\s+/g, '-');
    if (!base) base = 'section';
    let slug = base, i = 1;
    while (used.has(slug)) { slug = `${base}-${i++}`; }
    used.add(slug);
    return slug;
  }

  function buildToc() {
    const heads = preview.querySelectorAll('h1, h2, h3, h4');
    const used = new Set();
    const items = [];
    heads.forEach(h => {
      const id = slugify(h.textContent || '', used);
      h.id = id;
      items.push({ id, level: parseInt(h.tagName[1], 10), text: h.textContent || '' });
    });
    const html = !items.length
      ? '<div class="mdv-toc-empty">No headings</div>'
      : (() => {
          const minLevel = Math.min(...items.map(i => i.level));
          return items.map(i =>
            `<a href="#${i.id}" class="toc-lvl-${Math.min(4, i.level - minLevel + 1)}" data-target="${i.id}">${escapeHtml(i.text)}</a>`
          ).join('');
        })();
    tocSidebarList.innerHTML = html;
    drawerTocList.innerHTML = html;
  }

  function gotoHeading(id) {
    const target = document.getElementById(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  [tocSidebarList, drawerTocList].forEach(list => {
    list.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-target]');
      if (!a) return;
      e.preventDefault();
      gotoHeading(a.dataset.target);
      closeDrawer();
    });
  });

  /* ================= Compact Drawer (mobile / tablet) ================= */
  const menuBtn = document.getElementById('menuBtn');
  const drawer = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOpenBtn = document.getElementById('drawerOpenBtn');
  const drawerSaveBtn = document.getElementById('drawerSaveBtn');
  const drawerRenameBtn = document.getElementById('drawerRenameBtn');

  function openDrawer() { drawer.classList.add('open'); drawerOverlay.classList.add('open'); }
  function closeDrawer() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); }
  menuBtn.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  drawerOpenBtn.addEventListener('click', () => { closeDrawer(); fileInput.click(); });
  drawerSaveBtn.addEventListener('click', () => { closeDrawer(); exportMarkdown(); });
  if (drawerRenameBtn) drawerRenameBtn.addEventListener('click', () => { closeDrawer(); renameTab(activeId); });

  /* ================= Auto-hide scrollbars (show while actively scrolling) ================= */
  document.querySelectorAll('.mdv-autohide-scroll').forEach(el => {
    let hideTimer = null;
    el.addEventListener('scroll', () => {
      el.classList.add('is-scrolling');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => el.classList.remove('is-scrolling'), 800);
    }, { passive: true });
  });

  /* ================= Beforeunload guard ================= */
  window.addEventListener('beforeunload', () => { saveEditorIntoTab(); saveTabs(); });

  /* ================= Init ================= */
  loadTabs();
  renderTabbar();
  editor.value = getActiveTab().content;
  editor.readOnly = getActiveTab().name === 'Tri.Markdown';
  updateGutter();
  updateLineInfo();
  render();
})();
