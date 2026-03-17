import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react'
import { driver, type DriveStep, type Driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { t, type Language } from '../i18n/translations'

export interface GuidedTourHandle {
  startTour: () => void
}

interface PanelControls {
  setLeftPanelOpen: (open: boolean) => void
  setRightPanelOpen: (open: boolean) => void
}

interface GuidedTourProps {
  tour: 'landing' | 'builder'
  language: Language
  workshopCount?: number
  panelControls?: PanelControls
}

const TOUR_SEEN_KEY = (tour: string) => `fastr-tour-${tour}-seen`

// Custom FASTR theme styles injected once
const FASTR_THEME_ID = 'fastr-driver-theme'

function injectTheme() {
  if (document.getElementById(FASTR_THEME_ID)) return
  const style = document.createElement('style')
  style.id = FASTR_THEME_ID
  style.textContent = `
    .driver-popover {
      background-color: #fff;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      max-width: 340px;
    }
    .driver-popover .driver-popover-title {
      font-size: 16px;
      font-weight: 600;
      color: #09544F;
    }
    .driver-popover .driver-popover-description {
      font-size: 14px;
      color: #4B5563;
      line-height: 1.5;
    }
    .driver-popover .driver-popover-progress-text {
      font-size: 12px;
      color: #9CA3AF;
    }
    .driver-popover-prev-btn {
      background-color: #E8F4F3;
      color: #09544F;
      border: none;
      border-radius: 8px;
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 500;
    }
    .driver-popover-prev-btn:hover {
      background-color: #CAE6E9;
    }
    .driver-popover-next-btn,
    .driver-popover-close-btn-text {
      background-color: #09544F;
      color: #fff;
      border: none;
      border-radius: 8px;
      padding: 6px 16px;
      font-size: 13px;
      font-weight: 500;
    }
    .driver-popover-next-btn:hover,
    .driver-popover-close-btn-text:hover {
      background-color: #0C716B;
    }
  `
  document.head.appendChild(style)
}

function buildLandingSteps(language: Language, workshopCount: number): DriveStep[] {
  const steps: DriveStep[] = [
    {
      element: '[data-tour="landing-cards"]',
      popover: {
        title: t('tourLandingCardsTitle', language),
        description: t('tourLandingCardsDesc', language),
        side: 'bottom',
        align: 'center',
      },
    },
  ]

  if (workshopCount > 0) {
    steps.push({
      element: '[data-tour="existing-decks"]',
      popover: {
        title: t('tourExistingDecksTitle', language),
        description: t('tourExistingDecksDesc', language),
        side: 'top',
        align: 'center',
      },
    })
  }

  steps.push({
    element: '[data-tour="language-toggle"]',
    popover: {
      title: t('tourLanguageToggleTitle', language),
      description: t('tourLanguageToggleDesc', language),
      side: 'bottom',
      align: 'end',
    },
  })

  return steps
}

function buildBuilderSteps(language: Language, panelControls?: PanelControls): DriveStep[] {
  return [
    {
      element: '[data-tour="schedule-area"]',
      popover: {
        title: t('tourScheduleTitle', language),
        description: t('tourScheduleDesc', language),
        side: 'bottom',
        align: 'center',
      },
    },
    {
      element: '[data-tour="add-session-btn"]',
      popover: {
        title: t('tourAddSessionTitle', language),
        description: t('tourAddSessionDesc', language),
        side: 'top',
        align: 'center',
      },
    },
    {
      element: '[data-tour="toolbar-slides"]',
      popover: {
        title: t('tourSlidesTitle', language),
        description: t('tourSlidesDesc', language),
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: () => {
        panelControls?.setRightPanelOpen(false)
        panelControls?.setLeftPanelOpen(true)
      },
    },
    {
      element: '[data-tour="toolbar-ai"]',
      popover: {
        title: t('tourAiTitle', language),
        description: t('tourAiDesc', language),
        side: 'bottom',
        align: 'start',
      },
      onHighlightStarted: () => {
        panelControls?.setLeftPanelOpen(false)
        panelControls?.setRightPanelOpen(true)
      },
    },
    {
      element: '[data-tour="toolbar-export"]',
      popover: {
        title: t('tourExportTitle', language),
        description: t('tourExportDesc', language),
        side: 'bottom',
        align: 'end',
      },
      onHighlightStarted: () => {
        panelControls?.setRightPanelOpen(false)
      },
    },
  ]
}

export const GuidedTour = forwardRef<GuidedTourHandle, GuidedTourProps>(
  ({ tour, language, workshopCount = 0, panelControls }, ref) => {
    const driverRef = useRef<Driver | null>(null)

    useImperativeHandle(ref, () => ({
      startTour: () => {
        runTour()
      },
    }))

    function runTour() {
      // Destroy any existing tour
      driverRef.current?.destroy()

      injectTheme()

      const steps =
        tour === 'landing'
          ? buildLandingSteps(language, workshopCount)
          : buildBuilderSteps(language, panelControls)

      const driverInstance = driver({
        showProgress: true,
        animate: true,
        allowClose: true,
        overlayOpacity: 0.4,
        stagePadding: 8,
        stageRadius: 12,
        steps,
        onDestroyed: () => {
          localStorage.setItem(TOUR_SEEN_KEY(tour), 'true')
          // Close any panels that the tour may have opened
          if (tour === 'builder') {
            panelControls?.setLeftPanelOpen(false)
            panelControls?.setRightPanelOpen(false)
          }
        },
      })

      driverRef.current = driverInstance
      driverInstance.drive()
    }

    // Auto-launch on first visit
    useEffect(() => {
      const seen = localStorage.getItem(TOUR_SEEN_KEY(tour))
      if (seen) return

      // For builder tour, only auto-start if there's content to show
      if (tour === 'builder') {
        const el = document.querySelector('[data-tour="schedule-area"]')
        if (!el) return
      }

      const timer = setTimeout(() => runTour(), 600)
      return () => clearTimeout(timer)
    }, [tour])  // eslint-disable-line react-hooks/exhaustive-deps

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        driverRef.current?.destroy()
      }
    }, [])

    return null
  }
)

GuidedTour.displayName = 'GuidedTour'
