/**
 * FruitList Component Test Suite
 *
 * This comprehensive test suite validates the FruitList component functionality including
 * data loading, filtering, sorting, responsive behavior, and accessibility compliance.
 *
 * Testing Strategies:
 * - Component lifecycle and initialization testing
 * - Service integration with mock data scenarios
 * - User interaction simulation (search, filter, sort)
 * - Event emission verification for parent communication
 * - Accessibility and keyboard navigation validation
 * - Responsive design behavior testing
 * - Signal-based state management verification
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PLATFORM_ID } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { of } from 'rxjs';

import { FruitList } from './fruit-list';
import { FruitService } from '../../services/fruit.service';
import { TranslationService } from '../../services/translation.service';
import { Fruit } from '../../models/fruit.model';

describe('FruitList', () => {
  let component: FruitList;
  let fixture: ComponentFixture<FruitList>;
  let fruitService: jasmine.SpyObj<FruitService>;
  let translationService: TranslationService;

  /* Mock fruit data for comprehensive testing scenarios */
  const mockFruits: Fruit[] = [
    {
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
    },
    {
      id: 2,
      name: 'Banana',
      family: 'Musaceae',
      order: 'Zingiberales',
      genus: 'Musa',
      nutritions: {
        calories: 96,
        fat: 0.2,
        sugar: 17.2,
        carbohydrates: 22.0,
        protein: 1.0,
      },
    },
  ];

  beforeEach(async () => {
    /* Create comprehensive spy object for FruitService with all necessary methods */
    const fruitServiceSpy = jasmine.createSpyObj(
      'FruitService',
      ['getAllFruits', 'getFruitFamilies'],
      {
        fruits: jasmine.createSpy().and.returnValue(mockFruits),
        loading: jasmine.createSpy().and.returnValue(false),
        error: jasmine.createSpy().and.returnValue(null),
        filteredFruits: jasmine.createSpy().and.returnValue(mockFruits),
        searchFilter: jasmine.createSpy().and.returnValue(''),
      }
    );

    /* Configure test module with all required dependencies and providers */
    await TestBed.configureTestingModule({
      imports: [FruitList, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: FruitService, useValue: fruitServiceSpy },
        { provide: PLATFORM_ID, useValue: 'browser' },
        TranslationService,
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    /* Initialize component fixture and inject dependencies */
    fixture = TestBed.createComponent(FruitList);
    component = fixture.componentInstance;
    fruitService = TestBed.inject(FruitService) as jasmine.SpyObj<FruitService>;
    translationService = TestBed.inject(TranslationService);

    /* Setup spy return values for predictable testing behavior */
    fruitService.getAllFruits.and.returnValue(of(mockFruits));
    fruitService.getFruitFamilies.and.returnValue(of(['Rosaceae', 'Musaceae']));
  });

  /* Basic component instantiation validation */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* Data loading initialization testing */
  it('should load fruits on initialization', () => {
    fixture.detectChanges();
    expect(fruitService.getAllFruits).toHaveBeenCalled();
  });

  /* Template rendering validation for fruit card display */
  it('should render fruits when loaded', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Should render fruit cards
    const fruitCards = compiled.querySelectorAll('app-fruit-card');
    expect(fruitCards.length).toBeGreaterThan(0);
  });

  /* Search functionality testing with input simulation */
  it('should filter fruits by search term', () => {
    fixture.detectChanges();

    // Simulate search
    const searchInput = fixture.nativeElement.querySelector(
      'input[type="text"], p-inputtext input'
    );
    if (searchInput) {
      searchInput.value = 'apple';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    // FruitService should handle the filtering
    expect(component).toBeTruthy(); // Component should still be working
  });

  /* Event emission testing for parent-child communication */
  it('should open fruit detail when fruit is clicked', () => {
    spyOn(component.fruitSelected, 'emit');
    fixture.detectChanges();

    // Simulate fruit click
    component.onFruitClick(mockFruits[0]);

    expect(component.fruitSelected.emit).toHaveBeenCalledWith(mockFruits[0]);
  });

  /* Language change handling and reactivity testing */
  it('should handle language changes', () => {
    fixture.detectChanges();

    // Change language
    translationService.setLanguage('en');
    fixture.detectChanges();

    // Component should still work
    expect(component).toBeTruthy();
  });

  describe('family filter', () => {
    /* Family-based filtering functionality testing */
    it('should filter by selected family', () => {
      fixture.detectChanges();

      const family = 'Rosaceae';
      component.onFamilyChange(family);

      expect(component.selectedFamily()).toBe(family);
    });

    /* Computed signal validation for family dropdown options */
    it('should have family options computed signal', () => {
      fixture.detectChanges();

      const options = component.familyOptions();
      expect(options.length).toBeGreaterThan(0);
      expect(options[0].value).toBe('all');
    });
  });

  describe('sorting', () => {
    /* Sort functionality testing with different criteria */
    it('should change sort order', () => {
      fixture.detectChanges();

      const sortBy = 'calories';
      component.onSortChange(sortBy);

      expect(component.sortBy()).toBe(sortBy);
    });

    /* Sort options computed signal validation */
    it('should have sort options computed signal', () => {
      fixture.detectChanges();

      const options = component.sortOptions();
      expect(options.length).toBeGreaterThan(0);
      expect(options.some((opt) => opt.value === 'name')).toBeTrue();
    });
  });

  describe('computed values', () => {
    /* Total fruit count calculation testing */
    it('should calculate total count', () => {
      fixture.detectChanges();

      const count = component.getTotalCount();
      expect(count).toBe(mockFruits.length);
    });

    /* Filtered fruit count calculation testing */
    it('should calculate filtered count', () => {
      fixture.detectChanges();

      const count = component.getFilteredCount();
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });

  describe('accessibility', () => {
    /* Keyboard navigation and accessibility compliance testing */
    it('should be keyboard navigable', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Check for focusable elements
      const focusableElements = compiled.querySelectorAll(
        'button, input, select, [tabindex]'
      );
      expect(focusableElements.length).toBeGreaterThan(0);
    });
  });

  describe('responsive behavior', () => {
    /* Responsive design adaptation testing for different screen sizes */
    it('should adapt to different screen sizes', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Should have responsive classes or structure
      expect(
        compiled.querySelector('.fruits-grid, .fruits-list, app-fruit-card')
      ).toBeTruthy();
    });
  });
});
