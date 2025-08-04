import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import {
  TranslationService,
  Language,
} from '../../services/translation.service';

/**
 * LanguageSelectorComponent - International Language Selection Interface
 *
 * @description
 * Sophisticated language selection component providing intuitive switching between
 * supported application languages with visual flag indicators and accessibility
 * features. Integrates seamlessly with the translation system for immediate
 * language switching across the entire application.
 *
 * @features
 * - Visual flag indicators for language identification
 * - Dropdown menu with current selection highlighting
 * - Responsive design hiding text labels on mobile devices
 * - Real-time language switching with instant UI updates
 * - Accessibility compliance with proper ARIA labeling
 * - Integration with TranslationService for persistent preferences
 * - CDN-based flag images for optimal performance
 * - Mobile-optimized interface with flag-only display
 *
 * @supported_languages
 * - Italian (it): Primary language with Italian flag
 * - English (en): Secondary language with US flag
 * - Extensible architecture for additional languages
 *
 * @architecture
 * Uses PrimeNG Menu component for dropdown functionality with custom styling
 * and flag integration. Connects directly to TranslationService for language
 * state management and preference persistence.
 *
 * @ui_components
 * - PrimeNG Button for main language selector trigger
 * - PrimeNG Menu for dropdown language options
 * - External flag CDN images for visual identification
 * - Responsive CSS for mobile adaptation
 *
 * @accessibility
 * Provides proper alt text for flag images and semantic menu structure
 * for screen readers and keyboard navigation support.
 *
 * @usage
 * ```html
 * <!-- Typically placed in application header/toolbar -->
 * <app-language-selector></app-language-selector>
 * ```
 *
 * @author Fruity Nutrition Development Team
 * @version 1.0.0
 * @since Angular 18.0
 */
@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule],
  template: `
    <p-button
      (onClick)="menu.toggle($event)"
      class="language-selector"
      [text]="true"
      severity="secondary"
      size="small"
    >
      <img
        [src]="getCurrentLanguageFlag()"
        [alt]="getCurrentLanguageLabel()"
        class="flag-image"
      />
      <span class="language-text">{{ getCurrentLanguageLabel() }}</span>
      <i class="pi pi-chevron-down"></i>
    </p-button>

    <p-menu
      #menu
      [model]="languageItems"
      [popup]="true"
      styleClass="language-menu"
      [appendTo]="'body'"
    >
      <ng-template pTemplate="item" let-item>
        <div class="language-menu-item">
          <div class="language-content">
            <img
              [src]="getLanguageFlag(item.id)"
              [alt]="item.label"
              class="flag-icon"
            />
            <span class="language-label">{{ getLanguageLabel(item.id) }}</span>
          </div>
          <i
            class="pi pi-check"
            *ngIf="translationService.language() === item.id"
          ></i>
        </div>
      </ng-template>
    </p-menu>
  `,
  styles: [
    `
      :host {
        display: flex;
        align-items: center;
      }

      .language-selector {
        display: flex;
        align-items: center;
        gap: 8px;
        min-width: 120px;
        color: white !important;
      }

      .flag-image {
        width: 22px;
        height: 16px;
        border-radius: 3px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
      }

      .language-text {
        font-weight: 500;
        color: white !important;
      }

      @media (max-width: 768px) {
        .language-selector {
          min-width: auto;
        }

        .language-text {
          display: none;
        }
      }
    `,
  ],
})
export class LanguageSelectorComponent {
  /**
   * Injected TranslationService for language management
   *
   * @type {TranslationService}
   * @description
   * Core service providing language switching functionality, current language
   * state tracking, and preference persistence. Enables reactive language
   * updates across the entire application interface.
   *
   * @public_access
   * Public access allows template binding for current language detection
   * and reactive updates when language preferences change.
   */
  translationService = inject(TranslationService);

  /**
   * Generates dropdown menu items for available languages
   *
   * @returns {MenuItem[]} Array of PrimeNG MenuItem objects for menu population
   * @description
   * Creates menu item configuration for the language selection dropdown with
   * proper labeling, identification, and command handlers for each supported
   * language option.
   *
   * @menu_structure
   * Each menu item contains:
   * - id: Language code for identification (it, en)
   * - label: Display name in the respective language
   * - command: Click handler for language switching
   *
   * @extensibility
   * New languages can be added by extending this array with additional
   * MenuItem objects following the same structure pattern.
   *
   * @example
   * ```typescript
   * // Returns menu configuration for PrimeNG Menu component
   * get languageItems() // Returns [{ id: 'it', label: 'Italiano', command: ... }, ...]
   * ```
   */
  get languageItems(): MenuItem[] {
    return [
      {
        id: 'it',
        label: 'Italiano',
        command: () => this.setLanguage('it'),
      },
      {
        id: 'en',
        label: 'English',
        command: () => this.setLanguage('en'),
      },
    ];
  }

  /**
   * Updates the application language through TranslationService
   *
   * @param {Language} language - The target language code ('it' | 'en')
   * @returns {void}
   * @description
   * Delegates language switching to the TranslationService which handles
   * preference persistence, signal updates, and reactive propagation across
   * all application components using translation content.
   *
   * @delegation_pattern
   * Follows separation of concerns by delegating language management to the
   * dedicated service rather than handling it directly in the UI component.
   *
   * @reactive_updates
   * Language change triggers automatic updates throughout the application
   * via TranslationService reactive signals and computed properties.
   *
   * @persistence
   * Selected language is automatically persisted to localStorage for
   * restoration in future sessions through TranslationService integration.
   *
   * @example
   * ```typescript
   * // Triggered by menu item selection
   * setLanguage('en') // Delegates to service → Updates app language → Persists preference
   * ```
   */
  setLanguage(language: Language) {
    this.translationService.setLanguage(language);
  }

  /**
   * Returns the appropriate flag image URL for the specified language
   *
   * @param {string} langId - Language identifier ('it' | 'en')
   * @returns {string} CDN URL for the corresponding flag image
   * @description
   * Maps language codes to their corresponding flag images using the flagcdn.com
   * service for high-quality, standardized flag representations with consistent
   * sizing and format.
   *
   * @flag_mapping
   * - 'it': Italian flag from flagcdn.com
   * - 'en': United States flag representing English
   * - 24x18 pixel dimensions for consistent UI presentation
   *
   * @cdn_benefits
   * Using external CDN reduces bundle size and provides optimized image
   * delivery with proper caching and geographic distribution.
   *
   * @fallback_strategy
   * Defaults to US flag for any unrecognized language codes to maintain
   * visual consistency and prevent broken image displays.
   *
   * @example
   * ```typescript
   * getLanguageFlag('it') // Returns 'https://flagcdn.com/24x18/it.png'
   * getLanguageFlag('en') // Returns 'https://flagcdn.com/24x18/us.png'
   * ```
   */
  getLanguageFlag(langId: string): string {
    return langId === 'it'
      ? 'https://flagcdn.com/24x18/it.png'
      : 'https://flagcdn.com/24x18/us.png';
  }

  /**
   * Returns the display label for the specified language
   *
   * @param {string} langId - Language identifier ('it' | 'en')
   * @returns {string} Human-readable language name in its native form
   * @description
   * Provides native language names for display in the language selection
   * interface, ensuring users can identify their preferred language regardless
   * of the current application language setting.
   *
   * @native_naming
   * Languages are displayed in their native form for universal recognition:
   * - Italian shown as 'Italiano' (not 'Italian')
   * - English shown as 'English' (standard international form)
   *
   * @user_experience
   * Native language names ensure users can always find and select their
   * preferred language even when the interface is in an unfamiliar language.
   *
   * @fallback_behavior
   * Defaults to 'English' for unrecognized language codes to maintain
   * interface consistency and provide a reasonable fallback option.
   *
   * @example
   * ```typescript
   * getLanguageLabel('it') // Returns 'Italiano'
   * getLanguageLabel('en') // Returns 'English'
   * ```
   */
  getLanguageLabel(langId: string): string {
    return langId === 'it' ? 'Italiano' : 'English';
  }

  /**
   * Returns the flag image URL for the currently selected language
   *
   * @returns {string} CDN URL for the current language's flag
   * @description
   * Convenience method that retrieves the flag image for the currently active
   * language by querying the TranslationService and mapping to the appropriate
   * flag resource.
   *
   * @reactive_binding
   * Can be used in templates for reactive flag display that automatically
   * updates when the language preference changes through any interface.
   *
   * @delegation
   * Delegates to getLanguageFlag() with the current language code for
   * consistent flag mapping logic and maintainability.
   *
   * @example
   * ```typescript
   * // Used in template for current language flag display
   * getCurrentLanguageFlag() // Returns flag URL for active language
   * ```
   */
  getCurrentLanguageFlag(): string {
    const lang = this.translationService.language();
    return lang === 'it'
      ? 'https://flagcdn.com/24x18/it.png'
      : 'https://flagcdn.com/24x18/us.png';
  }

  /**
   * Returns the display label for the currently selected language
   *
   * @returns {string} Native name of the currently active language
   * @description
   * Convenience method that retrieves the display label for the currently
   * active language by querying the TranslationService and mapping to the
   * appropriate native language name.
   *
   * @current_state
   * Reflects the real-time language state from TranslationService, providing
   * accurate display of the active language selection.
   *
   * @template_usage
   * Designed for use in templates where the current language label needs
   * to be displayed alongside the flag or selection button.
   *
   * @reactive_updates
   * Automatically provides updated labels when language changes occur
   * through reactive binding with TranslationService signals.
   *
   * @example
   * ```typescript
   * // Used in template for current language label
   * getCurrentLanguageLabel() // Returns 'Italiano' or 'English'
   * ```
   */
  getCurrentLanguageLabel(): string {
    const lang = this.translationService.language();
    return lang === 'it' ? 'Italiano' : 'English';
  }
}
