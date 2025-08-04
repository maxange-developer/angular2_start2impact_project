import { Component, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FruitService } from '../../services/fruit.service';
import { TranslationService } from '../../services/translation.service';
import { Fruit } from '../../models/fruit.model';

/**
 * FruitSearch Component - Advanced Fruit Search Interface
 *
 * @description
 * Specialized search component providing precise fruit lookup functionality with
 * real-time feedback, loading states, and comprehensive error handling. Designed
 * for both standalone usage and integration within larger fruit browsing workflows.
 *
 * @features
 * - Real-time fruit search with API integration
 * - Loading state management with visual indicators
 * - Toast notification system for user feedback
 * - Keyboard navigation support (Enter key submission)
 * - Input validation with user-friendly error messages
 * - Search term management with clear functionality
 * - Responsive design with mobile-optimized input
 * - Internationalization support for all text content
 *
 * @architecture
 * Uses Angular Signals for reactive state management with PrimeNG components
 * for consistent UI presentation. Integrates with FruitService for API operations
 * and MessageService for user notifications.
 *
 * @ui_components
 * - PrimeNG InputText with IconField for search input
 * - PrimeNG Button for search action
 * - PrimeNG ProgressSpinner for loading states
 * - PrimeNG Toast for notification feedback
 * - PrimeNG Icons for visual enhancement
 *
 * @user_experience
 * Provides immediate feedback for all user actions with clear success/error
 * states and descriptive messages. Supports both mouse and keyboard interactions
 * for accessibility compliance.
 *
 * @usage
 * ```html
 * <app-fruit-search
 *   (fruitFound)="handleFoundFruit($event)">
 * </app-fruit-search>
 * ```
 *
 * @author Fruity Nutrition Development Team
 * @version 1.0.0
 * @since Angular 18.0
 */
@Component({
  selector: 'app-fruit-search',
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    ProgressSpinnerModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './fruit-search.html',
  styleUrl: './fruit-search.scss',
})
export class FruitSearch {
  /**
   * Injected FruitService for search operations
   *
   * @private
   * @type {FruitService}
   * @description
   * Core service providing fruit search functionality through API integration.
   * Handles search requests, result processing, and error management for
   * individual fruit lookup operations.
   */
  private fruitService = inject(FruitService);

  /**
   * Injected MessageService for user notifications
   *
   * @private
   * @type {MessageService}
   * @description
   * PrimeNG service for displaying toast notifications to users. Provides
   * feedback for search results, validation errors, and system messages
   * with appropriate severity levels and styling.
   */
  private messageService = inject(MessageService);

  /**
   * Injected TranslationService for internationalization
   *
   * @protected
   * @type {TranslationService}
   * @description
   * Service providing reactive access to translated content for search
   * interface text, placeholders, and user messages. Protected access
   * enables template binding while maintaining encapsulation.
   */
  protected translationService = inject(TranslationService);

  /**
   * Event emitter for successful fruit search results
   *
   * @type {EventEmitter<Fruit>}
   * @description
   * Emits found fruit objects when search operations complete successfully.
   * Enables parent components to handle search results for navigation,
   * display, or integration with other application features.
   *
   * @emission Triggered when FruitService returns a valid fruit object
   * @usage Parent components can listen to integrate search results
   */
  @Output() fruitFound = new EventEmitter<Fruit>();

  /**
   * Reactive signal managing current search term input
   *
   * @type {WritableSignal<string>}
   * @description
   * Stores and tracks the current search term entered by the user.
   * Enables reactive updates and validation of search input before
   * submission to the search service.
   *
   * @default Empty string - no initial search term
   * @validation Trimmed before submission to prevent empty searches
   */
  searchTerm = signal<string>('');

  /**
   * Reactive signal tracking search operation status
   *
   * @type {WritableSignal<boolean>}
   * @description
   * Indicates whether a search operation is currently in progress.
   * Used to control loading indicators, disable search buttons,
   * and prevent duplicate search requests.
   *
   * @default false - No search in progress initially
   * @ui_impact Controls spinner visibility and button disabled state
   */
  isSearching = signal<boolean>(false);

  /**
   * Executes fruit search operation with comprehensive validation and feedback
   *
   * @returns {void}
   * @description
   * Primary search method that validates input, manages loading states, and
   * processes search results with appropriate user feedback. Handles both
   * successful searches and various error conditions with descriptive messaging.
   *
   * @validation_flow
   * 1. Trims whitespace from search term
   * 2. Validates non-empty input with warning message
   * 3. Sets loading state to prevent duplicate requests
   * 4. Calls FruitService.searchFruit() with validated term
   * 5. Processes results and provides user feedback
   *
   * @success_handling
   * - Emits fruitFound event with located fruit object
   * - Displays success toast with fruit name confirmation
   * - Resets loading state for next search
   *
   * @error_handling
   * - API errors: Displays service-provided error messages
   * - Network errors: Shows generic retry message
   * - Always resets loading state regardless of outcome
   *
   * @user_feedback
   * Uses PrimeNG MessageService to provide immediate feedback for all
   * search outcomes with appropriate severity levels and clear messaging.
   *
   * @example
   * ```typescript
   * // Triggered by search button click or Enter key press
   * onSearch() // Validates input → API call → Result processing → User feedback
   * ```
   */
  onSearch(): void {
    const term = this.searchTerm().trim();
    if (!term) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a fruit name',
      });
      return;
    }

    this.isSearching.set(true);

    this.fruitService.searchFruit(term).subscribe({
      next: (result) => {
        this.isSearching.set(false);
        if (result.fruit) {
          this.fruitFound.emit(result.fruit);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Found ${result.fruit.name}!`,
          });
        } else if (result.error) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: result.error,
          });
        }
      },
      error: (error) => {
        this.isSearching.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Search failed. Please try again.',
        });
      },
    });
  }

  /**
   * Handles keyboard events for enhanced user interaction
   *
   * @param {KeyboardEvent} event - The keyboard event object
   * @returns {void}
   * @description
   * Provides keyboard shortcuts for search functionality, specifically handling
   * Enter key presses to trigger search operations. Includes safety checks to
   * prevent search execution during ongoing operations.
   *
   * @keyboard_shortcuts
   * - Enter key: Triggers search if not already searching
   * - Prevents multiple simultaneous searches
   * - Maintains search state integrity
   *
   * @accessibility
   * Enhances accessibility by providing keyboard-only navigation for users
   * who cannot or prefer not to use mouse interactions for search operations.
   *
   * @user_experience
   * Provides expected behavior where Enter key submission is standard for
   * search interfaces, meeting user expectations and interaction patterns.
   *
   * @example
   * ```typescript
   * // Triggered on keydown/keypress events in search input
   * onKeyPress(event) // Checks for Enter → Validates not searching → Calls onSearch()
   * ```
   */
  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.isSearching()) {
      this.onSearch();
    }
  }

  /**
   * Clears the current search term and resets input state
   *
   * @returns {void}
   * @description
   * Utility method for resetting the search input to its initial empty state.
   * Provides users with a quick way to clear their current search term and
   * start fresh without manual text deletion.
   *
   * @state_reset
   * - Clears searchTerm signal to empty string
   * - Resets input field through two-way binding
   * - Maintains other component state (loading, etc.)
   *
   * @user_interface
   * Typically triggered by a clear button or reset action in the search
   * interface, providing intuitive search management functionality.
   *
   * @reactive_updates
   * Signal update automatically triggers UI updates through Angular's
   * reactive system, ensuring immediate visual feedback.
   *
   * @example
   * ```typescript
   * // Triggered by clear button click
   * clearSearch() // Sets searchTerm to '' → UI updates automatically
   * ```
   */
  clearSearch(): void {
    this.searchTerm.set('');
  }
}
