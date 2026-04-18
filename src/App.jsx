import React, { useState, useEffect, useRef } from 'react';
import { Copy, Code, Eye, MonitorPlay, Settings2, Bold, Italic, Palette, ChevronDown, AlignLeft, RotateCcw, MessageSquare, AlertCircle, Plus, Minus, ClipboardPaste, Undo2, Redo2, Type } from 'lucide-react';

const App = () => {
  const defaultText = `<size=45><color=#fc0><b>▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</b></color>
<color=#f80><b>· . ✦  WELCOME TO OUR KIN  ✦ . ·</b></color>
<color=#fc0><b>▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</b></color></size>
You are now part of our <color=#0cf><b>First Shard</b></color>. In this Kin, we do not chase the fires of the past as we set out for the future.

<color=#f90><b>◈ THE GUIDELINES ◈</b></color>
<b>1. Actions speak louder than words:</b> Our actions define our Frame of Mind.
 Speech is <b><color=#71706E>silver</color></b>, silence is <b><color=#f90>golden</color></b>.
<b>2. Communication is Key:</b> Ask your Kin when in doubt. Showing intent to grow isn't a weakness.
<b>3. The Kin Comes First:</b> We help our own to ensure the strength of a <color=#0cf><b>Diamond</b></color>.
<b>4. We Move at 14:00 UTC:</b> Do not falter, because the eternal battlefield never sleeps.

<color=#f30><b>FOR THE SOVEREIGN KIN!</b></color>
<size=30><color=#fc0><b>▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬</b></color>
<i>. *｡ ✦ . ﾟ * ✦· . ✦ * ﾟ . ✧ ･ ﾟ ｡ ✦ . ﾟ * ✦ . · . ✧ ･ ﾟ ｡ ✦ . *</i></size>`;

  const DEFAULTS = {
    previewWidth: 835,
    textStroke: 0.5,
    sdfMode: 'stroke',
    letterSpacing: 0.4,
    fontWeight: 400,
    fontSmoothing: 'auto',
    sizeMultiplier: 0.92,
    uiScale: 1.5,
    wordWrap: true
  };

  const [text, setText] = useState(defaultText);
  const [parsedHtml, setParsedHtml] = useState('');
  const [copied, setCopied] = useState(false);
  const [discordCopied, setDiscordCopied] = useState(false);
  
  const [previewWidth, setPreviewWidth] = useState(DEFAULTS.previewWidth);
  const [textStroke, setTextStroke] = useState(DEFAULTS.textStroke);
  const [sdfMode, setSdfMode] = useState(DEFAULTS.sdfMode);
  const [letterSpacing, setLetterSpacing] = useState(DEFAULTS.letterSpacing);
  const [fontWeight, setFontWeight] = useState(DEFAULTS.fontWeight);
  const [fontSmoothing, setFontSmoothing] = useState(DEFAULTS.fontSmoothing);
  const [sizeMultiplier, setSizeMultiplier] = useState(DEFAULTS.sizeMultiplier);
  const [uiScale, setUiScale] = useState(DEFAULTS.uiScale);
  const [wordWrap, setWordWrap] = useState(DEFAULTS.wordWrap);
  
  const [showAdjust, setShowAdjust] = useState(false);
  const [activeColor, setActiveColor] = useState('#f90');
  const [activeSize, setActiveSize] = useState(45); 
  
  const [leftPanelWidth, setLeftPanelWidth] = useState(50);
  const [isDraggingDivider, setIsDraggingDivider] = useState(false);
  
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isZoomHighlighted, setIsZoomHighlighted] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  
  const previewRef = useRef(null);
  const isTypingRef = useRef(false);
  const colorMenuRef = useRef(null);

  const charCount = text.length;
  const isOverLimit = charCount > 2000;

  const colorOptions = [
    { name: 'Amethyst', value: '#a0f' },
    { name: 'Diamond', value: '#0cf' },
    { name: 'Gems', value: '#c00' },
    { name: 'Gold Leaf', value: '#fc0' },
    { name: 'Golden', value: '#f90' },
    { name: 'Green', value: '#4d0' },
    { name: 'Red', value: '#f30' }
  ];

  useEffect(() => {
    const width = window.innerWidth;
    if (width < 1200) {
      setZoomLevel(Math.max(25, Math.floor((width / 1200) * 100)));
      setIsMobileView(true); // Mobile -> pokazuje kontrolki zoomu i natywny select
    } else {
      setIsMobileView(false); // Desktop -> ukrywa kontrolki zoomu
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsZoomHighlighted(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let metaViewport = document.querySelector('meta[name="viewport"]');
    if (!metaViewport) {
      metaViewport = document.createElement('meta');
      metaViewport.name = 'viewport';
      document.head.appendChild(metaViewport);
    }
    metaViewport.content = 'width=device-width, initial-scale=1.0, user-scalable=yes';
  }, []);

  const resetToDefaults = () => {
    setPreviewWidth(DEFAULTS.previewWidth);
    setTextStroke(DEFAULTS.textStroke);
    setSdfMode(DEFAULTS.sdfMode);
    setLetterSpacing(DEFAULTS.letterSpacing);
    setFontWeight(DEFAULTS.fontWeight);
    setFontSmoothing(DEFAULTS.fontSmoothing);
    setSizeMultiplier(DEFAULTS.sizeMultiplier);
    setUiScale(DEFAULTS.uiScale);
    setWordWrap(DEFAULTS.wordWrap);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDraggingDivider) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const newWidth = (clientX / window.innerWidth) * 100;
      if (newWidth > 15 && newWidth < 85) setLeftPanelWidth(newWidth);
    };
    const handleUp = () => setIsDraggingDivider(false);

    if (isDraggingDivider) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);
      document.addEventListener('touchmove', handleMove, { passive: false });
      document.addEventListener('touchend', handleUp);
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      document.removeEventListener('touchmove', handleMove);
      document.removeEventListener('touchend', handleUp);
    };
  }, [isDraggingDivider]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorMenuRef.current && !colorMenuRef.current.contains(event.target)) {
        setIsColorMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const rgbToHex = (rgb) => {
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return rgb;
    return "#" + match.slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('');
  };

  const normalizeColor = (col) => {
    if (!col) return null;
    col = col.toLowerCase().trim();
    
    if (col.startsWith('rgb')) {
        const match = col.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            col = "#" + match.slice(1, 4).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('');
        }
    }
    
    const map = { 
      '#ffcc00': '#fc0', '#ff9900': '#f90', '#00ccff': '#0cf', '#ff3300': '#f30',
      '#44dd00': '#4d0', '#cc0000': '#c00', '#aa00ff': '#a0f'
    };
    if (map[col]) col = map[col];
    
    if (col.length === 7 && col[0] === '#' && col[1] === col[2] && col[3] === col[4] && col[5] === col[6]) {
      col = '#' + col[1] + col[3] + col[5];
    }
    return col;
  };

  const htmlToGameText = (htmlString) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    const traverse = (node) => {
        if (node.nodeType === 3) return node.textContent;
        if (node.nodeType !== 1) return '';
        let prefix = '', suffix = '', textContent = '';
        const tag = node.tagName.toLowerCase();
        if (tag === 'div' || tag === 'p') { if (node.innerHTML === '<br>') return '\n'; prefix += '\n'; }
        if (tag === 'br') return '\n';
        if (tag === 'b' || tag === 'strong' || node.style.fontWeight === 'bold') { prefix += '<b>'; suffix = '</b>' + suffix; }
        if (tag === 'i' || tag === 'em' || node.style.fontStyle === 'italic') { prefix += '<i>'; suffix = '</i>' + suffix; }
        
        let colorApplied = null;
        
        if (tag === 'font' && node.getAttribute('color')) { 
            colorApplied = normalizeColor(node.getAttribute('color'));
            prefix += `<color=${colorApplied}>`; 
            suffix = '</color>' + suffix; 
        }
        if (node.style) {
            if (node.style.color) { 
                let styleColor = normalizeColor(node.style.color);
                if (styleColor && styleColor !== colorApplied) {
                    prefix += `<color=${styleColor}>`; 
                    suffix = '</color>' + suffix; 
                }
            }
            if (node.style.fontSize) { 
              const size = parseFloat(node.style.fontSize);
              if (!isNaN(size)) {
                prefix += `<size=${Math.round(size / sizeMultiplier)}>`; suffix = '</size>' + suffix; 
              }
            }
        }
        for (let i = 0; i < node.childNodes.length; i++) textContent += traverse(node.childNodes[i]);
        return prefix + textContent + suffix;
    };
    let result = traverse(tempDiv).replace(/^\n+/, '').replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
    return result;
  };

  const parseGameText = (inputText) => {
    if (!inputText) return "";
    let html = inputText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html
      .replace(/&lt;color=([^&]+?)&gt;/gi, '<span style="color: $1;">')
      .replace(/&lt;\/color&gt;/gi, '</span>')
      .replace(/&lt;size=([\d.]+)(px|em|%)?&gt;/gi, (match, size, unit) => `<span style="font-size: ${unit ? size : (parseFloat(size) * sizeMultiplier)}${unit || 'px'};">`)
      .replace(/&lt;\/size&gt;/gi, '</span>')
      .replace(/&lt;b&gt;/gi, '<strong>')
      .replace(/&lt;\/b&gt;/gi, '</strong>')
      .replace(/&lt;i&gt;/gi, '<em>')
      .replace(/&lt;\/i&gt;/gi, '</em>')
      .replace(/\n/g, '<br/>');
    return html;
  };

  const convertToDiscord = (gameText) => {
    let d = gameText;
    const processHeaders = (content, prefix) => {
      return content.replace(/<[^>]+>/g, '').split('\n').map(line => line.trim() ? `${prefix} ${line}` : line).join('\n');
    };
    d = d.replace(/<size=([4-9]\d|100)>(.*?)<\/size>/gis, (m, s, content) => processHeaders(content, '##'));
    d = d.replace(/<size=([2-3]\d)>(.*?)<\/size>/gis, (m, s, content) => processHeaders(content, '###'));
    d = d.replace(/<b>(.*?)<\/b>/gis, '**$1**');
    d = d.replace(/<i>(.*?)<\/i>/gis, '*$1*');
    d = d.replace(/<color=.*?>/gi, '').replace(/<\/color>/gi, '');
    d = d.replace(/<size=.*?>/gi, '').replace(/<\/size>/gi, '');
    return d.trim();
  };

  useEffect(() => {
    const html = parseGameText(text);
    setParsedHtml(html);
    if (!isTypingRef.current && previewRef.current) previewRef.current.innerHTML = html;
  }, [text, sizeMultiplier]);

  const handlePreviewInput = (e) => {
    isTypingRef.current = true;
    setText(htmlToGameText(e.currentTarget.innerHTML));
  };

  const handlePreviewBlur = () => {
    isTypingRef.current = false;
    if (previewRef.current) {
      previewRef.current.innerHTML = parseGameText(text);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  const handleDiscordCopy = () => {
    const discordText = convertToDiscord(text);
    navigator.clipboard.writeText(discordText).then(() => { setDiscordCopied(true); setTimeout(() => setDiscordCopied(false), 2000); });
  };

  const handlePasteToSource = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
    } catch (err) {
      console.error('Brak dostępu do schowka: ', err);
    }
  };

  const executeFormat = (e, command, value = null) => {
    if (e) e.preventDefault();
    document.execCommand(command, false, value);
    if (previewRef.current) {
      isTypingRef.current = true;
      setText(htmlToGameText(previewRef.current.innerHTML));
    }
  };

  const applySizeFormat = (e) => {
    if (e) e.preventDefault();
    document.execCommand('fontSize', false, '7'); 
    if (previewRef.current) {
      const fonts = previewRef.current.querySelectorAll('font[size="7"]');
      fonts.forEach(font => {
        const span = document.createElement('span');
        span.style.fontSize = `${activeSize * sizeMultiplier}px`;
        span.innerHTML = font.innerHTML;
        font.parentNode.replaceChild(span, font);
      });
      isTypingRef.current = true;
      setText(htmlToGameText(previewRef.current.innerHTML));
    }
  };

  const currentScale = zoomLevel / 100;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] overflow-x-auto overflow-y-hidden bg-slate-950 scroll-smooth">
      <style>{`
        body, html { margin: 0; padding: 0; background-color: #020617; }
        .game-preview-editor *::selection, .game-preview-editor::selection { background-color: rgba(59, 130, 246, 0.4) !important; color: inherit !important; text-shadow: none !important; -webkit-text-stroke: 0px !important; }
        textarea::selection { background-color: rgba(59, 130, 246, 0.5) !important; color: #ffffff !important; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      <div 
        className="flex flex-col bg-slate-950 text-slate-200 font-sans" 
        style={{ 
          minWidth: '1200px',
          width: currentScale < 1 ? '1200px' : '100%',
          height: `${100 / currentScale}dvh`, 
          transform: `scale(${currentScale})`,
          transformOrigin: 'top left'
        }}
      >
        <header className="flex items-center justify-between px-6 py-3 bg-slate-900 border-b border-slate-800 shadow-lg z-30 shrink-0">
          <div className="flex items-center gap-3">
            <MonitorPlay className="text-amber-500 w-5 h-5" />
            <h1 className="text-lg font-bold tracking-wide text-white">Game Rich Text Editor</h1>
          </div>
          
          {isMobileView && (
            <div className="flex items-center gap-1 bg-slate-950 rounded-lg border border-slate-700 shadow-inner overflow-hidden relative">
              <button 
                onClick={() => setZoomLevel(z => Math.max(20, z - 10))} 
                className="px-4 py-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-800 transition-colors active:bg-slate-700"
                title="Oddal (Zoom Out)"
              >
                <Minus size={18} />
              </button>
              <span className="text-sm font-mono font-semibold text-slate-300 w-12 text-center select-none">
                {zoomLevel}%
              </span>
              <button 
                onClick={() => {
                  setZoomLevel(z => Math.min(200, z + 10));
                  setIsZoomHighlighted(false);
                }} 
                className={`flex items-center justify-center transition-all duration-1000 ease-in-out
                  ${isZoomHighlighted 
                    ? 'px-8 py-3 bg-amber-500/20 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' 
                    : 'px-4 py-1.5 text-slate-400 hover:text-amber-500 hover:bg-slate-800 active:bg-slate-700'
                  }
                `}
                title="Przybliż (Zoom In)"
              >
                <Plus size={isZoomHighlighted ? 26 : 18} className="transition-all duration-1000 ease-in-out" />
              </button>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button 
              onClick={handleDiscordCopy}
              className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded transition-colors text-sm font-semibold shadow-sm active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              {discordCopied ? "Copied!" : "Copy for Discord"}
            </button>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded transition-colors text-sm font-semibold shadow-sm active:scale-95"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy Code"}
            </button>
          </div>
        </header>

        <main className="flex flex-1 flex-row relative overflow-hidden">
          <section className="flex flex-col bg-slate-950 h-full" style={{ flexBasis: `${leftPanelWidth}%`, flexShrink: 0 }}>
            <div className="flex items-center justify-between px-4 bg-slate-900 border-b border-slate-800 shrink-0" style={{ height: `${32 * uiScale}px` }}>
              <div className="flex items-center gap-2">
                <Code className="text-slate-400" size={12 * uiScale} />
                <h2 className="font-bold text-slate-300 tracking-wider uppercase" style={{ fontSize: `${10 * uiScale}px` }}>Source Code</h2>
                <button 
                  onClick={handlePasteToSource} 
                  className="ml-2 text-slate-400 hover:text-amber-500 hover:bg-slate-800 p-1 rounded transition-colors"
                  title="Wklej i nadpisz cały kod"
                >
                  <ClipboardPaste size={14 * uiScale} />
                </button>
              </div>
              
              <div 
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded font-mono font-medium transition-colors ${isOverLimit ? 'bg-red-500/20 text-red-500' : 'bg-slate-800/50 text-slate-400'}`}
                style={{ fontSize: `${9 * uiScale}px` }}
              >
                {isOverLimit && <AlertCircle size={10 * uiScale} />}
                <span>{charCount} / 2000</span>
              </div>
            </div>
            
            <div className="flex-1 p-4 flex flex-col min-h-0">
              <textarea 
                id="sourceCodeTextarea"
                className="flex-1 w-full h-full bg-transparent text-slate-300 font-mono text-sm leading-relaxed focus:outline-none resize-none" 
                style={{ whiteSpace: wordWrap ? 'pre-wrap' : 'pre' }} 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                spellCheck="false" 
              />
            </div>
          </section>

          <div 
            onMouseDown={(e) => { e.preventDefault(); setIsDraggingDivider(true); }} 
            onTouchStart={(e) => { e.preventDefault(); setIsDraggingDivider(true); }} 
            className="flex-shrink-0 cursor-col-resize transition-colors z-30 relative flex justify-center"
            style={{ width: '6px', backgroundColor: isDraggingDivider ? '#f59e0b' : '#1e293b', touchAction: 'none' }}
          >
            <div 
              className="absolute top-0 flex items-center justify-center transition-colors shadow-lg border-x border-b border-slate-950"
              style={{
                height: `${32 * uiScale}px`,
                width: `${24 * uiScale}px`,
                backgroundColor: isDraggingDivider ? '#f59e0b' : '#334155',
                borderBottomLeftRadius: `${6 * uiScale}px`,
                borderBottomRightRadius: `${6 * uiScale}px`,
              }}
            >
              <div className="flex gap-[3px]">
                <div className={`rounded-full ${isDraggingDivider ? 'bg-slate-900' : 'bg-slate-400'}`} style={{ width: `${2 * uiScale}px`, height: `${12 * uiScale}px` }}></div>
                <div className={`rounded-full ${isDraggingDivider ? 'bg-slate-900' : 'bg-slate-400'}`} style={{ width: `${2 * uiScale}px`, height: `${12 * uiScale}px` }}></div>
              </div>
            </div>
          </div>

          <section className="flex flex-col bg-slate-800 h-full overflow-hidden" style={{ flexBasis: `calc(${100 - leftPanelWidth}% - 6px)`, flexShrink: 0 }}>
            <div className="flex items-center px-4 bg-slate-900 border-b border-slate-800 shadow-sm z-10 shrink-0 overflow-hidden" style={{ height: `${32 * uiScale}px` }}>
              <div className="flex items-center shrink-0" style={{ gap: `${8 * uiScale}px` }}>
                
                <button 
                  onMouseDown={(e) => executeFormat(e, 'undo')} 
                  className="text-slate-300 hover:bg-slate-700 rounded transition-colors active:scale-90" 
                  style={{ padding: `${4 * uiScale}px` }}
                  title="Cofnij (Undo)"
                >
                  <Undo2 size={15 * uiScale} />
                </button>
                <button 
                  onMouseDown={(e) => executeFormat(e, 'redo')} 
                  className="text-slate-300 hover:bg-slate-700 rounded transition-colors active:scale-90" 
                  style={{ padding: `${4 * uiScale}px` }}
                  title="Ponów (Redo)"
                >
                  <Redo2 size={15 * uiScale} />
                </button>

                <div className="bg-slate-700" style={{ width: '1px', height: `${18 * uiScale}px`, margin: `0 ${4 * uiScale}px` }}></div>

                <button 
                  onMouseDown={(e) => executeFormat(e, 'foreColor', activeColor)} 
                  className="flex items-center bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors font-bold border border-slate-600 shadow-sm active:scale-95" 
                  style={{ padding: `${4 * uiScale}px ${12 * uiScale}px`, fontSize: `${11 * uiScale}px`, gap: `${6 * uiScale}px` }}
                >
                  <Palette size={13 * uiScale} style={{color: activeColor}} />Paint it!
                </button>
                
                <div 
                  className="flex items-center bg-slate-800 border border-slate-600 rounded outline-none relative"
                  style={{ padding: `0 ${8 * uiScale}px`, width: `${110 * uiScale}px` }}
                >
                  <div className="rounded-full border border-slate-600 shrink-0" style={{ width: `${10 * uiScale}px`, height: `${10 * uiScale}px`, backgroundColor: activeColor, marginRight: `${6 * uiScale}px` }}></div>
                  <select 
                    value={activeColor}
                    onChange={(e) => setActiveColor(e.target.value)}
                    className="bg-transparent text-slate-200 outline-none w-full appearance-none cursor-pointer z-10 relative"
                    style={{ fontSize: `${11 * uiScale}px`, padding: `${6 * uiScale}px 0` }}
                  >
                    {colorOptions.map((color) => (
                      <option key={color.value} value={color.value} style={{backgroundColor: '#1e293b', color: 'white'}}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={11 * uiScale} className="text-slate-400 absolute right-[8px] top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                
                <div className="bg-slate-700" style={{ width: '1px', height: `${18 * uiScale}px`, margin: `0 ${4 * uiScale}px` }}></div>
                
                <button 
                  onMouseDown={(e) => executeFormat(e, 'bold')} 
                  className="text-slate-300 hover:bg-slate-700 rounded transition-colors active:scale-90" 
                  style={{ padding: `${4 * uiScale}px` }}
                >
                  <Bold size={15 * uiScale} />
                </button>
                <button 
                  onMouseDown={(e) => executeFormat(e, 'italic')} 
                  className="text-slate-300 hover:bg-slate-700 rounded transition-colors active:scale-90" 
                  style={{ padding: `${4 * uiScale}px` }}
                >
                  <Italic size={15 * uiScale} />
                </button>

                <div className="bg-slate-700" style={{ width: '1px', height: `${18 * uiScale}px`, margin: `0 ${4 * uiScale}px` }}></div>
                
                <button 
                  onMouseDown={(e) => applySizeFormat(e)} 
                  className="flex items-center bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors font-bold border border-slate-600 shadow-sm active:scale-95" 
                  style={{ padding: `${4 * uiScale}px ${12 * uiScale}px`, fontSize: `${11 * uiScale}px`, gap: `${6 * uiScale}px` }}
                  title="Nałóż wskazany rozmiar na tekst"
                >
                  <Type size={13 * uiScale} />Size it!
                </button>
                <div className="flex items-center bg-slate-800 border border-slate-600 rounded outline-none overflow-hidden">
                  <input 
                    type="number" 
                    value={activeSize}
                    onChange={(e) => setActiveSize(Number(e.target.value))}
                    className="bg-transparent text-slate-200 text-center font-mono font-bold outline-none"
                    style={{ width: `${40 * uiScale}px`, fontSize: `${11 * uiScale}px`, padding: `${5 * uiScale}px 0` }}
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[8px] transition-all"></div>

              <button onClick={() => setShowAdjust(!showAdjust)} className={`flex items-center rounded border transition-colors shrink-0 ${showAdjust ? 'bg-amber-500 text-slate-900 border-amber-600 font-bold shadow-md' : 'bg-slate-800 text-slate-300 border-slate-700'}`} style={{ padding: `${4 * uiScale}px ${10 * uiScale}px`, fontSize: `${11 * uiScale}px`, gap: `${6 * uiScale}px` }}><Settings2 size={13 * uiScale} />Adjust</button>
            </div>

            {showAdjust && (
              <div className="flex flex-wrap items-center gap-6 px-4 py-3 bg-slate-900 border-b border-slate-800 shadow-inner z-20 shrink-0">
                <button onClick={resetToDefaults} className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-amber-500 rounded border border-slate-700 transition-all active:scale-95 shadow-sm"><RotateCcw size={14} /><span className="text-xs font-bold uppercase tracking-wider">Default</span></button>
                <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
                   <span className="text-xs text-slate-400 font-semibold uppercase tracking-tight">Width:</span>
                   <input type="range" min="300" max="1200" value={previewWidth} onChange={(e) => setPreviewWidth(Number(e.target.value))} className="w-20 accent-amber-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                   <input type="number" value={previewWidth} onChange={(e) => setPreviewWidth(Number(e.target.value))} className="w-14 px-1 py-0.5 text-xs bg-black border border-slate-700 rounded text-amber-500 font-mono outline-none" />
                </div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-400 font-semibold uppercase tracking-tight">SDF:</span><input type="range" min="0" max="2" step="0.1" value={textStroke} onChange={(e) => setTextStroke(Number(e.target.value))} className="w-16 accent-amber-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" /><span className="text-xs text-slate-200 w-6 font-mono">{textStroke.toFixed(1)}</span>
                  <select value={sdfMode} onChange={(e) => setSdfMode(e.target.value)} className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-1 py-0.5 outline-none focus:border-amber-500 cursor-pointer"><option value="shadow">Outer</option><option value="stroke">Inner</option></select>
                </div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-400 font-semibold uppercase tracking-tight">Scale:</span><input type="range" min="0.6" max="1.1" step="0.01" value={sizeMultiplier} onChange={(e) => setSizeMultiplier(Number(e.target.value))} className="w-16 accent-amber-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" /><span className="text-xs text-slate-200 w-8 font-mono">{sizeMultiplier.toFixed(2)}</span></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-400 font-semibold uppercase tracking-tight">UI Scale:</span><input type="range" min="1" max="3" step="0.1" value={uiScale} onChange={(e) => setUiScale(Number(e.target.value))} className="w-16 accent-amber-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer" /><span className="text-xs text-slate-200 w-8 font-mono">{uiScale.toFixed(1)}x</span></div>
                <div className="flex items-center gap-2"><span className="text-xs text-slate-400 font-semibold uppercase tracking-tight">Wrap:</span><button onClick={() => setWordWrap(!wordWrap)} className={`p-1 rounded border transition-colors ${wordWrap ? 'bg-amber-500/20 border-amber-500/50 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}><AlignLeft size={14} /></button></div>
                <div className="flex items-center gap-2 ml-auto"><span className="text-xs text-slate-400 font-semibold uppercase tracking-tight">Sharp:</span><select value={fontSmoothing} onChange={(e) => setFontSmoothing(e.target.value)} className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded px-2 py-0.5 outline-none focus:border-amber-500"><option value="auto">ClearType</option><option value="antialiased">Smooth</option></select></div>
              </div>
            )}
            
            <div className="flex-1 p-8 bg-[#1e293b] relative min-h-0 overflow-auto flex justify-center">
              <div className="bg-[#fdfcf8] shadow-2xl relative transition-all duration-300 focus-within:ring-4 focus-within:ring-amber-500/20 shrink-0" style={{ width: `${previewWidth}px`, height: 'max-content', minHeight: '100%', padding: '40px 55px', color: '#222222', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '20px', lineHeight: '1.5', WebkitFontSmoothing: fontSmoothing, MozOsxFontSmoothing: fontSmoothing === 'antialiased' ? 'grayscale' : 'auto', textRendering: 'optimizeLegibility', letterSpacing: `${letterSpacing}px`, fontWeight: fontWeight, WebkitTextStroke: sdfMode === 'stroke' ? `${textStroke}px currentcolor` : '0px', textShadow: sdfMode === 'shadow' && textStroke > 0 ? `${textStroke * 0.4}px ${textStroke * 0.4}px 0px currentcolor, -${textStroke * 0.4}px -${textStroke * 0.4}px 0px currentcolor, ${textStroke * 0.4}px -${textStroke * 0.4}px 0px currentcolor, -${textStroke * 0.4}px ${textStroke * 0.4}px 0px currentcolor` : 'none' }}>
                <div ref={previewRef} className="break-words outline-none cursor-text game-preview-editor h-full" contentEditable={true} suppressContentEditableWarning={true} onInput={handlePreviewInput} onBlur={handlePreviewBlur} />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App;