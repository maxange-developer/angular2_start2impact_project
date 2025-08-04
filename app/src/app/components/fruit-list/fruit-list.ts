import {
  Component,
  OnInit,
  inject,
  signal,
  computed,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { FruitService } from '../../services/fruit.service';
import { TranslationService } from '../../services/translation.service';
import { FruitCard } from '../fruit-card/fruit-card';
import { Fruit } from '../../models/fruit.model';

/**
 * FruitList Component - Main Fruit Collection Display and Management
 *
 * @description
 * Comprehensive fruit listing component that serves as the primary interface for
 * browsing, filtering, and selecting fruits in the Fruity Nutrition application.
 * Combines reactive state management, advanced filtering, sorting capabilities,
 * and responsive grid layout for optimal user experience.
 *
 * @features
 * - Reactive fruit data loading with loading states and error handling
 * - Multi-criteria filtering by botanical family with dynamic family extraction
 * - Flexible sorting by name, calories, protein, and sugar content
 * - Real-time search integration with FruitService search functionality
 * - Responsive grid layout adapting to various screen sizes
 * - Toast notifications for user feedback and error messaging
 * - Refresh functionality with state reset capabilities
 * - Fruit count display showing total and filtered counts
 * - Click-to-select functionality with event emission to parent components
 *
 * @architecture
 * Uses Angular Signals for reactive state management with computed properties
 * for efficient filtering and sorting. Integrates with FruitService for data
 * operations and TranslationService for internationalization.
 *
 * @ui_components
 * - PrimeNG ProgressSpinner for loading states
 * - PrimeNG Select for filter and sort controls
 * - PrimeNG Button for action controls
 * - PrimeNG Tag for fruit category indicators
 * - PrimeNG Toast for user notifications
 * - Custom FruitCard components for individual fruit display
 *
 * @state_management
 * Reactive patterns using Angular Signals ensure efficient updates and
 * automatic UI synchronization when filters, sorting, or data changes.
 *
 * @usage
 * ```html
 * <app-fruit-list
 *   (fruitSelected)="navigateToDetail($event)"
 *   (searchReset)="handleSearchReset()">
 * </app-fruit-list>
 * ```
 *
 * @author Fruity Nutrition Development Team
 * @version 1.0.0
 * @since Angular 18.0
 */
@Component({
  selector: 'app-fruit-list',
  imports: [
    CommonModule,
    FormsModule,
    ProgressSpinnerModule,
    ButtonModule,
    SelectModule,
    TagModule,
    ToastModule,
    FruitCard,
  ],
  providers: [MessageService],
  templateUrl: './fruit-list.html',
  styleUrl: './fruit-list.scss',
})
export class FruitList implements OnInit {
  /**
   * Injected FruitService for data operations and state management
   *
   * @private
   * @type {FruitService}
   * @description
   * Core service providing fruit data fetching, caching, filtering, and search
   * functionality. Manages reactive state for loading, error handling, and
   * data persistence across component lifecycle.
   */
  private fruitService = inject(FruitService);

  /**
   * Injected TranslationService for internationalization support
   *
   * @protected
   * @type {TranslationService}
   * @description
   * Provides reactive access to translated content for UI labels, filter options,
   * sort criteria, and user messages. Protected access allows template binding
   * while maintaining encapsulation.
   */
  protected translationService = inject(TranslationService);

  /**
   * Event emitter for fruit selection notifications
   *
   * @type {EventEmitter<Fruit>}
   * @description
   * Emits selected fruit objects when users interact with fruit cards.
   * Enables parent components to handle navigation to detail views, adding
   * fruits to favorites, or other selection-based actions.
   *
   * @usage Parent components can listen for fruit selection events
   */
  @Output() fruitSelected = new EventEmitter<Fruit>();

  /**
   * Event emitter for search reset notifications
   *
   * @type {EventEmitter<void>}
   * @description
   * Notifies parent components when the search/filter state is reset to
   * initial values. Allows coordinated state management across multiple
   * components that may depend on search state.
   *
   * @trigger Activated when refresh functionality clears all filters
   */
  @Output() searchReset = new EventEmitter<void>();

  /**
   * Reactive signal storing all available fruits
   *
   * @type {WritableSignal<Fruit[]>}
   * @description
   * Complete collection of fruits loaded from the API. Serves as the master
   * dataset for all filtering and sorting operations. Updates trigger
   * reactive recalculation of computed properties.
   */
  allFruits = signal<Fruit[]>([]);

  /**
   * Reactive signal for temporarily filtered fruits (legacy)
   *
   * @type {WritableSignal<Fruit[]>}
   * @description
   * Maintained for backward compatibility. Current implementation relies
   * on FruitService.filteredFruits() for search-based filtering.
   *
   * @deprecated Consider removing in favor of service-based filtering
   */
  filteredFruits = signal<Fruit[]>([]);

  /**
   * Reactive signal containing unique botanical families
   *
   * @type {WritableSignal<string[]>}
   * @description
   * Dynamically extracted list of unique fruit families from the loaded
   * dataset. Used to populate family filter dropdown options. Updates
   * automatically when fruit data changes.
   */
  families = signal<string[]>([]);

  /**
   * Reactive signal for currently selected family filter
   *
   * @type {WritableSignal<string>}
   * @description
   * Current family filter selection. 'all' represents no family filtering.
   * Changes trigger reactive recalculation of filtered and sorted fruit lists.
   *
   * @default 'all' - Shows all families initially
   */
  selectedFamily = signal<string>('all');

  /**
   * Reactive signal for current sorting criteria
   *
   * @type {WritableSignal<string>}
   * @description
   * Current sorting method applied to the fruit list. Supports sorting by
   * name (alphabetical), calories (ascending), protein (descending), and
   * sugar content (ascending).
   *
   * @options 'name' | 'calories' | 'protein' | 'sugar'
   * @default 'name' - Alphabetical sorting initially
   */
  sortBy = signal<string>('name');

  /**
   * Loading state signal from FruitService
   *
   * @type {Signal<boolean>}
   * @description
   * Reactive reference to the FruitService loading state. Used to display
   * loading spinners and disable interactions during data operations.
   * Automatically updates when service operations begin or complete.
   */
  isLoading = this.fruitService.loading;

  /**
   * Error state signal from FruitService
   *
   * @type {Signal<string | null>}
   * @description
   * Reactive reference to the FruitService error state. Contains error
   * messages when data operations fail, null when no errors present.
   * Used for error display and user feedback.
   */
  error = this.fruitService.error;

  /**
   * Computed property providing sorted and filtered fruit collection
   *
   * @type {Signal<Fruit[]>}
   * @description
   * Reactive computed signal that combines FruitService filtered results with
   * local family filtering and sorting preferences. Automatically recalculates
   * when any dependency changes, ensuring optimal performance and UI responsiveness.
   *
   * @computation_flow
   * 1. Starts with FruitService.filteredFruits() (includes search filtering)
   * 2. Applies family filtering if specific family selected
   * 3. Applies sorting based on selected criteria
   * 4. Returns final processed fruit array
   *
   * @sorting_algorithms
   * - name: Alphabetical using localeCompare for proper internationalization
   * - calories: Ascending numerical sort (lowest to highest)
   * - protein: Descending numerical sort (highest to lowest)
   * - sugar: Ascending numerical sort (lowest to highest)
   *
   * @performance_optimization
   * Uses computed() for efficient recalculation only when dependencies change,
   * preventing unnecessary sorting operations and UI updates.
   *
   * @reactive_dependencies
   * - FruitService.filteredFruits() (search filter changes)
   * - selectedFamily() (family filter changes)
   * - sortBy() (sort criteria changes)
   */
  sortedAndFilteredFruits = computed(() => {
    let fruits = this.fruitService.filteredFruits(); // Uses filtered fruits from service

    // Apply family filtering if specific family is selected
    if (this.selectedFamily() !== 'all') {
      fruits = fruits.filter((fruit) => fruit.family === this.selectedFamily());
    }

    // Apply selected sorting criteria
    return fruits.sort((a, b) => {
      switch (this.sortBy()) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'calories':
          return a.nutritions.calories - b.nutritions.calories;
        case 'protein':
          return b.nutritions.protein - a.nutritions.protein;
        case 'sugar':
          return a.nutritions.sugar - b.nutritions.sugar;
        default:
          return 0;
      }
    });
  });

  /**
   * Angular lifecycle hook for component initialization
   *
   * @returns {void}
   * @description
   * Implements OnInit interface to perform initial data loading when component
   * is instantiated. Triggers the fruit loading process that populates the
   * component state and enables user interactions.
   *
   * @lifecycle_sequence
   * 1. Component constructor executes
   * 2. Dependency injection completes
   * 3. ngOnInit() called by Angular
   * 4. loadFruits() initiates data fetching
   * 5. Component becomes ready for user interaction
   *
   * @initialization_pattern
   * Follows Angular best practices by keeping constructor minimal and
   * performing side effects in lifecycle hooks rather than constructor.
   */
  ngOnInit(): void {
    this.loadFruits();
  }

  /**
   * Loads initial fruit data from the FruitService
   *
   * @returns {void}
   * @description
   * Initiates the fruit data loading process by subscribing to the FruitService
   * getAllFruits() observable. Handles successful data loading and error states
   * while updating component state and extracting family classifications.
   *
   * @data_flow
   * 1. Calls FruitService.getAllFruits() to fetch fruit data
   * 2. On success: Updates allFruits signal and extracts families
   * 3. On error: Logs error for debugging (could be enhanced with user feedback)
   * 4. Updates families list for filter dropdown population
   *
   * @error_handling
   * Currently logs errors to console - production implementation should
   * include user-friendly error notifications and retry mechanisms.
   *
   * @debugging
   * Includes console logging of loaded fruit names for development debugging.
   * Should be removed or made conditional for production builds.
   *
   * @side_effects
   * - Updates allFruits signal with loaded data
   * - Triggers family extraction and families signal update
   * - Enables reactive computed properties dependent on fruit data
   */
  loadFruits(): void {
    this.fruitService.getAllFruits().subscribe({
      next: (fruits) => {
        this.allFruits.set(fruits);
        this.extractFamilies(fruits);
      },
      error: (error) => {
        console.error('Error loading fruits:', error);
      },
    });
  }

  /**
   * Extracts unique botanical families from fruit data for filter options
   *
   * @private
   * @param {Fruit[]} fruits - Array of fruit objects to process
   * @returns {void}
   * @description
   * Processes the loaded fruit array to extract unique botanical family names
   * for populating the family filter dropdown. Creates a sorted list of unique
   * families and updates the families signal for reactive UI updates.
   *
   * @algorithm
   * 1. Maps fruits array to extract family property from each fruit
   * 2. Creates Set to eliminate duplicate family names
   * 3. Converts Set back to array using spread operator
   * 4. Sorts families alphabetically for consistent UI presentation
   * 5. Updates families signal to trigger reactive updates
   *
   * @data_quality
   * Handles potential inconsistencies in family naming from the API by
   * treating each unique string as a separate family category.
   *
   * @performance
   * Efficient O(n log n) operation due to sorting, but typically handles
   * small datasets (< 100 fruits) making performance impact negligible.
   *
   * @reactive_impact
   * Updates families signal triggers recalculation of familyOptions computed
   * property, automatically updating dropdown UI without manual intervention.
   */
  private extractFamilies(fruits: Fruit[]): void {
    const uniqueFamilies = [
      ...new Set(fruits.map((fruit) => fruit.family)),
    ].sort();
    this.families.set(uniqueFamilies);
  }

  /**
   * Handles fruit selection events from child FruitCard components
   *
   * @param {Fruit} fruit - The selected fruit object
   * @returns {void}
   * @description
   * Event handler that receives fruit selection events from child FruitCard
   * components and re-emits them to parent components. Enables upward event
   * propagation for handling fruit selection actions like navigation to detail views.
   *
   * @event_flow
   * FruitCard click → onFruitSelected() → fruitSelected.emit() → Parent handler
   *
   * @usage_context
   * Typically triggers navigation to fruit detail modal/page or adds fruit
   * to favorites/comparison lists in parent components.
   *
   * @delegation_pattern
   * Follows Angular event delegation pattern where child components emit
   * domain events and parent components handle application-specific logic.
   */
  onFruitSelected(fruit: Fruit): void {
    this.fruitSelected.emit(fruit);
  }

  /**
   * Updates the selected family filter
   *
   * @param {string} family - The family name to filter by ('all' for no filter)
   * @returns {void}
   * @description
   * Updates the selectedFamily signal when user changes family filter selection.
   * Triggers reactive recalculation of sortedAndFilteredFruits computed property
   * to immediately update the displayed fruit list.
   *
   * @filter_logic
   * - 'all': Shows fruits from all families (no filtering)
   * - Specific family name: Shows only fruits from that botanical family
   *
   * @reactive_chain
   * Filter change → selectedFamily signal update → sortedAndFilteredFruits
   * recalculation → UI updates automatically through Angular change detection
   */
  onFamilyChange(family: string): void {
    this.selectedFamily.set(family);
  }

  /**
   * Updates the selected sorting criteria
   *
   * @param {string} sortBy - The sorting criteria ('name' | 'calories' | 'protein' | 'sugar')
   * @returns {void}
   * @description
   * Updates the sortBy signal when user changes sorting preference. Triggers
   * reactive recalculation of sortedAndFilteredFruits computed property to
   * immediately re-order the displayed fruit list.
   *
   * @sorting_options
   * - 'name': Alphabetical sorting (A-Z)
   * - 'calories': Caloric content (ascending)
   * - 'protein': Protein content (descending)
   * - 'sugar': Sugar content (ascending)
   *
   * @reactive_updates
   * Sort change → sortBy signal update → sortedAndFilteredFruits recalculation
   * → UI re-renders with new order automatically
   */
  onSortChange(sortBy: string): void {
    this.sortBy.set(sortBy);
  }

  /**
   * Alternative fruit click handler (delegates to onFruitSelected)
   *
   * @param {Fruit} fruit - The clicked fruit object
   * @returns {void}
   * @description
   * Alternative method name for handling fruit click events. Provides the same
   * functionality as onFruitSelected() for template flexibility and semantic clarity.
   *
   * @delegation
   * Simply delegates to onFruitSelected() to maintain single responsibility
   * and avoid code duplication while providing semantic naming options.
   *
   * @template_usage
   * Can be used interchangeably with onFruitSelected() in templates based
   * on semantic preference or specific interaction context.
   */
  onFruitClick(fruit: Fruit): void {
    this.fruitSelected.emit(fruit);
  }

  /**
   * Refreshes fruit data and resets all filters to initial state
   *
   * @returns {void}
   * @description
   * Comprehensive refresh operation that reloads fruit data from the API,
   * resets all local filters to default values, and notifies parent components
   * of the state reset. Provides users with a clean slate for fruit browsing.
   *
   * @reset_operations
   * 1. Clears FruitService search filter
   * 2. Resets family filter to 'all'
   * 3. Emits searchReset event to parent components
   * 4. Refreshes fruit data from API
   * 5. Re-extracts family classifications
   *
   * @error_handling
   * Includes error logging for refresh failures. Production implementation
   * should include user feedback for failed refresh operations.
   *
   * @user_feedback
   * Should typically be accompanied by loading indicators and success/error
   * notifications to provide clear feedback about refresh operation status.
   *
   * @coordination
   * Emits searchReset event to coordinate state management with parent
   * components that may maintain related state (search inputs, etc.).
   */
  refreshFruits(): void {
    // Reset search filter in service
    this.fruitService.searchFilter.set('');
    this.selectedFamily.set('all');
    this.searchReset.emit();

    this.fruitService.refreshFruits().subscribe({
      next: (fruits) => {
        this.allFruits.set(fruits);
        this.extractFamilies(fruits);
      },
      error: (error) => {
        console.error('Error refreshing fruits:', error);
      },
    });
  }

  /**
   * Returns the total count of loaded fruits
   *
   * @returns {number} Total number of fruits in the complete dataset
   * @description
   * Provides the total count of fruits loaded from the API, representing
   * the complete dataset size before any filtering operations. Used for
   * displaying dataset statistics and user feedback.
   *
   * @usage_context
   * Typically displayed in UI to show users the complete scope of available
   * fruits (e.g., "Showing 15 of 67 fruits" when filters are applied).
   *
   * @reactive_source
   * Based on allFruits signal, automatically updates when fruit data is
   * refreshed or reloaded, ensuring accurate count display.
   */
  getTotalCount(): number {
    return this.allFruits().length;
  }

  /**
   * Returns the count of currently filtered and displayed fruits
   *
   * @returns {number} Number of fruits after applying all filters and sorting
   * @description
   * Provides the count of fruits currently visible to the user after applying
   * search filters, family filters, and any other display criteria. Essential
   * for user feedback and empty state detection.
   *
   * @filtering_scope
   * Includes effects of:
   * - Search text filtering (via FruitService)
   * - Family filtering (local component state)
   * - Any other applied filters
   *
   * @ui_integration
   * Used to display current result count and trigger empty state displays
   * when filtered count reaches zero.
   *
   * @reactive_updates
   * Automatically updates when any filtering criteria change through
   * computed signal dependency tracking.
   */
  getFilteredCount(): number {
    return this.sortedAndFilteredFruits().length;
  }

  /**
   * Computed property providing family filter dropdown options
   *
   * @type {Signal<Array<{label: string, value: string}>>}
   * @description
   * Reactive computed signal that generates dropdown options for family filtering.
   * Combines translated "All" option with dynamically extracted family names
   * from the loaded fruit dataset. Updates automatically when language or
   * fruit data changes.
   *
   * @option_structure
   * - First option: "All Families" with value 'all' (translated)
   * - Subsequent options: Individual family names as both label and value
   *
   * @internationalization
   * "All" option label is automatically translated based on current language
   * setting through TranslationService integration.
   *
   * @reactive_dependencies
   * - TranslationService current language
   * - families signal (extracted from fruit data)
   *
   * @ui_integration
   * Designed for direct use with PrimeNG Select component optionLabel and
   * optionValue properties for seamless dropdown population.
   */
  familyOptions = computed(() => [
    { label: this.translationService.t().home.familyAll, value: 'all' },
    ...this.families().map((family) => ({ label: family, value: family })),
  ]);

  /**
   * Computed property providing sort criteria dropdown options
   *
   * @type {Signal<Array<{label: string, value: string}>>}
   * @description
   * Reactive computed signal that generates dropdown options for sorting criteria.
   * All labels are automatically translated based on current language setting,
   * providing localized sorting options for enhanced user experience.
   *
   * @sorting_options
   * - Name (A-Z): Alphabetical sorting with direction indicator
   * - Calories: Nutritional calorie content sorting
   * - Protein: Protein content sorting (typically descending)
   * - Sugar: Sugar content sorting for dietary awareness
   *
   * @localization
   * All option labels are dynamically translated using TranslationService,
   * ensuring consistent language support across the sorting interface.
   *
   * @value_mapping
   * Values correspond to sorting logic in sortedAndFilteredFruits computed
   * property, maintaining consistency between UI and implementation.
   *
   * @reactive_updates
   * Automatically updates when language changes, providing seamless
   * localization without manual intervention or component rebuilding.
   */
  sortOptions = computed(() => [
    { label: this.translationService.t().home.name + ' (A-Z)', value: 'name' },
    { label: this.translationService.t().home.calories, value: 'calories' },
    {
      label: this.translationService.t().fruitDetail.protein,
      value: 'protein',
    },
    { label: this.translationService.t().home.sugar, value: 'sugar' },
  ]);
}
