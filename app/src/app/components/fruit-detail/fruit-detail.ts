import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';

import { Fruit } from '../../models/fruit.model';
import { TranslationService } from '../../services/translation.service';

/**
 * FruitDetail Component - Comprehensive Fruit Information Display
 *
 * @description
 * Advanced fruit detail component providing comprehensive nutritional analysis,
 * botanical classification, health benefits, and interactive data visualization.
 * Designed for both modal and standalone display with responsive layout and
 * accessibility features.
 *
 * @features
 * - Detailed nutritional breakdown with visual progress indicators
 * - Calorie classification system with color-coded tags
 * - Botanical taxonomy information (family, order, genus)
 * - Health benefits showcase with iconography
 * - Responsive emoji mapping for visual fruit identification
 * - Percentage-based nutritional visualization
 * - Sticky header design for optimal mobile experience
 * - Internationalization support for all text content
 *
 * @architecture
 * Uses PrimeNG component library for consistent UI elements and follows
 * Angular best practices with reactive patterns. Integrates with translation
 * service for multi-language support and maintains accessibility standards.
 *
 * @ui_components
 * - PrimeNG Card for container structure
 * - PrimeNG Button for interactive elements
 * - PrimeNG Chip for category tags
 * - PrimeNG ProgressBar for nutritional visualization
 * - PrimeNG Tag for classification badges
 * - PrimeNG Divider for content separation
 *
 * @responsive_design
 * Optimized for various screen sizes with collapsible sections and
 * adaptive layout patterns. Mobile-first approach with touch-friendly
 * interactions and readable typography scaling.
 *
 * @accessibility
 * ARIA-compliant with proper labeling, keyboard navigation support,
 * and screen reader optimization for nutritional data presentation.
 *
 * @usage
 * ```html
 * <!-- Modal usage -->
 * <app-fruit-detail
 *   [fruit]="selectedFruit"
 *   (closeDialog)="handleCloseDetail()">
 * </app-fruit-detail>
 *
 * <!-- Standalone page usage -->
 * <app-fruit-detail
 *   [fruit]="routeFruit"
 *   (closeDialog)="navigateBack()">
 * </app-fruit-detail>
 * ```
 *
 * @author Fruity Nutrition Development Team
 * @version 1.0.0
 * @since Angular 18.0
 */
@Component({
  selector: 'app-fruit-detail',
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ChipModule,
    DividerModule,
    ProgressBarModule,
    TagModule,
  ],
  templateUrl: './fruit-detail.html',
  styleUrl: './fruit-detail.scss',
})
export class FruitDetail {
  /**
   * Fruit data input property containing complete nutritional and botanical information
   *
   * @type {Fruit}
   * @required
   * @description
   * Complete fruit object containing nutritional values, botanical classification,
   * and identification data. Must conform to the Fruit interface with all
   * required nutritional properties for proper component functionality.
   *
   * @validation Required input - component will not render without valid fruit data
   * @structure Includes nutritional values, family/order/genus classification, and name/id
   *
   * @example
   * ```typescript
   * selectedFruit: Fruit = {
   *   id: 1,
   *   name: "Apple",
   *   family: "Rosaceae",
   *   order: "Rosales",
   *   genus: "Malus",
   *   nutritions: {
   *     calories: 52,
   *     protein: 0.3,
   *     fat: 0.4,
   *     carbohydrates: 11.4,
   *     sugar: 10.3
   *   }
   * };
   * ```
   */
  @Input({ required: true }) fruit!: Fruit;

  /**
   * Dialog close event emitter for modal dismissal
   *
   * @type {EventEmitter<void>}
   * @description
   * Emits when the user initiates close action through the close button or
   * other dismissal interactions. Enables parent components to handle modal
   * state management, navigation, or cleanup operations.
   *
   * @emission Triggered by close button click, escape key, or backdrop interaction
   * @usage Parent components should listen to manage modal visibility state
   *
   * @example
   * ```typescript
   * // Parent component
   * handleCloseDetail() {
   *   this.showDetailModal = false;
   *   this.selectedFruit = null;
   * }
   * ```
   */
  @Output() closeDialog = new EventEmitter<void>();

  /**
   * Translation service for internationalization support
   *
   * @protected
   * @type {TranslationService}
   * @description
   * Injected service providing reactive access to translated content for all
   * UI text, labels, and nutritional information. Protected access allows
   * template binding while maintaining proper encapsulation.
   *
   * @injection Angular dependency injection using the inject() function
   * @reactivity Automatically updates when language preference changes
   * @scope Used for nutritional labels, health benefits, and UI text
   */
  protected translationService = inject(TranslationService);

  /**
   * Component constructor - minimal initialization
   *
   * @description
   * Empty constructor following Angular best practices. All initialization
   * is handled through dependency injection and reactive patterns rather
   * than constructor logic for optimal performance and testability.
   */
  constructor() {}

  /**
   * Maps fruit names to corresponding emoji representations
   *
   * @returns {string} Unicode emoji character representing the fruit
   * @description
   * Comprehensive emoji mapping system that converts fruit names to visually
   * representative emoji icons. Enhances user experience with intuitive visual
   * cues and adds personality to the detailed fruit information display.
   *
   * @mapping_categories
   * - Common fruits: Direct emoji mappings (🍎🍌🍊🍇🍓)
   * - Berries: Various berry emojis and color representations (🫐🍇)
   * - Tropical fruits: Exotic fruit representations (🥭🥥🍍)
   * - Nuts: Nut-specific emojis (🌰)
   * - Special cases: Custom color-coded representations for rare fruits
   *
   * @fallback_strategy
   * Returns 🍎 (apple emoji) for any fruit not found in the mapping dictionary,
   * ensuring consistent visual representation across all fruit entries.
   *
   * @case_sensitivity
   * Uses toLowerCase() for case-insensitive matching to handle various name
   * formats from the FruityVice API and different input sources.
   *
   * @performance
   * O(1) lookup time through Record-based implementation for efficient
   * emoji retrieval during component rendering and updates.
   *
   * @example
   * ```typescript
   * // Returns specific emoji for known fruits
   * getFruitEmoji() // Returns "🍎" for Apple
   * getFruitEmoji() // Returns "🍌" for Banana
   * getFruitEmoji() // Returns "🍎" for unknown fruits
   * ```
   */
  getFruitEmoji(): string {
    const name = this.fruit.name.toLowerCase();
    const emojiMap: Record<string, string> = {
      // Common fruits with direct emoji representations
      apple: '🍎',
      greenapple: '🍏',
      banana: '🍌',
      orange: '🍊',
      grape: '🍇',
      strawberry: '🍓',
      cherry: '🍒',
      peach: '🍑',
      pineapple: '🍍',
      watermelon: '🍉',
      lemon: '🍋',
      kiwi: '🥝',
      kiwifruit: '🥝',
      mango: '🥭',
      avocado: '🥑',
      tomato: '🍅',
      tangerine: '🍊',
      lime: '🍋',
      pear: '🍐',
      coconut: '🥥',

      // Frutti di bosco
      blueberry: '🫐',
      blackberry: '🫐',
      raspberry: '🍇',
      cranberry: '🫐',
      lingonberry: '🫐',
      gooseberry: '🫐',

      // Frutti esotici e tropicali
      dragonfruit: '🐉',
      pitahaya: '🐉',
      papaya: '�',
      passionfruit: '🟡',
      lychee: '🟣',
      durian: '🟤',
      jackfruit: '🟡',
      mangosteen: '🟣',
      guava: '🟢',
      feijoa: '🟢',

      // Frutti secchi e noci
      hazelnut: '🌰',

      // Altri frutti
      apricot: '🍑',
      plum: '🟣',
      fig: '🟤',
      pomegranate: '🔴',
      pomelo: '🟡',
      melon: '🍈',
      persimmon: '🟠',
      'japanese persimmon': '🟠',
      'ceylon gooseberry': '🟡',
      'horned melon': '🟡',
      morus: '🟣',
      annona: '🟢',
      pumpkin: '🎃',
    };

    // Return mapped emoji or default apple emoji for unknown fruits
    return emojiMap[name] || '🍎';
  }

  /**
   * Determines calorie classification level with localized text
   *
   * @returns {string} Localized calorie level description
   * @description
   * Categorizes fruits into calorie levels using a three-tier classification
   * system with internationalized labels. Provides users with quick visual
   * assessment of caloric density for dietary planning and nutritional awareness.
   *
   * @classification_criteria
   * - Low calories: < 50 kcal/100g - Diet-friendly, low energy density
   * - Medium calories: 50-79 kcal/100g - Moderate energy, balanced nutrition
   * - High calories: ≥ 80 kcal/100g - Energy-dense, mindful consumption
   *
   * @localization
   * Returns translated text based on current language setting through
   * TranslationService integration for consistent user experience.
   *
   * @nutritional_context
   * Based on standard nutritional guidelines and dietary recommendations
   * for fruit consumption and caloric intake management.
   *
   * @example
   * ```typescript
   * // Apple (52 cal) returns "Medium Calories" or "Calorie Medie"
   * // Strawberry (32 cal) returns "Low Calories" or "Basse Calorie"
   * // Avocado (160 cal) returns "High Calories" or "Alte Calorie"
   * ```
   */
  getCaloriesLevel(): string {
    const calories = this.fruit.nutritions.calories;
    if (calories < 50)
      return this.translationService.t().fruitDetail.lowCalories;
    if (calories < 80)
      return this.translationService.t().fruitDetail.mediumCalories;
    return this.translationService.t().fruitDetail.highCalories;
  }

  /**
   * Determines PrimeNG tag color severity based on calorie content
   *
   * @returns {string} PrimeNG severity level ('success' | 'info' | 'warning')
   * @description
   * Calculates appropriate PrimeNG Tag severity level for visual calorie
   * classification. Integrates with PrimeNG design system to provide
   * consistent color coding for nutritional information display.
   *
   * @color_mapping
   * - 'success' (green): Low calories (< 50 kcal/100g) - Healthy choice indicator
   * - 'info' (blue): Medium calories (50-79 kcal/100g) - Balanced nutrition indicator
   * - 'warning' (amber): High calories (≥ 80 kcal/100g) - Mindful consumption indicator
   *
   * @ui_integration
   * Works seamlessly with PrimeNG Tag component severity system for
   * consistent visual language and accessibility compliance across
   * the application interface.
   *
   * @accessibility
   * Color coding is supplemented with text labels to ensure information
   * is accessible to users with color vision differences.
   *
   * @example
   * ```typescript
   * // Low calorie fruits return 'success' (green tag)
   * // Medium calorie fruits return 'info' (blue tag)
   * // High calorie fruits return 'warning' (amber tag)
   * ```
   */
  getCaloriesColor(): string {
    const calories = this.fruit.nutritions.calories;
    if (calories < 50) return 'success';
    if (calories < 80) return 'info';
    return 'warning';
  }

  /**
   * Categorizes sugar content levels for dietary awareness
   *
   * @returns {string} Sugar level classification ('Low' | 'Medium' | 'High')
   * @description
   * Provides sugar content classification using established nutritional
   * guidelines for fruit sugar content. Helps users make informed dietary
   * choices based on sugar intake preferences and health requirements.
   *
   * @classification_system
   * - Low: < 8g sugar/100g - Minimal sugar impact, suitable for low-sugar diets
   * - Medium: 8-14g sugar/100g - Moderate sugar content, balanced consumption
   * - High: ≥ 15g sugar/100g - High natural sugar, mindful portioning recommended
   *
   * @nutritional_basis
   * Based on natural fruit sugar content ranges and dietary recommendation
   * guidelines for daily sugar intake from natural sources.
   *
   * @health_context
   * Natural fruit sugars differ from added sugars but awareness supports
   * informed nutritional choices for diabetes management, weight control,
   * and overall dietary balance.
   *
   * @localization_note
   * Currently returns English labels - could be extended for full
   * internationalization if needed for sugar level descriptions.
   *
   * @example
   * ```typescript
   * // Lime (1.7g) returns "Low"
   * // Apple (10.3g) returns "Medium"
   * // Grape (16.2g) returns "High"
   * ```
   */
  getSugarLevel(): string {
    const sugar = this.fruit.nutritions.sugar;
    if (sugar < 8) return 'Low';
    if (sugar < 15) return 'Medium';
    return 'High';
  }

  /**
   * Handles modal close action and emits dismissal event
   *
   * @returns {void}
   * @description
   * Triggers the close dialog event emission to notify parent components
   * of user's intent to dismiss the fruit detail view. Enables proper
   * modal state management and navigation flow control.
   *
   * @event_flow
   * User action (close button click) → onClose() → closeDialog.emit() →
   * Parent component handles modal dismissal and state cleanup
   *
   * @user_interactions
   * - Close button click in modal header
   * - Escape key press (if implemented in parent)
   * - Backdrop click dismissal (if implemented in parent)
   *
   * @parent_responsibility
   * Parent components should handle the emitted event to:
   * - Hide the modal/dialog
   * - Reset selected fruit state
   * - Perform any necessary cleanup
   * - Update navigation state
   *
   * @example
   * ```typescript
   * // In parent component template
   * (closeDialog)="handleCloseDetail()"
   *
   * // In parent component
   * handleCloseDetail() {
   *   this.showDetailModal = false;
   *   this.selectedFruit = null;
   * }
   * ```
   */
  onClose(): void {
    this.closeDialog.emit();
  }

  /**
   * Calculates protein content percentage for progress bar visualization
   *
   * @returns {number} Protein percentage value (0-100)
   * @description
   * Converts protein content from grams per 100g to percentage representation
   * for visual display in progress bars. Caps the value at 100% to prevent
   * visual overflow in progress bar components.
   *
   * @calculation_logic
   * Since nutritional values are already per 100g, the gram value directly
   * represents the percentage (e.g., 3.4g per 100g = 3.4%)
   *
   * @visual_context
   * Used with PrimeNG ProgressBar to show relative protein content.
   * Most fruits have low protein content (0.1-2.0g), making small
   * differences visually apparent in the progress representation.
   *
   * @boundary_handling
   * Math.min() ensures values never exceed 100% for consistent UI behavior,
   * though fruit protein content rarely approaches this limit.
   *
   * @example
   * ```typescript
   * // Apple (0.3g protein) returns 0.3
   * // Avocado (2.0g protein) returns 2.0
   * // Hypothetical high-protein fruit (120g) returns 100
   * ```
   */
  getProteinPercentage(): number {
    // Direct percentage since values are already per 100g
    return Math.min(this.fruit.nutritions.protein, 100);
  }

  /**
   * Calculates carbohydrate content percentage for progress bar visualization
   *
   * @returns {number} Carbohydrate percentage value (0-100)
   * @description
   * Converts carbohydrate content from grams per 100g to percentage representation
   * for visual display in progress bars. Provides visual context for the primary
   * macronutrient in most fruits.
   *
   * @nutritional_significance
   * Carbohydrates are typically the dominant macronutrient in fruits,
   * ranging from 5-25g per 100g. Visual representation helps users
   * understand energy composition and dietary impact.
   *
   * @calculation_methodology
   * Direct conversion since API data is already normalized to per 100g values,
   * making gram values equivalent to percentage representation.
   *
   * @ui_integration
   * Works with color-coded progress bars to show carbohydrate proportion
   * relative to other macronutrients in the fruit detail display.
   *
   * @example
   * ```typescript
   * // Lime (5.2g carbs) returns 5.2
   * // Apple (11.4g carbs) returns 11.4
   * // Banana (22.0g carbs) returns 22.0
   * ```
   */
  getCarbsPercentage(): number {
    // Direct percentage since values are already per 100g
    return Math.min(this.fruit.nutritions.carbohydrates, 100);
  }

  /**
   * Calculates fat content percentage for progress bar visualization
   *
   * @returns {number} Fat percentage value (0-100)
   * @description
   * Converts fat content from grams per 100g to percentage representation
   * for visual display in progress bars. Most fruits have minimal fat content,
   * making this visualization useful for identifying exceptions like avocados.
   *
   * @nutritional_context
   * Most fruits contain very low fat content (0.1-0.5g per 100g), with
   * notable exceptions like avocados (14.7g) and coconuts. Visual representation
   * helps identify these nutritional outliers.
   *
   * @visualization_purpose
   * Low values create subtle progress bars for typical fruits, while
   * high-fat fruits like avocados show prominent visual indicators,
   * supporting informed dietary choices.
   *
   * @boundary_protection
   * Math.min() caps values at 100% to maintain consistent progress bar
   * behavior across all fruit types and edge cases.
   *
   * @example
   * ```typescript
   * // Apple (0.4g fat) returns 0.4
   * // Strawberry (0.3g fat) returns 0.3
   * // Avocado (14.7g fat) returns 14.7
   * ```
   */
  getFatPercentage(): number {
    // Direct percentage since values are already per 100g
    return Math.min(this.fruit.nutritions.fat, 100);
  }

  /**
   * Calculates sugar content percentage for progress bar visualization
   *
   * @returns {number} Sugar percentage value (0-100)
   * @description
   * Converts sugar content from grams per 100g to percentage representation
   * for visual display in progress bars. Provides immediate visual feedback
   * for sugar content assessment and dietary planning.
   *
   * @dietary_importance
   * Sugar content is a key consideration for diabetes management, weight
   * control, and overall dietary balance. Visual representation enables
   * quick assessment without requiring numerical interpretation.
   *
   * @content_range
   * Fruit sugar content typically ranges from 1-20g per 100g, with
   * citrus fruits on the lower end and grapes/dates on the higher end.
   * Progress bars make these differences immediately apparent.
   *
   * @natural_vs_added
   * Represents natural fruit sugars only, which have different metabolic
   * impacts compared to added sugars, though awareness remains important
   * for comprehensive nutritional understanding.
   *
   * @example
   * ```typescript
   * // Lime (1.7g sugar) returns 1.7
   * // Apple (10.3g sugar) returns 10.3
   * // Grape (16.2g sugar) returns 16.2
   * ```
   */
  getSugarPercentage(): number {
    // Direct percentage since values are already per 100g
    return Math.min(this.fruit.nutritions.sugar, 100);
  }
}
