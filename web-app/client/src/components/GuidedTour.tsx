import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react'
import { driver, type DriveStep, type Driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { t, type Language } from '../i18n/translations'

export interface GuidedTourHandle {
  startTour: () => void
}

interface PanelControls {
  setRightPanelOpen: (open: boolean) => void
}

type TourId = 'landing' | 'builder' | 'library' | 'settings'

interface GuidedTourProps {
  tour: TourId
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
      background-color: var(--bg-1);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      max-width: 340px;
    }
    .driver-popover .driver-popover-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--fastr-web-primary);
    }
    .driver-popover .driver-popover-description {
      font-size: var(--w-body-sm);
      color: #475569; /* slate-600 */
      line-height: var(--lh-cozy);
    }
    .driver-popover .driver-popover-progress-text {
      font-size: var(--w-caption);
      color: #94A3B8; /* slate-400 */
    }
    .driver-popover-prev-btn {
      background-color: var(--fastr-web-light);
      color: var(--fastr-web-primary);
      border: none;
      border-radius: var(--radius-md);
      padding: 6px 16px;
      font-size: var(--w-body-sm);
      font-weight: 500;
    }
    .driver-popover-prev-btn:hover {
      background-color: #D6E8F2; /* slightly darker fastr-web-light */
    }
    .driver-popover-next-btn,
    .driver-popover-close-btn-text {
      background-color: var(--fastr-web-primary);
      color: #fff;
      border: none;
      border-radius: var(--radius-md);
      padding: 6px 16px;
      font-size: var(--w-body-sm);
      font-weight: 500;
    }
    .driver-popover-next-btn:hover,
    .driver-popover-close-btn-text:hover {
      background-color: var(--fastr-web-primary-dark);
    }
  `
  document.head.appendChild(style)
}

function buildLandingSteps(language: Language, workshopCount: number): DriveStep[] {
  const steps: DriveStep[] = [
    {
      element: '[data-tour="nav-workshops"]',
      popover: {
        title: t('tourNavWorkshopsTitle', language),
        description: t('tourNavWorkshopsDesc', language),
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '[data-tour="nav-library"]',
      popover: {
        title: t('tourNavLibraryTitle', language),
        description: t('tourNavLibraryDesc', language),
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '[data-tour="new-workshop"]',
      popover: {
        title: t('tourLandingCardsTitle', language),
        description: t('tourLandingCardsDesc', language),
        side: 'bottom',
        align: 'end',
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

  steps.push(
    {
      element: '[data-tour="nav-settings"]',
      popover: {
        title: t('tourNavSettingsTitle', language),
        description: t('tourNavSettingsDesc', language),
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '[data-tour="language-toggle"]',
      popover: {
        title: t('tourLanguageToggleTitle', language),
        description: t('tourLanguageToggleDesc', language),
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '[data-tour="sign-out"]',
      popover: {
        title: t('tourSignOutTitle', language),
        description: t('tourSignOutDesc', language),
        side: 'top',
        align: 'end',
      },
    },
    {
      element: '[data-tour="help-button"]',
      popover: {
        title: t('tourHelpButtonTitle', language),
        description: t('tourHelpButtonDesc', language),
        side: 'left',
        align: 'end',
      },
    },
  )

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
      element: '[data-tour="add-content-btn"]',
      popover: {
        title: t('tourAddSessionTitle', language),
        description: t('tourAddSessionDesc', language),
        side: 'top',
        align: 'center',
      },
      onHighlightStarted: () => {
        panelControls?.setRightPanelOpen(false)
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

function buildLibrarySteps(language: Language): DriveStep[] {
  return [
    {
      element: '[data-tour="nav-library"]',
      popover: {
        title: t('tourNavLibraryTitle', language),
        description: t('tourNavLibraryDesc', language),
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '[data-tour="library-views"]',
      popover: {
        title: t('helpLibBrowseTitle', language),
        description: t('helpLibBrowseDesc', language),
        side: 'bottom',
        align: 'end',
      },
    },
    {
      element: '[data-tour="help-button"]',
      popover: {
        title: t('tourHelpButtonTitle', language),
        description: t('tourHelpButtonDesc', language),
        side: 'left',
        align: 'end',
      },
    },
  ]
}

function buildSettingsSteps(language: Language): DriveStep[] {
  return [
    {
      element: '[data-tour="nav-settings"]',
      popover: {
        title: t('tourNavSettingsTitle', language),
        description: t('tourNavSettingsDesc', language),
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '[data-tour="settings-subnav"]',
      popover: {
        title: t('settingsAbout', language),
        description: t('settingsAboutDesc', language),
        side: 'right',
        align: 'start',
      },
    },
    {
      element: '[data-tour="help-button"]',
      popover: {
        title: t('tourHelpButtonTitle', language),
        description: t('tourHelpButtonDesc', language),
        side: 'left',
        align: 'end',
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
          : tour === 'builder'
            ? buildBuilderSteps(language, panelControls)
            : tour === 'library'
              ? buildLibrarySteps(language)
              : buildSettingsSteps(language)

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
            panelControls?.setRightPanelOpen(false)
          }
        },
      })

      driverRef.current = driverInstance
      driverInstance.drive()
    }

    // Auto-launch on first visit (only the two primary tours; library/settings
    // tours are launched manually from the help panel)
    useEffect(() => {
      if (tour !== 'landing' && tour !== 'builder') return
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
