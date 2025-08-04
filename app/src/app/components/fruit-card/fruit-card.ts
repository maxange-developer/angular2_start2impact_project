import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Fruit } from '../../models/fruit.model';
import { TranslationService } from '../../services/translation.service';

/**
 * FruitCard Component - Interactive Fruit Display Card
 *
 * @description
 * Reusable Angular component for displaying individual fruit information in an
 * attractive card format. Features nutritional data visualization, calorie-based
 * color coding, and interactive selection functionality with PrimeNG UI components.
 *
 * @features
 * - Responsive card layout with fruit details and nutritional information
 * - Dynamic color coding based on calorie content (green/yellow/red system)
 * - Emoji icons for visual fruit representation with extensive fruit mapping
 * - Click-to-select functionality with event emission for parent communication
 * - Accessibility-compliant design with proper ARIA labels
 * - Internationalization support through TranslationService integration
 *
 * @ui_framework PrimeNG Card, Button, and Tag components for consistent styling
 * @responsive Fully responsive design adapting to various screen sizes
 *
 * @usage
 * ```html
 * <app-fruit-card
 *   [fruit]="selectedFruit"
 *   (fruitSelected)="onFruitSelection($event)">
 * </app-fruit-card>
 * ```
 *
 * @accessibility
 * - Keyboard navigation support through PrimeNG components
 * - Screen reader compatible with semantic HTML structure
 * - Focus management for interactive elements
 *
 * @author Fruity Nutrition Development Team
 * @version 1.0.0
 * @since Angular 18.0
 */
@Component({
  selector: 'app-fruit-card',
  imports: [CommonModule, CardModule, ButtonModule, TagModule],
  templateUrl: './fruit-card.html',
  styleUrl: './fruit-card.scss',
})
export class FruitCard {
  /**
   * Fruit data input property
   *
   * @type {Fruit}
   * @required
   * @description
   * The fruit object containing all nutritional and botanical information to display
   * in the card. Must conform to the Fruit interface with complete nutritional data.
   *
   * @validation Required input - component will not function without valid fruit data
   *
   * @example
   * ```typescript
   * // Parent component
   * selectedFruit: Fruit = {
   *   name: "Apple",
   *   family: "Rosaceae",
   *   nutritions: { calories: 52, ... }
   * };
   * ```
   */
  @Input({ required: true }) fruit!: Fruit;

  /**
   * Fruit selection event emitter
   *
   * @type {EventEmitter<Fruit>}
   * @description
   * Emits the selected fruit object when the card is clicked, enabling parent
   * components to respond to fruit selection events. Used for navigation to
   * detail views or adding fruits to collections.
   *
   * @emission Triggered on card click interaction
   *
   * @example
   * ```typescript
   * // Parent component
   * onFruitSelection(fruit: Fruit) {
   *   this.router.navigate(['/fruit', fruit.name]);
   * }
   * ```
   */
  @Output() fruitSelected = new EventEmitter<Fruit>();

  /**
   * Translation service for internationalization support
   *
   * @type {TranslationService}
   * @description
   * Injected service providing reactive access to translated text content.
   * Used for displaying localized labels, nutritional information, and UI text
   * based on the user's selected language preference.
   *
   * @injection Angular dependency injection using the inject() function
   * @reactivity Automatically updates when language changes through signals
   */
  translationService = inject(TranslationService);

  /**
   * Handles card click events and emits fruit selection
   *
   * @returns {void}
   * @description
   * Event handler for card click interactions. Emits the current fruit object
   * through the fruitSelected output event, allowing parent components to respond
   * to user selections for navigation or state management.
   *
   * @user_interaction Triggered by clicking anywhere on the fruit card
   * @accessibility Keyboard accessible through PrimeNG Card component
   *
   * @example
   * ```typescript
   * // Triggered when user clicks the card
   * onCardClick() -> emits fruit object to parent
   * ```
   */
  onCardClick(): void {
    this.fruitSelected.emit(this.fruit);
  }

  /**
   * Determines card accent color based on calorie content
   *
   * @returns {string} Color code for card styling ('accent' | 'primary' | 'warn')
   * @description
   * Calculates and returns the appropriate color classification based on the fruit's
   * calorie content per 100g. Uses a three-tier system for visual categorization
   * of nutritional density.
   *
   * @color_scheme
   * - 'accent' (green): Low calories (< 50 kcal/100g) - Diet-friendly fruits
   * - 'primary' (blue): Medium calories (50-79 kcal/100g) - Moderate energy fruits
   * - 'warn' (red): High calories (≥ 80 kcal/100g) - Energy-dense fruits
   *
   * @nutritional_context
   * Helps users quickly identify fruits suitable for their dietary goals through
   * intuitive color coding without requiring detailed calorie knowledge.
   *
   * @deprecated Use getCaloriesSeverity() for PrimeNG Tag components instead
   */
  getCaloriesColor(): string {
    const calories = this.fruit.nutritions.calories;
    if (calories < 50) return 'accent';
    if (calories < 80) return 'primary';
    return 'warn';
  }

  /**
   * Determines PrimeNG tag severity based on calorie content
   *
   * @returns {'success' | 'info' | 'warn' | 'danger'} PrimeNG severity level
   * @description
   * Calculates the appropriate PrimeNG Tag severity level based on fruit calorie
   * content, providing consistent visual feedback aligned with PrimeNG design system.
   * Used for displaying calorie category badges with standardized colors.
   *
   * @severity_mapping
   * - 'success' (green): Very low calories (≤ 40 kcal/100g) - Excellent for weight management
   * - 'info' (blue): Low calories (41-80 kcal/100g) - Good dietary choice
   * - 'warn' (yellow): Medium calories (81-120 kcal/100g) - Moderate consumption
   * - 'danger' (red): High calories (> 120 kcal/100g) - Energy-dense, consume mindfully
   *
   * @ui_integration
   * Integrates seamlessly with PrimeNG Tag component severity system for
   * consistent visual language across the application interface.
   *
   * @nutritional_guidance
   * Provides immediate visual cues for users making dietary decisions based on
   * caloric content and nutritional goals.
   */
  getCaloriesSeverity(): 'success' | 'info' | 'warn' | 'danger' {
    const calories = this.fruit.nutritions.calories;
    if (calories > 120) return 'danger';
    if (calories > 80) return 'warn';
    if (calories > 40) return 'info';
    return 'success';
  }

  /**
   * Maps fruit names to corresponding emoji representations
   *
   * @returns {string} Unicode emoji character representing the fruit
   * @description
   * Comprehensive emoji mapping system that converts fruit names to visually
   * representative emoji icons. Enhances user experience with intuitive visual
   * cues and adds personality to the application interface.
   *
   * @mapping_categories
   * - Common fruits: Direct emoji mappings (🍎🍌🍊🍇🍓)
   * - Berries: Various berry emojis and placeholders (🫐🍇)
   * - Tropical fruits: Exotic fruit representations (🥭🥥🍍)
   * - Nuts: Nut-specific emojis (🌰)
   * - Special cases: Custom color-coded representations for rare fruits
   *
   * @fallback_strategy
   * Returns 🍎 (apple emoji) for any fruit not found in the mapping dictionary,
   * ensuring consistent visual representation across all fruit entries.
   *
   * @extensibility
   * Easy to extend with new fruit-emoji pairs by adding entries to the emojiMap
   * Record object. Supports both common and scientific fruit names.
   *
   * @localization_note
   * Uses case-insensitive matching to handle various name formats from the
   * FruityVice API and different language representations.
   *
   * @performance
   * O(1) lookup time through Record-based implementation for efficient
   * emoji retrieval during component rendering.
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

      // Berry family fruits with specialized representations
      blueberry: '🫐',
      blackberry: '🫐',
      raspberry: '🍇',
      cranberry: '🫐',
      lingonberry: '🫐',
      gooseberry: '🫐',

      // Exotic and tropical fruits with creative representations
      dragonfruit: '🐉',
      pitahaya: '🐉',
      papaya: '🟡',
      passionfruit: '🟡',
      lychee: '🟣',
      durian: '🟤',
      jackfruit: '🟡',
      mangosteen: '🟣',
      guava: '🟢',
      feijoa: '🟢',

      // Nuts and dried fruits
      hazelnut: '🌰',

      // Additional fruits with color-coded representations
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
}
