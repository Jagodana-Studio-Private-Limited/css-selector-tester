"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { Copy, Check, RotateCcw, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolEvents } from "@/lib/analytics";

const SAMPLE_HTML_TEMPLATES = [
  {
    label: "Navigation",
    html: `<nav class="navbar">
  <a href="/" class="logo active">Home</a>
  <a href="/about" class="nav-link">About</a>
  <a href="/blog" class="nav-link">Blog</a>
  <a href="/contact" class="nav-link">Contact</a>
</nav>`,
  },
  {
    label: "Article",
    html: `<article class="post" data-category="tech">
  <h1 class="title">Hello World</h1>
  <p class="intro">Welcome to my first post.</p>
  <section class="body">
    <h2>Section One</h2>
    <p>Some <strong>bold</strong> and <em>italic</em> text.</p>
    <ul class="list">
      <li class="item">First item</li>
      <li class="item active">Second item</li>
      <li class="item">Third item</li>
    </ul>
  </section>
</article>`,
  },
  {
    label: "Form",
    html: `<form class="form" id="login-form">
  <div class="field">
    <label for="email">Email</label>
    <input id="email" type="email" name="email" required />
  </div>
  <div class="field">
    <label for="password">Password</label>
    <input id="password" type="password" name="password" required />
  </div>
  <button type="submit" class="btn btn-primary">Login</button>
  <button type="button" class="btn btn-secondary">Cancel</button>
</form>`,
  },
  {
    label: "Cards",
    html: `<div class="grid">
  <div class="card featured" data-id="1">
    <img src="a.jpg" alt="Card 1" class="card-img" />
    <h3 class="card-title">Card One</h3>
    <p class="card-desc">Description one.</p>
    <a href="#" class="cta">Read More</a>
  </div>
  <div class="card" data-id="2">
    <img src="b.jpg" alt="Card 2" class="card-img" />
    <h3 class="card-title">Card Two</h3>
    <p class="card-desc">Description two.</p>
    <a href="#" class="cta">Read More</a>
  </div>
  <div class="card disabled" data-id="3">
    <h3 class="card-title">Card Three</h3>
    <p class="card-desc">Description three.</p>
  </div>
</div>`,
  },
];

type MatchedEl = {
  tag: string;
  id: string;
  classes: string[];
  text: string;
  index: number;
};

function parseAndMatch(html: string, selector: string): { matched: MatchedEl[]; error: string | null; highlighted: string } {
  if (!selector.trim()) {
    return { matched: [], error: null, highlighted: html };
  }

  let doc: Document;
  try {
    const parser = new DOMParser();
    doc = parser.parseFromString(`<div id="__root__">${html}</div>`, "text/html");
  } catch {
    return { matched: [], error: "Invalid HTML", highlighted: html };
  }

  const root = doc.getElementById("__root__");
  if (!root) return { matched: [], error: null, highlighted: html };

  let nodes: NodeList;
  try {
    nodes = root.querySelectorAll(selector);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { matched: [], error: `Invalid selector: ${msg}`, highlighted: html };
  }

  const matched: MatchedEl[] = [];
  nodes.forEach((node, i) => {
    const el = node as Element;
    matched.push({
      tag: el.tagName.toLowerCase(),
      id: el.id,
      classes: Array.from(el.classList),
      text: (el.textContent ?? "").trim().slice(0, 60),
      index: i,
    });
  });

  // Build highlighted HTML by marking matched elements
  nodes.forEach((node) => {
    const el = node as HTMLElement;
    el.setAttribute("data-css-match", "true");
    el.setAttribute(
      "style",
      (el.getAttribute("style") ?? "") +
        ";outline:2px solid #3b82f6;outline-offset:2px;background:rgba(59,130,246,0.12);"
    );
  });

  const highlighted = root.innerHTML;
  return { matched, error: null, highlighted };
}

const SELECTOR_EXAMPLES = [
  { label: "By class", value: ".nav-link" },
  { label: "By ID", value: "#email" },
  { label: "By element", value: "li" },
  { label: "By attribute", value: "[type='email']" },
  { label: "Child combinator", value: "nav > a" },
  { label: "Descendant", value: "form input" },
  { label: ".active class", value: ".active" },
  { label: "First child", value: "li:first-child" },
  { label: "nth-child", value: "li:nth-child(2)" },
  { label: "Multiple", value: "h1, h2, h3" },
  { label: "[data-*]", value: "[data-category]" },
  { label: "Not", value: "a:not(.active)" },
];

export function CssSelectorTesterTool() {
  const [html, setHtml] = useState(SAMPLE_HTML_TEMPLATES[1].html);
  const [selector, setSelector] = useState(".item");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { matched, error, highlighted } = useMemo(
    () => parseAndMatch(html, selector),
    [html, selector]
  );

  const handleSelectorChange = useCallback(
    (val: string) => {
      setSelector(val);
      if (matched.length > 0) {
        ToolEvents.toolUsed("selector_match");
      }
    },
    [matched.length]
  );

  const handleCopySelector = useCallback(async () => {
    await navigator.clipboard.writeText(selector);
    setCopied(true);
    toast.success("Selector copied!");
    ToolEvents.resultCopied();
    setTimeout(() => setCopied(false), 1500);
  }, [selector]);

  const handleReset = useCallback(() => {
    setHtml(SAMPLE_HTML_TEMPLATES[1].html);
    setSelector(".item");
    toast.success("Reset to default");
  }, []);

  const handleTemplateSelect = useCallback((tmpl: (typeof SAMPLE_HTML_TEMPLATES)[number]) => {
    setHtml(tmpl.html);
    setSelector("");
    ToolEvents.toolUsed("template_load");
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="max-w-6xl mx-auto space-y-4"
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px]">
          <div className="relative flex items-center gap-2">
            <div className="flex-1 relative">
              <Input
                value={selector}
                onChange={(e) => handleSelectorChange(e.target.value)}
                placeholder="Enter CSS selector e.g. .class, #id, div > p"
                className={`font-mono text-sm pr-20 ${error ? "border-destructive focus-visible:ring-destructive/20" : "border-brand/30 focus-visible:ring-brand/20"}`}
                aria-label="CSS Selector input"
                spellCheck={false}
              />
              {selector && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {error ? (
                    <Badge variant="destructive" className="text-xs">error</Badge>
                  ) : (
                    <Badge className="text-xs bg-brand text-white border-0">
                      {matched.length} match{matched.length !== 1 ? "es" : ""}
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Button
              size="icon"
              variant="outline"
              onClick={handleCopySelector}
              disabled={!selector}
              title="Copy selector"
            >
              {copied ? <Check className="h-4 w-4 text-brand" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleReset}
              title="Reset to defaults"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          {error && (
            <p className="text-destructive text-xs mt-1 ml-1">{error}</p>
          )}
        </div>
      </div>

      {/* Quick examples */}
      <div className="flex flex-wrap gap-2">
        {SELECTOR_EXAMPLES.map((ex) => (
          <button
            key={ex.value}
            onClick={() => setSelector(ex.value)}
            className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border/60 hover:border-brand/40 hover:bg-brand/5 hover:text-brand transition-colors font-mono"
            title={ex.label}
          >
            {ex.value}
          </button>
        ))}
      </div>

      {/* Main panels */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* HTML Editor */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-muted/30">
            <span className="text-sm font-medium">HTML</span>
            <div className="flex gap-2">
              {SAMPLE_HTML_TEMPLATES.map((t) => (
                <button
                  key={t.label}
                  onClick={() => handleTemplateSelect(t)}
                  className="text-xs px-2 py-0.5 rounded bg-background border border-border/60 hover:border-brand/40 hover:text-brand transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <textarea
            ref={textareaRef}
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full h-72 p-4 bg-transparent font-mono text-sm resize-none focus:outline-none focus:ring-0 border-0"
            placeholder="Paste your HTML here..."
            spellCheck={false}
            aria-label="HTML input"
          />
        </div>

        {/* Results Panel */}
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-muted/30">
            <span className="text-sm font-medium">
              {error
                ? "Error"
                : matched.length === 0 && selector
                ? "No Matches"
                : `Matched Elements`}
            </span>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPreview ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              {showPreview ? "Hide" : "Show"} preview
            </button>
          </div>

          <div className="h-72 overflow-y-auto">
            {!selector.trim() ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                <p className="text-sm">Type a selector above to see matches</p>
                <p className="text-xs opacity-60">e.g. .class, #id, div &gt; p</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-destructive gap-2 px-6 text-center">
                <p className="text-sm font-medium">Invalid selector</p>
                <p className="text-xs opacity-80">{error}</p>
              </div>
            ) : matched.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2 px-6 text-center">
                <p className="text-sm">No elements matched</p>
                <p className="text-xs opacity-60">
                  Try a different selector or adjust your HTML
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border/40">
                {matched.map((el, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 px-4 py-3 hover:bg-muted/20 transition-colors"
                  >
                    <span className="mt-0.5 text-xs font-mono text-muted-foreground min-w-[1.5rem] text-right">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-xs font-mono text-brand font-semibold">
                          &lt;{el.tag}&gt;
                        </code>
                        {el.id && (
                          <code className="text-xs font-mono text-brand-accent">
                            #{el.id}
                          </code>
                        )}
                        {el.classes.map((c) => (
                          <code key={c} className="text-xs font-mono text-muted-foreground">
                            .{c}
                          </code>
                        ))}
                      </div>
                      {el.text && (
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {el.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HTML Preview with highlights */}
      {showPreview && selector && !error && matched.length > 0 && (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
          <div className="px-4 py-2.5 border-b border-border/50 bg-muted/30 flex items-center gap-2">
            <span className="text-sm font-medium">HTML Preview</span>
            <Badge className="text-xs bg-brand/10 text-brand border-brand/20">
              {matched.length} highlighted
            </Badge>
          </div>
          <div
            className="p-4 font-mono text-sm overflow-auto max-h-64 whitespace-pre-wrap break-all leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      )}

      {/* Info bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>Uses browser-native querySelectorAll() — same as real CSS</span>
        <span className="hidden sm:inline">100% client-side · no data sent to server</span>
      </div>
    </motion.div>
  );
}
