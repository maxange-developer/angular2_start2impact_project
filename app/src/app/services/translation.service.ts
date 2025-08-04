import {
  Injectable,
  signal,
  computed,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Type definition for supported application languages
 *
 * @typedef {('it' | 'en')} Language
 * @description
 * Union type representing all languages supported by the Fruity Nutrition application.
 * Currently supports Italian (it) as the primary language and English (en) for
 * international users.
 *
 * @extension
 * To add new languages, extend this union type and add corresponding translation
 * objects to the TranslationService.translations property.
 *
 * @example
 * ```typescript
 * // Valid language assignments
 * const italian: Language = 'it';
 * const english: Language = 'en';
 *
 * // To extend with Spanish:
 * // type Language = 'it' | 'en' | 'es';
 * ```
 */
export type Language = 'it' | 'en';

/**
 * Complete translation structure interface defining all translatable text content
 * in the Fruity Nutrition application. Organized by feature areas for maintainability.
 *
 * @interface Translations
 * @description
 * Comprehensive translation schema covering navigation, home page, fruit details,
 * search functionality, and common UI elements. Designed for scalability and
 * maintainability with clear hierarchical organization.
 *
 * @structure
 * - nav: Navigation and menu translations
 * - home: Main page content and interactive elements
 * - fruitDetail: Nutritional information and fruit-specific data
 * - search: Search functionality and user feedback
 * - common: Reusable UI components and system messages
 *
 * @implementation
 * Each section contains specific translation keys with descriptive names that
 * clearly indicate their usage context and location within the application.
 *
 * @type_safety
 * TypeScript interface ensures compile-time validation of translation completeness
 * across all supported languages, preventing runtime translation errors.
 */
export interface Translations {
  // Navigation
  nav: {
    allFruits: string;
    search: string;
    languageSelector: string;
  };

  // Home page
  home: {
    title: string;
    subtitle: string;
    totalFruits: string;
    filterBy: string;
    sortBy: string;
    family: string;
    order: string;
    genus: string;
    name: string;
    calories: string;
    sugar: string;
    noResults: string;
    searchPlaceholder: string;
    familyAll: string;
  };

  // Fruit details
  fruitDetail: {
    nutritionalInfo: string;
    calories: string;
    protein: string;
    fat: string;
    carbohydrates: string;
    sugar: string;
    caloriesUnit: string;
    gramsUnit: string;
    family: string;
    order: string;
    genus: string;
    close: string;
    lowCalories: string;
    mediumCalories: string;
    highCalories: string;
    healthBenefits: string;
    energyBoost: string;
    richVitamins: string;
    heartHealth: string;
    naturalHydration: string;
  };

  // Search
  search: {
    title: string;
    placeholder: string;
    searchButton: string;
    noResults: string;
    errorMessage: string;
    suggestions: string;
    popularFruits: string;
    found: string;
  };

  // Loading and errors
  common: {
    loading: string;
    error: string;
    retry: string;
    noData: string;
    viewDetails: string;
    refresh: string;
  };
}

/**
 * TranslationService - Internationalization and Localization Management
 *
 * @description
 * Enterprise-grade translation service providing comprehensive i18n support for the
 * Fruity Nutrition application. Manages multilingual content delivery with reactive
 * state management using Angular Signals and browser-based persistence.
 *
 * @features
 * - Reactive translation switching with Signal-based state management
 * - Browser-safe localStorage persistence for user language preferences
 * - Type-safe translation key access with TypeScript interfaces
 * - Server-side rendering (SSR) compatibility with platform detection
 * - Computed signals for efficient translation reactivity
 * - Hierarchical translation structure for organized content management
 *
 * @architecture
 * The service implements a centralized translation pattern where all translatable
 * content is stored in structured objects, accessed through computed signals for
 * optimal performance and reactivity across the application.
 *
 * @usage
 * ```typescript
 * constructor(private translationService: TranslationService) {
 *   // Access current translations reactively
 *   const translations = this.translationService.t();
 *
 *   // Change language programmatically
 *   this.translationService.setLanguage('en');
 *
 *   // Get specific translation path
 *   const title = this.translationService.getTranslation('home.title');
 * }
 * ```
 *
 * @author Fruity Nutrition Development Team
 * @version 1.0.0
 * @since Angular 18.0
 */
@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  /**
   * Reactive signal maintaining the current application language
   *
   * @private
   * @type {WritableSignal<Language>}
   * @description
   * Core state management for the current language selection. Uses Angular Signals
   * for reactive updates across all components consuming translations. Defaults to
   * Italian (it) as the primary application language.
   *
   * @reactivity
   * Changes to this signal automatically trigger updates in all computed translations
   * and dependent components throughout the application.
   */
  private currentLanguage = signal<Language>('it');

  /**
   * Complete translation dictionary containing all supported languages
   *
   * @private
   * @type {Record<Language, Translations>}
   * @description
   * Comprehensive translation repository structured by language codes. Contains
   * complete translation sets for Italian and English, organized by feature areas
   * for maintainability and scalability.
   *
   * @structure
   * - nav: Navigation and menu translations
   * - home: Home page content and UI elements
   * - fruitDetail: Fruit information and nutritional data
   * - search: Search functionality and feedback messages
   * - common: Reusable UI elements and system messages
   *
   * @localization
   * Italian translations serve as the primary content source, with English
   * providing full feature parity for international users.
   */
  private translations: Record<Language, Translations> = {
    it: {
      nav: {
        allFruits: 'Tutti i Frutti',
        search: 'Cerca',
        languageSelector: 'Lingua',
      },
      home: {
        title: 'Fruity Nutrition',
        subtitle: 'Scopri i valori nutrizionali dei tuoi frutti preferiti',
        totalFruits: 'frutti disponibili',
        filterBy: 'Filtra per',
        sortBy: 'Ordina per',
        family: 'Famiglia',
        order: 'Ordine',
        genus: 'Genere',
        name: 'Nome',
        calories: 'Calorie',
        sugar: 'Zuccheri',
        noResults: 'Nessun frutto trovato con i filtri selezionati',
        searchPlaceholder: 'Cerca un frutto...',
        familyAll: 'Tutti',
      },
      fruitDetail: {
        nutritionalInfo: 'Informazioni Nutrizionali',
        calories: 'Calorie',
        protein: 'Proteine',
        fat: 'Grassi',
        carbohydrates: 'Carboidrati',
        sugar: 'Zuccheri',
        caloriesUnit: 'kcal/100g',
        gramsUnit: 'g/100g',
        family: 'Famiglia',
        order: 'Ordine',
        genus: 'Genere',
        close: 'Chiudi',
        lowCalories: 'Basse Calorie',
        mediumCalories: 'Medie Calorie',
        highCalories: 'Alte Calorie',
        healthBenefits: 'Benefici per la Salute',
        energyBoost: 'Energia da zuccheri naturali',
        richVitamins: 'Ricco di vitamine e antiossidanti',
        heartHealth: 'Supporta la salute del cuore',
        naturalHydration: 'Idratazione naturale',
      },
      search: {
        title: 'Cerca Frutti',
        placeholder: 'Inserisci il nome di un frutto...',
        searchButton: 'Cerca',
        noResults: 'Nessun frutto trovato',
        errorMessage: 'Errore durante la ricerca',
        suggestions: 'Suggerimenti',
        popularFruits: 'Frutti Popolari',
        found: '{name} aggiunto alla lista!',
      },
      common: {
        loading: 'Caricamento...',
        error: 'Si è verificato un errore',
        retry: 'Riprova',
        noData: 'Nessun dato disponibile',
        viewDetails: 'Vedi dettagli',
        refresh: 'Aggiorna',
      },
    },
    en: {
      nav: {
        allFruits: 'All Fruits',
        search: 'Search',
        languageSelector: 'Language',
      },
      home: {
        title: 'Fruity Nutrition',
        subtitle: 'Discover the nutritional values of your favorite fruits',
        totalFruits: 'fruits available',
        filterBy: 'Filter by',
        sortBy: 'Sort by',
        family: 'Family',
        order: 'Order',
        genus: 'Genus',
        name: 'Name',
        calories: 'Calories',
        sugar: 'Sugar',
        noResults: 'No fruits found with selected filters',
        searchPlaceholder: 'Search for a fruit...',
        familyAll: 'All',
      },
      fruitDetail: {
        nutritionalInfo: 'Nutritional Information',
        calories: 'Calories',
        protein: 'Protein',
        fat: 'Fat',
        carbohydrates: 'Carbohydrates',
        sugar: 'Sugar',
        caloriesUnit: 'kcal/100g',
        gramsUnit: 'g/100g',
        family: 'Family',
        order: 'Order',
        genus: 'Genus',
        close: 'Close',
        lowCalories: 'Low Calories',
        mediumCalories: 'Medium Calories',
        highCalories: 'High Calories',
        healthBenefits: 'Health Benefits',
        energyBoost: 'Energy boost from natural sugars',
        richVitamins: 'Rich in vitamins and antioxidants',
        heartHealth: 'Supports heart health',
        naturalHydration: 'Natural hydration',
      },
      search: {
        title: 'Search Fruits',
        placeholder: 'Enter fruit name...',
        searchButton: 'Search',
        noResults: 'No fruits found',
        errorMessage: 'Error during search',
        suggestions: 'Suggestions',
        popularFruits: 'Popular Fruits',
        found: '{name} added to the list!',
      },
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        retry: 'Retry',
        noData: 'No data available',
        viewDetails: 'View Details',
        refresh: 'Refresh',
      },
    },
  };

  /**
   * Computed signal providing reactive access to current language translations
   *
   * @type {Signal<Translations>}
   * @description
   * Reactive computed signal that automatically updates when the current language
   * changes. Provides type-safe access to all translations for the active language.
   * This computed signal ensures efficient re-rendering only when language changes.
   *
   * @performance
   * Uses Angular's computed signal for optimal performance - only recalculates
   * when the currentLanguage signal changes, preventing unnecessary re-computations.
   *
   * @example
   * ```typescript
   * // In component
   * constructor(private translationService: TranslationService) {
   *   effect(() => {
   *     const translations = this.translationService.t();
   *     console.log('Current language translations:', translations.nav.allFruits);
   *   });
   * }
   * ```
   */
  t = computed(() => this.translations[this.currentLanguage()]);

  /**
   * Read-only access to the current language signal
   *
   * @type {Signal<Language>}
   * @description
   * Provides reactive read-only access to the current language state. Components
   * can use this getter to reactively respond to language changes without direct
   * access to the private signal.
   *
   * @usage
   * ```typescript
   * // Check current language reactively
   * const currentLang = this.translationService.language();
   *
   * // React to language changes
   * effect(() => {
   *   console.log('Language changed to:', this.translationService.language());
   * });
   * ```
   */
  get language() {
    return this.currentLanguage;
  }

  /**
   * Updates the application language and persists the preference
   *
   * @param {Language} language - The target language to set ('it' | 'en')
   * @description
   * Changes the current application language and automatically persists the user's
   * preference to localStorage for future sessions. Triggers reactive updates
   * across all components consuming translations.
   *
   * @persistence
   * Language preference is saved to localStorage with the key 'fruity-app-language'
   * but only in browser environments to ensure SSR compatibility.
   *
   * @reactivity
   * Setting a new language immediately triggers updates to the computed translation
   * signal, causing all dependent components to re-render with new translations.
   *
   * @param language The ISO language code to set as active
   *
   * @example
   * ```typescript
   * // Switch to English
   * this.translationService.setLanguage('en');
   *
   * // Switch to Italian
   * this.translationService.setLanguage('it');
   * ```
   *
   * @throws No exceptions thrown - invalid languages are ignored
   */
  setLanguage(language: Language) {
    this.currentLanguage.set(language);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('fruity-app-language', language);
    }
  }

  /**
   * Service constructor with platform-aware language initialization
   *
   * @param {Object} platformId - Angular platform identifier for SSR compatibility
   * @description
   * Initializes the translation service with browser-safe language preference loading.
   * Attempts to restore the user's previously selected language from localStorage,
   * falling back to the default Italian (it) language.
   *
   * @ssr_compatibility
   * Uses Angular's PLATFORM_ID injection to detect browser environment before
   * accessing localStorage, ensuring compatibility with server-side rendering.
   *
   * @initialization_flow
   * 1. Check if running in browser environment
   * 2. Attempt to load saved language from localStorage
   * 3. Validate loaded language against supported options
   * 4. Set language or fall back to default (Italian)
   *
   * @storage_key 'fruity-app-language' - localStorage key for language persistence
   *
   * @example
   * ```typescript
   * // Service automatically initializes on injection
   * constructor(private translationService: TranslationService) {
   *   // Language preference automatically loaded from localStorage
   * }
   * ```
   */
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Load saved language from localStorage only in browser environment
    if (isPlatformBrowser(this.platformId)) {
      const savedLanguage = localStorage.getItem(
        'fruity-app-language'
      ) as Language;
      if (savedLanguage && (savedLanguage === 'it' || savedLanguage === 'en')) {
        this.currentLanguage.set(savedLanguage);
      }
    }
  }

  /**
   * Retrieves translation text by hierarchical path key
   *
   * @param {string} path - Dot-separated path to the translation key (e.g., 'home.title')
   * @returns {string} The translated text or the original path if not found
   *
   * @description
   * Utility method for accessing nested translation values using dot notation paths.
   * Provides a safe way to retrieve translations with automatic fallback to the
   * original path if the translation is not found.
   *
   * @path_notation
   * Uses dot notation to navigate the translation object hierarchy:
   * - 'nav.allFruits' → translations.nav.allFruits
   * - 'home.title' → translations.home.title
   * - 'fruitDetail.nutritionalInfo' → translations.fruitDetail.nutritionalInfo
   *
   * @error_handling
   * If any part of the path is not found, returns the original path string
   * to help with debugging missing translations during development.
   *
   * @performance
   * Efficiently traverses the translation object using a simple loop,
   * avoiding recursive calls for optimal performance.
   *
   * @example
   * ```typescript
   * // Get specific translation
   * const title = this.translationService.getTranslation('home.title');
   * // Returns: "Fruity Nutrition" (IT) or "Fruity Nutrition" (EN)
   *
   * const button = this.translationService.getTranslation('search.searchButton');
   * // Returns: "Cerca" (IT) or "Search" (EN)
   *
   * // Invalid path returns original string
   * const invalid = this.translationService.getTranslation('invalid.path');
   * // Returns: "invalid.path"
   * ```
   */
  getTranslation(path: string): string {
    const keys = path.split('.');
    let current: any = this.t();

    for (const key of keys) {
      current = current[key];
      if (!current) return path; // Return path if translation not found
    }

    return current;
  }
}
