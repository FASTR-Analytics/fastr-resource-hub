// UI Translations for FASTR Deck Builder

export type Language = 'en' | 'fr'

export const translations = {
  en: {
    // Landing page
    appTitle: 'FASTR Deck Builder',
    appSubtitle: 'Build and manage workshop presentations',
    signOut: 'Sign Out',

    // Mode cards
    buildSlideDeck: 'Build Slide Deck',
    buildSlideDeckDesc: 'Build a complete slide deck for a workshop or training event',
    quickExport: 'Quick Export',
    quickExportDesc: 'Select slides from the library and export to PPTX or PDF',
    browseLibrary: 'Browse Library',
    browseLibraryDesc: 'Explore and preview slides from the content library',

    // Existing decks
    existingDecks: 'Existing Decks',

    // Library mode
    browseContentLibrary: 'Browse Content Library',
    loadingContentLibrary: 'Loading content library...',
    slides: 'slides',
    full: 'Full',
    condensed: 'Condensed',

    // Quick export
    selectSlidesExport: 'Select slides and export to PPTX or PDF',
    selectedSlides: 'Selected Slides',
    noSlidesSelected: 'No slides selected',
    selectSlidesFromLibrary: 'Select slides from the library on the left',
    exportPDF: 'Export PDF',
    exportPPTX: 'Export PPTX',
    exporting: 'Exporting...',
    clickToPreview: 'Click on a slide to preview',
    selectContent: 'Select Content',
    checkToSelect: 'Check to select, click name to preview',

    // Content
    modules: 'Modules',
    topics: 'topics',
    breaksStructure: 'Breaks & Structure',
    breaks: 'Breaks',
    templates: 'Templates',

    // Template categories
    structure: 'Structure',
    structureDesc: 'Workshop structure slides',
    breaksCategory: 'Breaks',
    breaksDesc: 'Break slides',
    dayTransitions: 'Day Transitions',
    dayTransitionsDesc: 'Day recap and preview slides',
    activitiesDemos: 'Activities & Demos',
    activitiesDesc: 'Interactive session slides',

    // Add session menu
    addToDay: 'Add to Day',
    chooseModuleContent: 'Choose Module Content',
    createCustomSlide: 'Create Custom Slide',
    insertImage: 'Insert Image',
    addToSession: 'Add to Session',
    moduleContent: 'Module Content',
    addSlidesFromModules: 'Add slides from FASTR modules',
    teaBreak: 'Tea Break',
    lunchBreak: 'Lunch Break',
    customSlide: 'Custom Slide',
    createYourOwnSlide: 'Create your own slide with markdown',
    custom: 'Custom',
    orAddIndividualSlides: 'Or add individual slides:',
    fullSlides: 'Full Slides',
    condensedSlides: 'Condensed Slides',

    // Quick export selection panel
    yourSelection: 'Your Selection',
    clearAll: 'Clear all',
    selectTopicsFromLibrary: 'Select topics from the library to build your presentation',

    // Workshop selection
    selectWorkshop: 'Select Workshop',
    createNewWorkshop: 'Create New Workshop',

    // Workshop creation
    aiSetup: 'AI Setup',
    uploadOrPaste: 'Upload',
    manual: 'Manual',
    describeWorkshop: 'Describe your workshop and AI will set it up for you.',
    aiPlaceholder: 'Example: First FASTR workshop in Kenya, 3 days. Focus on data quality and coverage estimation. Use high-level introductory content (shorter versions where available). This is a refresher for teams who attended last year\'s training.',
    back: 'Back',
    generating: 'Generating...',
    generateWorkshop: 'Generate Workshop',
    uploadAgenda: 'Upload Agenda',
    uploadAgendaDesc: 'Upload a PDF, Word doc, or paste your agenda text',
    pasteAgendaHere: 'Or paste your agenda here...',
    dropFileHere: 'Drop your agenda file here',
    supportedFormats: 'PDF or Word (.docx)',
    parsing: 'Parsing agenda...',
    workshopName: 'Workshop Name',
    country: 'Country',
    city: 'City',
    startDate: 'Start Date',
    numberOfDays: 'Number of Days',
    create: 'Create',

    // Workshop empty state
    selectOrCreateWorkshop: 'Select or create a workshop to get started',
    chooseWorkshop: 'Choose Workshop',

    // Workshop Settings
    workshopSettings: 'Workshop Settings',
    coverSlide: 'Cover Slide',
    presentationTitle: 'Presentation Title',
    subtitle: 'Subtitle',
    workshopDetails: 'Workshop Details',
    endDate: 'End Date',
    location: 'Location / City',
    venue: 'Venue',
    facilitators: 'Facilitators',
    contactInformation: 'Contact Information',
    contactEmail: 'Contact Email',
    website: 'Website',
    slideContent: 'Slide Content',
    slideContentDesc: 'This content appears on the locked opening slides. Edit here to update what\'s shown.',
    workshopObjectives: 'Workshop Objectives',
    objectivesSlide: 'Objectives slide',
    expectedOutputs: 'Expected Outputs',
    expectedOutputsSlide: 'Expected Outputs slide',
    dailySchedule: 'Daily Schedule',
    dailyScheduleDesc: 'Set the theme and start time for each day. These appear in agenda slides and day headers.',
    day: 'Day',
    themeFocusArea: 'Theme / Focus Area',
    startsAt: 'Starts at',
    endsAt: 'Ends at',
    changesSavedAutomatically: 'Changes are saved automatically',
    done: 'Done',
    previewDeck: 'Preview Deck',
    export: 'Export',
    rebuild: 'Rebuild',
    newSlide: 'New Slide',

    // Content Library
    contentLibrary: 'Content Library',
    content: 'Content',
    assets: 'Assets',
    breaksAndStructure: 'Breaks & Structure',
    loadingContent: 'Loading content...',
    xTopics: 'topics',
    xSlides: 'slides',
    uploadingAssets: 'Uploading...',
    dragDropImages: 'Drag & drop images here',
    orClickToBrowse: 'or click to browse',
    noAssetsUploaded: 'No assets uploaded yet',
    selectWorkshopAssets: 'Select a workshop to manage assets',
    loadingPreview: 'Loading preview...',
    loadingSlides: 'Loading slides...',
    noSlidesAvailable: 'No slides available',
    previous: 'Previous',
    next: 'Next',
    slideXOfY: 'Slide',
    of: 'of',
    addSlide: 'Add Slide',
    createNewSession: 'Create New Session',
    addAsSeparateSession: 'Add as a separate session on Day 1',
    orAddToExisting: 'Or add to existing session',
    from: 'From',

    // Preview
    presenterNotes: 'Presenter Notes',

    // Common
    loading: 'Loading...',
    error: 'Error',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    close: 'Close',
    addEntireModule: 'Add Entire Module',
    topic: 'topic',
    topicPlural: 'topics',

    // Content Library page
    contentLibraryTitle: 'Content Library',
    contentLibrarySubtitle: 'Select modules to build your presentation',
    contentLibraryDesc: 'Browse, select, and export module content',
    detailed: 'Detailed',
    essentials: 'Essentials',
    detailedDesc: 'Full methodology and technical detail',
    essentialsDesc: 'Key concepts and interpretation',
    modulesSelected: 'modules selected',
    downloadPPTX: 'Download PPTX',
    downloadPDF: 'Download PDF',
    noModulesSelected: 'Select modules above to download',
    totalSlides: 'slides',

    // Quick Export sections
    methodologyContent: 'Methodology Content',
    methodologyContentDesc: 'Lecture-style modules for teaching FASTR concepts',
    activitiesExercises: 'Activities & Exercises',
    activitiesExercisesDesc: 'Hands-on activities, exercises, and interactive content',
    activity: 'Activity',
    topicCount: 'topics',

    // Quick Export templates section
    templatesStructure: 'Templates & Structure',
    templatesStructureDesc: 'Standard slides for structuring your presentation',
    templatesSelected: 'templates selected',

    // Deck Preview
    buildingPreview: 'Building preview...',
    failedToBuildPreview: 'Failed to build preview',
    tryAgain: 'Try Again',
    noPreviewAvailable: 'No preview available',
    buildPreview: 'Build Preview',
    rebuildPreview: 'Rebuild',
    slidePreview: 'Slide Preview',
    previousSlide: 'Previous slide',
    nextSlide: 'Next slide',
    exitFullscreen: 'Exit fullscreen',
    enterFullscreen: 'Enter fullscreen',
    moreSlides: 'more',

    // Library mode search
    result: 'result',
    results: 'results',
    noResultsFound: 'No results found',

    // Content badges & tooltips
    badgeNew: 'New',
    badgeUpdated: 'Updated',
    slidesLabel: 'Slides:',
    keyPoints: 'Key points:',
    nMore: 'more...',
    tipAssetCopy: 'Click the copy button to get the markdown reference, then paste it in your custom slide.',
    tip: 'Tip:',
    addToDay1: 'Add to Day 1',
    previewModuleSlides: 'Preview module slides',
    previewAllFull: 'Preview all full slides',
    previewAllCondensed: 'Preview all condensed slides',

    // AI clarification flow
    aiClarifying: 'Let me ask a few questions to build the right workshop...',
    answerQuestions: 'Answer these questions',
    generateWithAnswers: 'Generate Workshop',
    editPrompt: 'Edit prompt',

    // Toolbar buttons
    slidesButton: 'Slides',
    aiHelp: 'AI Help',
    preview: 'Preview',
    settings: 'Settings',

    // Drag and drop
    moveToDay: 'Move to day',
    addedToDay: 'Added to Day',
    dragModuleHint: 'Drag to a day column',

    // Edit session modal
    editSession: 'Edit Session',
    sessionName: 'Session Name',
    facilitatorPresenter: 'Facilitator/Presenter',
    durationMinutes: 'Duration (minutes)',
    moveToDifferentDay: 'Move to Different Day',
    selectDay: 'Select day...',
    move: 'Move',
    confirmDeleteSession: 'Delete this session?',
    deleteSession: 'Delete Session',
    saveChanges: 'Save Changes',

    // Kanban
    addSession: 'Add Session',
    addDay: 'Add Day',
    deleteDay: 'Delete Day',

    // Custom slide editor
    sessionTitle: 'Session Title',
    slideContentMarkdown: 'Slide Content (Marp Markdown)',
    slideVariablesHelp: 'Use `---` to separate slides. Variables: `{{COUNTRY}}`, `{{LOCATION}}`',

    // Auth
    enterPasswordToContinue: 'Enter the team password to continue',
    teamPassword: 'Team Password',
    signingIn: 'Signing in...',
    signIn: 'Sign In',
    invalidPassword: 'Invalid password',
    failedToConnect: 'Failed to connect',

    // Status
    saving: 'Saving...',
    saved: 'Saved',

    // Export
    exportHTML: 'Export HTML',
    exportPowerPoint: 'Export PowerPoint',

    // Panels
    aiAssistant: 'AI Assistant',
    unpinPanel: 'Unpin panel',
    pinPanel: 'Pin panel',

    // Workshop
    noWorkshopsFound: 'No workshops found',
    pleaseDescribeWorkshop: 'Please describe what kind of workshop you need',
    pleaseCompleteRequired: 'Please fill in workshop name and country',
    confirmDeleteDayMsg: 'Delete Day {day} and all its sessions? This cannot be undone.',

    // AI warnings
    scheduleOverflowWarning: 'Some days may run long — review the schedule and adjust',

    // Slide theme
    slideTheme: 'Slide Theme',
    themeClassic: 'Classic',
    themeClassicDesc: 'Standard styling with colored borders',
    themeClean: 'Clean',
    themeCleanDesc: 'Minimal and spacious',
    themeBold: 'Bold',
    themeBoldDesc: 'High impact with strong colors',

    // Accessibility
    dismissError: 'Dismiss error',
    closePanel: 'Close panel',
    closeDialog: 'Close dialog',
    sendMessage: 'Send message',
    closeEditor: 'Close editor',
    clearSearch: 'Clear search',
    closePreview: 'Close preview',
    closeSlideView: 'Close slide view',
  },
  fr: {
    // Landing page
    appTitle: 'FASTR Deck Builder',
    appSubtitle: 'Créez et gérez vos présentations d\'atelier',
    signOut: 'Déconnexion',

    // Mode cards
    buildSlideDeck: 'Créer un diaporama',
    buildSlideDeckDesc: 'Créez un diaporama complet pour un atelier ou une formation',
    quickExport: 'Export rapide',
    quickExportDesc: 'Sélectionnez des diapositives et exportez en PPTX ou PDF',
    browseLibrary: 'Parcourir la bibliothèque',
    browseLibraryDesc: 'Explorez et prévisualisez les diapositives de la bibliothèque',

    // Existing decks
    existingDecks: 'Diaporamas existants',

    // Library mode
    browseContentLibrary: 'Parcourir la bibliothèque de contenu',
    loadingContentLibrary: 'Chargement de la bibliothèque...',
    slides: 'diapositives',
    full: 'Complet',
    condensed: 'Condensé',

    // Quick export
    selectSlidesExport: 'Sélectionnez des diapositives et exportez en PPTX ou PDF',
    selectedSlides: 'Diapositives sélectionnées',
    noSlidesSelected: 'Aucune diapositive sélectionnée',
    selectSlidesFromLibrary: 'Sélectionnez des diapositives dans la bibliothèque à gauche',
    exportPDF: 'Exporter PDF',
    exportPPTX: 'Exporter PPTX',
    exporting: 'Exportation...',
    clickToPreview: 'Cliquez sur une diapositive pour prévisualiser',
    selectContent: 'Sélectionner le contenu',
    checkToSelect: 'Cochez pour sélectionner, cliquez sur le nom pour prévisualiser',

    // Content
    modules: 'Modules',
    topics: 'sujets',
    breaksStructure: 'Pauses & Structure',
    breaks: 'Pauses',
    templates: 'Modèles',

    // Template categories
    structure: 'Structure',
    structureDesc: 'Diapositives de structure d\'atelier',
    breaksCategory: 'Pauses',
    breaksDesc: 'Diapositives de pause',
    dayTransitions: 'Transitions de journée',
    dayTransitionsDesc: 'Récapitulatif et aperçu de la journée',
    activitiesDemos: 'Activités & Démos',
    activitiesDesc: 'Diapositives de sessions interactives',

    // Add session menu
    addToDay: 'Ajouter au Jour',
    chooseModuleContent: 'Choisir le contenu du module',
    createCustomSlide: 'Créer une diapositive personnalisée',
    insertImage: 'Insérer une image',
    addToSession: 'Ajouter à la session',
    moduleContent: 'Contenu du module',
    addSlidesFromModules: 'Ajouter des diapositives des modules FASTR',
    teaBreak: 'Pause café',
    lunchBreak: 'Pause déjeuner',
    customSlide: 'Diapositive personnalisée',
    createYourOwnSlide: 'Créez votre propre diapositive en markdown',
    custom: 'Personnalisé',
    orAddIndividualSlides: 'Ou ajouter des diapositives individuellement :',
    fullSlides: 'Diapositives complètes',
    condensedSlides: 'Diapositives condensées',

    // Quick export selection panel
    yourSelection: 'Votre sélection',
    clearAll: 'Tout effacer',
    selectTopicsFromLibrary: 'Sélectionnez des sujets dans la bibliothèque pour créer votre présentation',

    // Workshop selection
    selectWorkshop: 'Sélectionner un atelier',
    createNewWorkshop: 'Créer un nouvel atelier',

    // Workshop creation
    aiSetup: 'Configuration IA',
    uploadOrPaste: 'Importer',
    manual: 'Manuel',
    describeWorkshop: 'Décrivez votre atelier et l\'IA le configurera pour vous.',
    aiPlaceholder: 'Exemple : Premier atelier FASTR au Sénégal, 3 jours. Accent sur la qualité des données et l\'estimation de la couverture. Utiliser un contenu introductif de haut niveau (versions courtes si disponibles). Il s\'agit d\'un rappel pour les équipes qui ont assisté à la formation de l\'année dernière.',
    back: 'Retour',
    generating: 'Génération...',
    generateWorkshop: 'Générer l\'atelier',
    uploadAgenda: 'Importer un agenda',
    uploadAgendaDesc: 'Importez un PDF, Word, ou collez votre agenda',
    pasteAgendaHere: 'Ou collez votre agenda ici...',
    dropFileHere: 'Déposez votre fichier ici',
    supportedFormats: 'PDF ou Word (.docx)',
    parsing: 'Analyse de l\'agenda...',
    workshopName: 'Nom de l\'atelier',
    country: 'Pays',
    city: 'Ville',
    startDate: 'Date de début',
    numberOfDays: 'Nombre de jours',
    create: 'Créer',

    // Workshop empty state
    selectOrCreateWorkshop: 'Sélectionnez ou créez un atelier pour commencer',
    chooseWorkshop: 'Choisir un atelier',

    // Workshop Settings
    workshopSettings: 'Paramètres de l\'atelier',
    coverSlide: 'Diapositive de couverture',
    presentationTitle: 'Titre de la présentation',
    subtitle: 'Sous-titre',
    workshopDetails: 'Détails de l\'atelier',
    endDate: 'Date de fin',
    location: 'Lieu / Ville',
    venue: 'Lieu de réunion',
    facilitators: 'Animateurs',
    contactInformation: 'Coordonnées',
    contactEmail: 'Email de contact',
    website: 'Site web',
    slideContent: 'Contenu des diapositives',
    slideContentDesc: 'Ce contenu apparaît sur les diapositives d\'ouverture verrouillées. Modifiez ici pour mettre à jour ce qui est affiché.',
    workshopObjectives: 'Objectifs de l\'atelier',
    objectivesSlide: 'Diapositive des objectifs',
    expectedOutputs: 'Résultats attendus',
    expectedOutputsSlide: 'Diapositive des résultats attendus',
    dailySchedule: 'Programme journalier',
    dailyScheduleDesc: 'Définissez le thème et l\'heure de début de chaque journée. Ils apparaissent dans les diapositives d\'agenda et les en-têtes de journée.',
    day: 'Jour',
    themeFocusArea: 'Thème / Domaine d\'intérêt',
    startsAt: 'Commence à',
    endsAt: 'Finit à',
    changesSavedAutomatically: 'Les modifications sont enregistrées automatiquement',
    done: 'Terminé',
    previewDeck: 'Aperçu du diaporama',
    export: 'Exporter',
    rebuild: 'Reconstruire',
    newSlide: 'Nouvelle diapositive',

    // Content Library
    contentLibrary: 'Bibliothèque de contenu',
    content: 'Contenu',
    assets: 'Ressources',
    breaksAndStructure: 'Pauses & Structure',
    loadingContent: 'Chargement du contenu...',
    xTopics: 'sujets',
    xSlides: 'diapositives',
    uploadingAssets: 'Téléchargement...',
    dragDropImages: 'Glissez-déposez des images ici',
    orClickToBrowse: 'ou cliquez pour parcourir',
    noAssetsUploaded: 'Aucune ressource téléchargée',
    selectWorkshopAssets: 'Sélectionnez un atelier pour gérer les ressources',
    loadingPreview: 'Chargement de l\'aperçu...',
    loadingSlides: 'Chargement des diapositives...',
    noSlidesAvailable: 'Aucune diapositive disponible',
    previous: 'Précédent',
    next: 'Suivant',
    slideXOfY: 'Diapositive',
    of: 'sur',
    addSlide: 'Ajouter une diapositive',
    createNewSession: 'Créer une nouvelle session',
    addAsSeparateSession: 'Ajouter comme session séparée au Jour 1',
    orAddToExisting: 'Ou ajouter à une session existante',
    from: 'De',

    // Preview
    presenterNotes: 'Notes du présentateur',

    // Common
    loading: 'Chargement...',
    error: 'Erreur',
    cancel: 'Annuler',
    save: 'Enregistrer',
    delete: 'Supprimer',
    close: 'Fermer',
    addEntireModule: 'Ajouter le module entier',
    topic: 'sujet',
    topicPlural: 'sujets',

    // Content Library page
    contentLibraryTitle: 'Bibliothèque de contenu',
    contentLibrarySubtitle: 'Sélectionnez des modules pour créer votre présentation',
    contentLibraryDesc: 'Parcourez, sélectionnez et exportez le contenu des modules',
    detailed: 'Détaillé',
    essentials: 'Essentiel',
    detailedDesc: 'Méthodologie complète et détails techniques',
    essentialsDesc: 'Concepts clés et interprétation',
    modulesSelected: 'modules sélectionnés',
    downloadPPTX: 'Télécharger PPTX',
    downloadPDF: 'Télécharger PDF',
    noModulesSelected: 'Sélectionnez des modules ci-dessus pour télécharger',
    totalSlides: 'diapositives',

    // Quick Export sections
    methodologyContent: 'Contenu méthodologique',
    methodologyContentDesc: 'Modules de cours pour enseigner les concepts FASTR',
    activitiesExercises: 'Activités & Exercices',
    activitiesExercisesDesc: 'Activités pratiques, exercices et contenu interactif',
    activity: 'Activité',
    topicCount: 'sujets',

    // Quick Export templates section
    templatesStructure: 'Modèles & Structure',
    templatesStructureDesc: 'Diapositives standard pour structurer votre présentation',
    templatesSelected: 'modèles sélectionnés',

    // Deck Preview
    buildingPreview: 'Génération de l\'aperçu...',
    failedToBuildPreview: 'Échec de la génération de l\'aperçu',
    tryAgain: 'Réessayer',
    noPreviewAvailable: 'Aucun aperçu disponible',
    buildPreview: 'Générer l\'aperçu',
    rebuildPreview: 'Reconstruire',
    slidePreview: 'Aperçu de la diapositive',
    previousSlide: 'Diapositive précédente',
    nextSlide: 'Diapositive suivante',
    exitFullscreen: 'Quitter le plein écran',
    enterFullscreen: 'Plein écran',
    moreSlides: 'de plus',

    // Library mode search
    result: 'résultat',
    results: 'résultats',
    noResultsFound: 'Aucun résultat',

    // Content badges & tooltips
    badgeNew: 'Nouveau',
    badgeUpdated: 'Mis à jour',
    slidesLabel: 'Diapositives :',
    keyPoints: 'Points clés :',
    nMore: 'de plus...',
    tipAssetCopy: 'Cliquez sur le bouton copier pour obtenir la référence markdown, puis collez-la dans votre diapositive personnalisée.',
    tip: 'Astuce :',
    addToDay1: 'Ajouter au Jour 1',
    previewModuleSlides: 'Prévisualiser les diapositives du module',
    previewAllFull: 'Prévisualiser toutes les diapositives complètes',
    previewAllCondensed: 'Prévisualiser toutes les diapositives condensées',

    // AI clarification flow
    aiClarifying: 'Quelques questions pour créer le bon atelier...',
    answerQuestions: 'Répondez à ces questions',
    generateWithAnswers: 'Générer l\'atelier',
    editPrompt: 'Modifier la description',

    // Toolbar buttons
    slidesButton: 'Diapositives',
    aiHelp: 'Aide IA',
    preview: 'Aperçu',
    settings: 'Paramètres',

    // Drag and drop
    moveToDay: 'Déplacer au jour',
    addedToDay: 'Ajouté au Jour',
    dragModuleHint: 'Glisser vers une colonne de jour',

    // Edit session modal
    editSession: 'Modifier la session',
    sessionName: 'Nom de la session',
    facilitatorPresenter: 'Animateur/Présentateur',
    durationMinutes: 'Durée (minutes)',
    moveToDifferentDay: 'Déplacer vers un autre jour',
    selectDay: 'Sélectionner un jour...',
    move: 'Déplacer',
    confirmDeleteSession: 'Supprimer cette session ?',
    deleteSession: 'Supprimer la session',
    saveChanges: 'Enregistrer les modifications',

    // Kanban
    addSession: 'Ajouter une session',
    addDay: 'Ajouter un jour',
    deleteDay: 'Supprimer le jour',

    // Custom slide editor
    sessionTitle: 'Titre de la session',
    slideContentMarkdown: 'Contenu de la diapositive (Marp Markdown)',
    slideVariablesHelp: 'Utilisez `---` pour séparer les diapositives. Variables : `{{COUNTRY}}`, `{{LOCATION}}`',

    // Auth
    enterPasswordToContinue: 'Entrez le mot de passe de l\'équipe pour continuer',
    teamPassword: 'Mot de passe de l\'équipe',
    signingIn: 'Connexion...',
    signIn: 'Se connecter',
    invalidPassword: 'Mot de passe invalide',
    failedToConnect: 'Échec de la connexion',

    // Status
    saving: 'Enregistrement...',
    saved: 'Enregistré',

    // Export
    exportHTML: 'Exporter HTML',
    exportPowerPoint: 'Exporter PowerPoint',

    // Panels
    aiAssistant: 'Assistant IA',
    unpinPanel: 'Détacher le panneau',
    pinPanel: 'Épingler le panneau',

    // Workshop
    noWorkshopsFound: 'Aucun atelier trouvé',
    pleaseDescribeWorkshop: 'Veuillez décrire le type d\'atelier souhaité',
    pleaseCompleteRequired: 'Veuillez remplir le nom et le pays de l\'atelier',
    confirmDeleteDayMsg: 'Supprimer le Jour {day} et toutes ses sessions ? Cette action est irréversible.',

    // AI warnings
    scheduleOverflowWarning: 'Certaines journées pourraient dépasser l\'horaire — vérifiez le programme',

    // Slide theme
    slideTheme: 'Thème des diapositives',
    themeClassic: 'Classique',
    themeClassicDesc: 'Style standard avec bordures colorées',
    themeClean: 'Épuré',
    themeCleanDesc: 'Minimaliste et aéré',
    themeBold: 'Audacieux',
    themeBoldDesc: 'Impact fort avec couleurs vives',

    // Accessibility
    dismissError: 'Fermer l\'erreur',
    closePanel: 'Fermer le panneau',
    closeDialog: 'Fermer la fenêtre',
    sendMessage: 'Envoyer le message',
    closeEditor: 'Fermer l\'éditeur',
    clearSearch: 'Effacer la recherche',
    closePreview: 'Fermer l\'aperçu',
    closeSlideView: 'Fermer la vue de diapositive',
  }
} as const

export type TranslationKey = keyof typeof translations.en

export function t(key: TranslationKey, language: Language): string {
  return translations[language][key] || translations.en[key] || key
}
