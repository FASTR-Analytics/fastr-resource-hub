import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Library, Plus, PenLine, Bookmark, Shapes, Upload, ChevronRight } from 'lucide-react'
import { ContentLibrary } from '../../components/ContentLibrary'
import { CustomSlideEditor } from '../../components/CustomSlideEditor'
import DiagramBuilder from '../../components/DiagramBuilder'
import { useWorkshopStore } from '../../stores/workshop'
import { t } from '../../i18n/translations'
import { useToast } from '../../components/Toast'

interface AddContentDrawerProps {
  open: boolean
  onClose: () => void
  onImportSlides: () => void
  /** Which day this drawer is currently scoped to (for the "Add to day" affordance). */
  targetDayNum?: number
}

type DrawerTab = 'content' | 'create'

export function AddContentDrawer({ open, onClose, onImportSlides, targetDayNum }: AddContentDrawerProps) {
  const { contentLanguage, currentWorkshopId, addSession } = useWorkshopStore()
  const { showToast } = useToast()
  const [tab, setTab] = useState<DrawerTab>('content')
  const [slideCreatorType, setSlideCreatorType] = useState<'content' | 'section' | null>(null)
  const [showDiagramBuilder, setShowDiagramBuilder] = useState(false)
  const dayNum = targetDayNum ?? 1

  // When a diagram is saved, also insert it as a slide on the current day.
  // The diagram becomes a *content* slide (H1 title + inline diagram image),
  // not a locked full-bleed background slide — the user can still edit the
  // slide markdown later.
  const handleDiagramSaved = async (paths: string[], userTitle?: string) => {
    if (!currentWorkshopId || paths.length === 0) return
    const svgPath = paths[0] // first language path
    // The user-entered slide title is the canonical display label. Only fall
    // back to derived-from-filename if it's missing (shouldn't happen with the
    // current DiagramBuilder which requires the title before save).
    const diagramTitle = userTitle?.trim() ||
      (svgPath.split('/').pop()?.replace(/\.svg$/, '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'Diagram')

    // Content slide: H1 + the diagram as a sized inline image (not full-bleed).
    // Path matches the existing template convention (`../../resources/...`) so
    // Marp resolves it the same way at preview AND export time. The leading `/`
    // form works for the web server but breaks the Marp CLI build.
    const relPath = svgPath.startsWith('resources/') ? `../../${svgPath}` : svgPath
    const slideContent = `---
marp: true
theme: fastr
paginate: true
---

# ${diagramTitle}

![h:500](${relPath})
`
    const slideFilename = `diagram_${Date.now()}.md`
    try {
      const res = await fetch(`/api/workshops/${currentWorkshopId}/custom-slides`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: slideFilename, content: slideContent }),
      })
      if (!res.ok) throw new Error('Failed to save slide')
      addSession(dayNum, {
        session: diagramTitle,
        // No `type` — keeps the session editable (not locked).
        slides: [`custom_slides/${slideFilename}`],
        duration: 5,
      })
      // Save status pill flickers; surface success in the toast text too.
      showToast(
        contentLanguage === 'fr'
          ? `Diagramme ajouté au jour ${dayNum}`
          : `Diagram added to day ${dayNum}`,
        'success',
      )
      setShowDiagramBuilder(false)
    } catch (err: any) {
      showToast(err.message || 'Failed to insert diagram', 'error')
    }
  }

  if (!open) return null

  const drawer = (
    <>
      {/* Non-modal side panel — day columns stay visible & interactive on the left.
          Drag-and-drop from the drawer's ContentLibrary onto day columns works because
          the parent DndContext picks up pointer events through the panel boundary. */}
      <div
        className="fixed top-14 right-0 bottom-0 z-[80] w-[400px] max-w-[90vw] bg-white border-l border-slate-200 shadow-lg flex flex-col"
        role="region"
        aria-label={t('addContent', contentLanguage)}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 min-w-0">
            <Plus className="w-4 h-4 text-slate-400" aria-hidden />
            <h2 className="text-body font-semibold text-slate-900 m-0 truncate">
              {t('addContent', contentLanguage)}
              {targetDayNum && (
                <span className="text-caption text-slate-500 ml-2 font-normal">
                  · {t('day', contentLanguage)} {targetDayNum}
                </span>
              )}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1.5 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors focus-ring"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0.5 px-3 pt-2 border-b border-slate-200">
          <TabButton active={tab === 'content'} onClick={() => setTab('content')} icon={Library}>
            {t('addFromLibrary', contentLanguage)}
          </TabButton>
          <TabButton active={tab === 'create'} onClick={() => setTab('create')} icon={PenLine}>
            {t('createNew', contentLanguage)}
          </TabButton>
        </div>

        {/* Pane */}
        <div className="flex-1 overflow-hidden min-h-0">
          {tab === 'content' && (
            <ContentLibrary onImportSlides={onImportSlides} />
          )}
          {tab === 'create' && (
            <div className="p-5 overflow-y-auto h-full">
              {targetDayNum && (
                <p className="text-caption text-slate-500 mb-3">
                  {contentLanguage === 'fr'
                    ? `Nouveau contenu sera ajouté au jour ${targetDayNum} de cet atelier.`
                    : `New content will be added to day ${targetDayNum} of this workshop.`}
                </p>
              )}

              {/* SECTION: Create new slide — text / section / diagram are all slide layouts */}
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {t('createSlideHeading', contentLanguage)}
              </h3>
              <div className="space-y-2 mb-6">
                <CreateActionRow
                  icon={PenLine}
                  title={t('layoutTextSlide', contentLanguage)}
                  description={t('layoutTextSlideDesc', contentLanguage)}
                  onClick={() => setSlideCreatorType('content')}
                />
                <CreateActionRow
                  icon={Bookmark}
                  title={t('layoutSectionDivider', contentLanguage)}
                  description={t('layoutSectionDividerDesc', contentLanguage)}
                  onClick={() => setSlideCreatorType('section')}
                />
                <CreateActionRow
                  icon={Shapes}
                  title={t('layoutDiagram', contentLanguage)}
                  description={t('layoutDiagramDesc', contentLanguage)}
                  onClick={() => setShowDiagramBuilder(true)}
                />
              </div>

              {/* SECTION: Import — different concern (bringing in existing slides) */}
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                {t('importHeading', contentLanguage)}
              </h3>
              <CreateActionRow
                icon={Upload}
                title={t('importSlides', contentLanguage)}
                description={t('importSlidesDesc', contentLanguage)}
                onClick={() => {
                  onClose()
                  onImportSlides()
                }}
              />
            </div>
          )}
        </div>
      </div>

      {slideCreatorType && currentWorkshopId && (
        <CustomSlideEditor
          workshopId={currentWorkshopId}
          dayNumber={dayNum}
          defaultType={slideCreatorType}
          onClose={() => setSlideCreatorType(null)}
          onSave={(filename, _content, sessionName) => {
            addSession(dayNum, {
              session: sessionName,
              // Only the "Section divider" layout intentionally locks the
              // session as a compulsory header. A regular text slide stays
              // editable so the user can rename, reorder, or delete it.
              ...(slideCreatorType === 'section' ? { type: 'section' as const } : {}),
              slides: [`custom_slides/${filename}`],
              duration: 10,
            })
            setSlideCreatorType(null)
          }}
        />
      )}
      <DiagramBuilder
        isOpen={showDiagramBuilder}
        onClose={() => setShowDiagramBuilder(false)}
        language={contentLanguage}
        onSaved={handleDiagramSaved}
      />
    </>
  )

  return createPortal(drawer, document.body)
}

interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: typeof Library
  children: React.ReactNode
}

function TabButton({ active, onClick, icon: Icon, children }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 px-3 py-2 text-body-sm font-semibold border-b-2 -mb-px transition-colors focus-ring ${
        active
          ? 'border-fastr-secondary text-fastr-primary'
          : 'border-transparent text-slate-500 hover:text-slate-900'
      }`}
    >
      <Icon className="w-4 h-4" aria-hidden />
      {children}
    </button>
  )
}

interface CreateActionRowProps {
  icon: typeof PenLine
  title: string
  description: string
  onClick: () => void
}

function CreateActionRow({ icon: Icon, title, description, onClick }: CreateActionRowProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 p-4 rounded-2xl bg-white border border-slate-200 ring-1 ring-black/5 shadow-sm hover:shadow-md hover:border-fastr-secondary/40 transition-all text-left focus-ring"
    >
      <div className="w-10 h-10 rounded-xl bg-fastr-light flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-fastr-primary" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-body font-semibold text-slate-900">{title}</div>
        <p className="text-body-sm text-slate-500 mt-0.5">{description}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-300 mt-2 flex-shrink-0" aria-hidden />
    </button>
  )
}
