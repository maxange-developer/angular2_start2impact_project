/**
 * FruitDetail Component Test Suite
 *
 * This test suite provides comprehensive testing for the FruitDetail modal component,
 * covering detailed nutritional analysis, emoji mapping, calorie classification,
 * percentage calculations, and modal interaction patterns.
 *
 * Testing Focus Areas:
 * - Modal component lifecycle and initialization
 * - Nutritional data processing and percentage calculations
 * - Calorie and sugar level classification systems
 * - Event handling for modal close operations
 * - Template integration and accessibility features
 * - Edge case handling for extreme nutritional values
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PLATFORM_ID } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';

import { FruitDetail } from './fruit-detail';
import { TranslationService } from '../../services/translation.service';
import { Fruit } from '../../models/fruit.model';

describe('FruitDetail', () => {
  let component: FruitDetail;
  let fixture: ComponentFixture<FruitDetail>;
  let translationService: TranslationService;

  /* Standard fruit mock for baseline testing scenarios */
  const mockFruit: Fruit = {
    id: 1,
    name: 'Apple',
    family: 'Rosaceae',
    order: 'Rosales',
    genus: 'Malus',
    nutritions: {
      calories: 52,
      fat: 0.4,
      sugar: 10.3,
      carbohydrates: 11.4,
      protein: 0.3,
    },
  };

  /* High-calorie fruit for testing upper classification thresholds */
  const mockHighCalorieFruit: Fruit = {
    id: 2,
    name: 'Avocado',
    family: 'Lauraceae',
    order: 'Laurales',
    genus: 'Persea',
    nutritions: {
      calories: 160,
      fat: 14.7,
      sugar: 0.7,
      carbohydrates: 8.5,
      protein: 2.0,
    },
  };

  /* Low-calorie fruit for testing lower classification boundaries */
  const mockLowCalorieFruit: Fruit = {
    id: 3,
    name: 'Strawberry',
    family: 'Rosaceae',
    order: 'Rosales',
    genus: 'Fragaria',
    nutritions: {
      calories: 32,
      fat: 0.3,
      sugar: 4.9,
      carbohydrates: 7.7,
      protein: 0.7,
    },
  };

  beforeEach(async () => {
    /* Configure test environment with Angular testing utilities and dependencies */
    await TestBed.configureTestingModule({
      imports: [FruitDetail, NoopAnimationsModule],
      providers: [
        TranslationService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    /* Initialize component fixture with proper dependency injection */
    fixture = TestBed.createComponent(FruitDetail);
    component = fixture.componentInstance;
    translationService = TestBed.inject(TranslationService);
    component.fruit = mockFruit;
    fixture.detectChanges();
  });

  /* Basic component instantiation test */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* Input validation testing for required fruit data */
  it('should require fruit input', () => {
    expect(component.fruit).toEqual(mockFruit);
  });

  describe('getFruitEmoji', () => {
    /* Emoji mapping functionality for visual fruit identification */
    it('should return correct emoji for apple', () => {
      component.fruit = { ...mockFruit, name: 'Apple' };
      expect(component.getFruitEmoji()).toBe('🍎');
    });

    /* Banana emoji mapping test */
    it('should return correct emoji for banana', () => {
      component.fruit = { ...mockFruit, name: 'Banana' };
      expect(component.getFruitEmoji()).toBe('🍌');
    });

    /* Comprehensive emoji mapping validation for all supported fruits */
    it('should return correct emoji for various fruits', () => {
      const fruitEmojiTests = [
        { name: 'Orange', emoji: '🍊' },
        { name: 'Grape', emoji: '🍇' },
        { name: 'Strawberry', emoji: '🍓' },
        { name: 'Cherry', emoji: '🍒' },
        { name: 'Peach', emoji: '🍑' },
        { name: 'Pineapple', emoji: '🍍' },
        { name: 'Watermelon', emoji: '🍉' },
        { name: 'Lemon', emoji: '🍋' },
        { name: 'GreenApple', emoji: '🍏' },
        { name: 'Tomato', emoji: '🍅' },
        { name: 'Pear', emoji: '🍐' },
        { name: 'Dragonfruit', emoji: '🐉' },
        { name: 'Pomegranate', emoji: '🔴' },
        { name: 'Melon', emoji: '🍈' },
        { name: 'Pumpkin', emoji: '🎃' },
      ];

      fruitEmojiTests.forEach(({ name, emoji }) => {
        component.fruit = { ...mockFruit, name };
        expect(component.getFruitEmoji()).toBe(emoji);
      });
    });

    /* Case sensitivity handling in emoji mapping */
    it('should return case insensitive emoji for fruits', () => {
      component.fruit = { ...mockFruit, name: 'APPLE' };
      expect(component.getFruitEmoji()).toBe('🍎');

      component.fruit = { ...mockFruit, name: 'banana' };
      expect(component.getFruitEmoji()).toBe('🍌');

      component.fruit = { ...mockFruit, name: 'OrAnGe' };
      expect(component.getFruitEmoji()).toBe('🍊');
    });

    /* Fallback emoji handling for unmapped fruit names */
    it('should return default emoji for unknown fruits', () => {
      component.fruit = { ...mockFruit, name: 'UnknownFruit' };
      expect(component.getFruitEmoji()).toBe('🍎');
    });
  });

  describe('getCaloriesLevel', () => {
    /* Low calorie classification testing (under 50 calories) */
    it('should return low calories for fruits under 50 calories', () => {
      component.fruit = mockLowCalorieFruit;
      const result = component.getCaloriesLevel();
      expect(result).toBe(translationService.t().fruitDetail.lowCalories);
    });

    /* Medium calorie classification testing (50-79 calories) */
    it('should return medium calories for fruits between 50-79 calories', () => {
      component.fruit = mockFruit; // 52 calories
      const result = component.getCaloriesLevel();
      expect(result).toBe(translationService.t().fruitDetail.mediumCalories);
    });

    /* High calorie classification testing (80+ calories) */
    it('should return high calories for fruits with 80+ calories', () => {
      component.fruit = mockHighCalorieFruit; // 160 calories
      const result = component.getCaloriesLevel();
      expect(result).toBe(translationService.t().fruitDetail.highCalories);
    });

    /* Boundary value testing for exact calorie thresholds */
    it('should handle edge cases', () => {
      // Exactly 50 calories
      component.fruit = {
        ...mockFruit,
        nutritions: { ...mockFruit.nutritions, calories: 50 },
      };
      expect(component.getCaloriesLevel()).toBe(
        translationService.t().fruitDetail.mediumCalories
      );

      // Exactly 80 calories
      component.fruit = {
        ...mockFruit,
        nutritions: { ...mockFruit.nutritions, calories: 80 },
      };
      expect(component.getCaloriesLevel()).toBe(
        translationService.t().fruitDetail.highCalories
      );
    });
  });

  describe('getCaloriesColor', () => {
    /* Color mapping for calorie levels - visual feedback system */
    it('should return success color for low calories', () => {
      component.fruit = mockLowCalorieFruit;
      expect(component.getCaloriesColor()).toBe('success');
    });

    /* Medium calorie color mapping */
    it('should return info color for medium calories', () => {
      component.fruit = mockFruit;
      expect(component.getCaloriesColor()).toBe('info');
    });

    /* High calorie warning color mapping */
    it('should return warning color for high calories', () => {
      component.fruit = mockHighCalorieFruit;
      expect(component.getCaloriesColor()).toBe('warning');
    });
  });

  describe('getSugarLevel', () => {
    /* Low sugar classification testing (under 8g) */
    it('should return Low for sugar under 8', () => {
      component.fruit = {
        ...mockFruit,
        nutritions: { ...mockFruit.nutritions, sugar: 5 },
      };
      expect(component.getSugarLevel()).toBe('Low');
    });

    /* Medium sugar classification testing (8-14g) */
    it('should return Medium for sugar between 8-14', () => {
      component.fruit = mockFruit; // 10.3 sugar
      expect(component.getSugarLevel()).toBe('Medium');
    });

    /* High sugar classification testing (15g+) */
    it('should return High for sugar 15+', () => {
      component.fruit = {
        ...mockFruit,
        nutritions: { ...mockFruit.nutritions, sugar: 20 },
      };
      expect(component.getSugarLevel()).toBe('High');
    });

    /* Sugar level boundary testing for exact thresholds */
    it('should handle edge cases', () => {
      // Exactly 8 sugar
      component.fruit = {
        ...mockFruit,
        nutritions: { ...mockFruit.nutritions, sugar: 8 },
      };
      expect(component.getSugarLevel()).toBe('Medium');

      // Exactly 15 sugar
      component.fruit = {
        ...mockFruit,
        nutritions: { ...mockFruit.nutritions, sugar: 15 },
      };
      expect(component.getSugarLevel()).toBe('High');
    });
  });

  describe('onClose', () => {
    /* Modal close event emission testing */
    it('should emit closeDialog event', () => {
      spyOn(component.closeDialog, 'emit');

      component.onClose();

      expect(component.closeDialog.emit).toHaveBeenCalled();
    });
  });

  describe('nutrition percentage calculations', () => {
    /* Setup test fruit with specific nutritional values for percentage testing */
    beforeEach(() => {
      component.fruit = {
        ...mockFruit,
        nutritions: {
          protein: 5.5,
          carbohydrates: 25.0,
          fat: 2.3,
          sugar: 15.8,
          calories: 100,
        },
      };
    });

    /* Protein percentage calculation validation */
    it('should calculate protein percentage correctly', () => {
      expect(component.getProteinPercentage()).toBe(5.5);
    });

    /* Carbohydrates percentage calculation validation */
    it('should calculate carbs percentage correctly', () => {
      expect(component.getCarbsPercentage()).toBe(25.0);
    });

    /* Fat percentage calculation validation */
    it('should calculate fat percentage correctly', () => {
      expect(component.getFatPercentage()).toBe(2.3);
    });

    /* Sugar percentage calculation validation */
    it('should calculate sugar percentage correctly', () => {
      expect(component.getSugarPercentage()).toBe(15.8);
    });

    /* Edge case testing for percentage calculation limits */
    it('should limit percentages to maximum 100', () => {
      component.fruit = {
        ...mockFruit,
        nutritions: {
          protein: 150,
          carbohydrates: 200,
          fat: 120,
          sugar: 180,
          calories: 100,
        },
      };

      expect(component.getProteinPercentage()).toBe(100);
      expect(component.getCarbsPercentage()).toBe(100);
      expect(component.getFatPercentage()).toBe(100);
      expect(component.getSugarPercentage()).toBe(100);
    });
  });

  describe('template integration', () => {
    /* Template rendering validation for fruit identification */
    it('should render fruit name', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('Apple');
    });

    /* Nutritional data display verification */
    it('should render nutritional information', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      expect(compiled.textContent).toContain('52'); // calories
    });

    /* UI element presence validation */
    it('should render close button', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const closeButton = compiled.querySelector('button');
      expect(closeButton).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    /* Button accessibility compliance testing */
    it('should have proper button accessibility', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const buttons = compiled.querySelectorAll('button');

      buttons.forEach((button: HTMLButtonElement) => {
        expect(button.type).toBe('button');
      });
    });
  });
});
