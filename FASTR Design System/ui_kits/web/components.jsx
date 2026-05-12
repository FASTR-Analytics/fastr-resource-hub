/* FASTR Deck Builder — UI kit components */

const { useState } = React;

// ---------- Sidebar ----------
function Sidebar({ active, setActive }) {
  const items = [
    ["Workshops", "calendar"],
    ["Content library", "library"],
    ["Templates", "layout-template"],
    ["Assets", "image"],
    ["Settings", "settings"],
  ];
  return (
    <aside className="w-60 shrink-0 bg-white border-r border-slate-200 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-200 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#1B365D] flex items-center justify-center text-white font-bold text-sm tracking-tight">F</div>
        <div className="leading-tight">
          <div className="font-bold text-[#1B365D] text-sm">FASTR</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500">Deck Builder</div>
        </div>
      </div>
      <nav className="p-3 flex flex-col gap-0.5">
        {items.map(([label, icon]) => (
          <button key={label} onClick={() => setActive(label)}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-left transition
              ${active === label ? "bg-[#E8F4F8] text-[#1B365D]" : "text-slate-600 hover:bg-slate-50 hover:text-[#1B365D]"}`}>
            <img src={`https://unpkg.com/lucide-static@0.460.0/icons/${icon}.svg`} className="w-4 h-4" alt="" style={{filter: active===label ? "invert(15%) sepia(40%) saturate(900%) hue-rotate(180deg)" : "invert(40%) sepia(8%) saturate(450%) hue-rotate(180deg)"}}/>
            <span>{label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto p-4 border-t border-slate-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#F7941D] flex items-center justify-center text-white text-xs font-semibold">AN</div>
        <div className="leading-tight">
          <div className="text-xs font-semibold text-slate-800">A. Niang</div>
          <div className="text-[11px] text-slate-500">Senegal MoH</div>
        </div>
      </div>
    </aside>
  );
}

// ---------- Top bar ----------
function TopBar({ section, breadcrumb }) {
  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-baseline gap-2">
        <h1 className="text-base font-semibold text-[#1B365D]">{section}</h1>
        {breadcrumb && <span className="text-xs text-slate-400">/ {breadcrumb}</span>}
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <img src="https://unpkg.com/lucide-static@0.460.0/icons/search.svg" className="w-4 h-4 absolute left-2.5 top-2 text-slate-400"/>
          <input className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-sm w-64 focus:outline-none focus:border-[#00A9CE] focus:ring-2 focus:ring-[#00A9CE]/20" placeholder="Search modules, slides…"/>
        </div>
        <button className="bg-[#1B365D] text-white text-sm font-semibold px-3 py-1.5 rounded-lg hover:bg-[#122544]">+ New workshop</button>
      </div>
    </header>
  );
}

// ---------- Module card ----------
function ModuleCard({ id, title, desc, slides, mins, accent, progress }) {
  const tones = {
    teal:  ["bg-[#E8F4F8]", "text-[#1B365D]"],
    cyan:  ["bg-[#00A9CE]/15", "text-[#066B82]"],
    gold:  ["bg-[#F7941D]/15", "text-[#A6630F]"],
    plum:  ["bg-[#7A1F6E]/10", "text-[#7A1F6E]"],
  };
  const [bg, fg] = tones[accent] || tones.teal;
  return (
    <div className="bg-white border border-slate-200 ring-1 ring-black/[.03] rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-2 cursor-pointer">
      <div className="flex items-start justify-between">
        <span className={`text-[10px] font-semibold uppercase tracking-wider rounded-full px-2 py-0.5 ${bg} ${fg}`}>Module {id}</span>
        <button className="text-slate-400 hover:text-slate-600">
          <img src="https://unpkg.com/lucide-static@0.460.0/icons/more-horizontal.svg" className="w-4 h-4"/>
        </button>
      </div>
      <h3 className="text-base font-semibold text-slate-900 leading-snug">{title}</h3>
      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{desc}</p>
      <div className="text-xs text-slate-500 flex gap-2 items-center mt-1">
        <span>{slides} slides</span><span className="text-slate-300">·</span><span>{mins} min</span>
      </div>
      <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-[#00A9CE]/60" style={{width: progress + "%"}}/>
      </div>
    </div>
  );
}

// ---------- Slide thumbnail rail ----------
function SlideRail({ slides, active, setActive }) {
  return (
    <div className="bg-slate-50 border-r border-slate-200 w-44 overflow-y-auto py-3 px-3 flex flex-col gap-2">
      {slides.map((s, i) => (
        <button key={i} onClick={()=>setActive(i)}
          className={`text-left rounded-lg overflow-hidden border-2 transition ${active===i ? "border-[#00A9CE]" : "border-transparent hover:border-slate-300"}`}>
          <div className="aspect-[16/9] bg-white text-[6px] p-2 leading-tight relative" style={s.bg||{}}>
            <div className={s.titleCls||"text-[#09544F] font-bold"} style={{fontSize:"6.5px",lineHeight:"1.1"}}>{s.title}</div>
            {s.body && <div className="mt-1 text-slate-500" style={{fontSize:"5px",lineHeight:"1.2"}}>{s.body}</div>}
            <div className="absolute bottom-0.5 right-1 text-slate-300" style={{fontSize:"4.5px"}}>{i+1}</div>
          </div>
          <div className="px-1.5 py-1 text-[10px] text-slate-500 truncate">{s.label}</div>
        </button>
      ))}
    </div>
  );
}

// ---------- Deck preview ----------
function DeckPreview({ slide }) {
  return (
    <div className="flex-1 bg-slate-100 p-8 overflow-auto">
      <div className="max-w-[900px] mx-auto">
        <div className="bg-white rounded-xl shadow-md ring-1 ring-black/5 aspect-[16/9] relative overflow-hidden" style={slide.fullBg||{}}>
          <div className="absolute inset-0 p-10 flex flex-col" style={{color: slide.fg || "#2C3E50"}}>
            <div className="text-[10px] uppercase tracking-[0.18em]" style={{color: slide.eyebrowColor || "#7F8C8D"}}>{slide.eyebrow}</div>
            <h2 className="text-3xl font-bold mt-2 pb-2 border-b-4" style={{borderColor: slide.rule || "#D0CB17", color: slide.h1 || "#09544F"}}>{slide.title}</h2>
            {slide.lede && <p className="mt-5 text-lg leading-relaxed max-w-[720px]">{slide.lede}</p>}
            {slide.bullets && (
              <ul className="mt-6 space-y-3 text-base">
                {slide.bullets.map((b,i)=><li key={i} className="pl-5 relative"><span className="absolute left-0 top-2 w-2 h-2 rounded-full bg-[#D0CB17]"></span>{b}</li>)}
              </ul>
            )}
            <div className="mt-auto flex justify-between text-[11px] opacity-70">
              <span>FASTR · {slide.deck}</span><span>{slide.pageNum}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium">← Previous</button>
            <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium">Next →</button>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium">Speaker notes</button>
            <button className="px-3 py-1.5 rounded-lg bg-[#F7941D] text-white font-semibold hover:bg-[#D87E12]">Export PPTX</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------- Right inspector ----------
function Inspector({ slide }) {
  return (
    <aside className="w-72 shrink-0 bg-white border-l border-slate-200 p-5 overflow-y-auto">
      <h4 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">Slide properties</h4>
      <div className="space-y-3 text-sm">
        <Field label="Layout"><Select value={slide.layoutLabel || "Content"} options={["Title cover","Section divider","Content","Two panel","Output","Quote","Closing"]}/></Field>
        <Field label="Module"><Select value="Module 4 · Data quality" options={["Module 1","Module 4 · Data quality","Module 6"]}/></Field>
        <Field label="Variant">
          <div className="flex border border-slate-200 rounded-lg overflow-hidden text-xs">
            <button className="flex-1 py-1.5 bg-[#1B365D] text-white font-semibold">Full</button>
            <button className="flex-1 py-1.5 text-slate-600 hover:bg-slate-50">Condensed</button>
          </div>
        </Field>
        <Field label="Title"><input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#00A9CE]" defaultValue={slide.title}/></Field>
        <Field label="Eyebrow"><input className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#00A9CE]" defaultValue={slide.eyebrow}/></Field>
        <Field label="Accent rule">
          <div className="flex gap-1.5">
            {["#D0CB17","#1F9A9C","#BD5091","#F7941D"].map(c=>(
              <button key={c} className="w-6 h-6 rounded-full ring-2 ring-offset-2 ring-offset-white" style={{background:c, ringColor: c===slide.rule ? c : "transparent"}}/>
            ))}
          </div>
        </Field>
      </div>
      <hr className="my-5 border-slate-100"/>
      <h4 className="text-xs uppercase tracking-widest text-slate-500 font-semibold mb-3">Speaker notes</h4>
      <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm h-28 focus:outline-none focus:border-[#00A9CE]" defaultValue="Highlight the gap between expected and observed coverage — pause for the three-district question."/>
    </aside>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-500 mb-1">{label}</label>
      {children}
    </div>
  );
}

function Select({ value, options }) {
  return (
    <select defaultValue={value} className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-[#00A9CE]">
      {options.map(o => <option key={o}>{o}</option>)}
    </select>
  );
}

Object.assign(window, { Sidebar, TopBar, ModuleCard, SlideRail, DeckPreview, Inspector });
