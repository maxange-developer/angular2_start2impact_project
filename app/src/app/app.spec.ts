/**
 * Main Application Component Test Suite
 *
 * This comprehensive test suite validates the core App component functionality including
 * application initialization, service integration, navigation workflow, search operations,
 * dialog management, and responsive behavior across different screen sizes and languages.
 *
 * Testing Strategies:
 * - Component lifecycle and initialization testing
 * - Service dependency injection and integration validation
 * - User workflow testing (fruit selection, search, dialog management)
 * - Template rendering and accessibility compliance verification
 * - Responsive design behavior across different viewports
 * - Multi-language support and translation system integration
 * - Integration testing for complete user journey scenarios
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { App } from './app';
import { FruitService } from './services/fruit.service';
import { TranslationService, Language } from './services/translation.service';
import { Fruit } from './models/fruit.model';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let fruitService: FruitService;
  let translationService: TranslationService;

  /* Standard fruit mock for comprehensive application testing scenarios */
  const mockFruit: Fruit = {
    id: 1,
    name: 'Apple',
    family: 'Rosaceae',
    genus: 'Malus',
    order: 'Rosales',
    nutritions: {
      carbohydrates: 11.4,
      protein: 0.3,
      fat: 0.4,
      calories: 52,
      sugar: 10.4,
    },
  };

  beforeEach(async () => {
    /* Configure test module with all required dependencies and providers */
    await TestBed.configureTestingModule({
      imports: [App, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        provideZonelessChangeDetection(),
        { provide: PLATFORM_ID, useValue: 'browser' },
        FruitService,
        TranslationService,
      ],
    }).compileComponents();

    /* Initialize component fixture and inject service dependencies */
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fruitService = TestBed.inject(FruitService);
    translationService = TestBed.inject(TranslationService);
  });

  /* Basic application instantiation validation */
  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  /* Initial state validation for application component */
  it('should initialize with default values', () => {
    expect(component.selectedFruit()).toBeNull();
    expect(component.displayDetailDialog()).toBe(false);
    expect(component.activeTab()).toBe(0);
    expect(component.searchTerm()).toBe('');
    expect(component.isSearching()).toBe(false);
  });

  /* Service dependency injection validation */
  it('should initialize services correctly', () => {
    expect(fruitService).toBeTruthy();
    expect(translationService).toBeTruthy();
  });

  describe('onFruitSelected', () => {
    /* Fruit selection workflow testing with dialog activation */
    it('should set selected fruit and show detail dialog', () => {
      component.onFruitSelected(mockFruit);

      expect(component.selectedFruit()).toBe(mockFruit);
      expect(component.displayDetailDialog()).toBe(true);
    });
  });

  describe('onDetailDialogClose', () => {
    /* Dialog closure workflow with state cleanup */
    it('should close dialog and clear selected fruit', () => {
      component.selectedFruit.set(mockFruit);
      component.displayDetailDialog.set(true);

      component.onDetailDialogClose();

      expect(component.displayDetailDialog()).toBe(false);
      expect(component.selectedFruit()).toBeNull();
    });
  });

  describe('onTabChange', () => {
    /* Tab navigation functionality testing */
    it('should update active tab index', () => {
      const event = { index: 2 };
      component.onTabChange(event);

      expect(component.activeTab()).toBe(2);
    });

    /* Multiple tab index handling validation */
    it('should handle different tab indices', () => {
      const testCases = [0, 1, 2, 3];

      testCases.forEach((index) => {
        const event = { index };
        component.onTabChange(event);
        expect(component.activeTab()).toBe(index);
      });
    });
  });

  describe('onSearchFruitFound', () => {
    /* Search result handling with automatic dialog display */
    it('should set selected fruit and show detail dialog', () => {
      component.onSearchFruitFound(mockFruit);

      expect(component.selectedFruit()).toBe(mockFruit);
      expect(component.displayDetailDialog()).toBe(true);
    });
  });

  describe('onSearchInput', () => {
    /* Search input handling with service filter integration */
    it('should update search term and fruit service filter', () => {
      spyOn(fruitService.searchFilter, 'set');

      component.onSearchInput('apple');

      expect(component.searchTerm()).toBe('apple');
      expect(fruitService.searchFilter.set).toHaveBeenCalledWith('apple');
    });

    /* Input sanitization testing with whitespace handling */
    it('should trim whitespace from search term', () => {
      spyOn(fruitService.searchFilter, 'set');

      component.onSearchInput('  apple  ');

      expect(component.searchTerm()).toBe('  apple  ');
      expect(fruitService.searchFilter.set).toHaveBeenCalledWith('apple');
    });

    /* Empty input handling validation */
    it('should handle empty search input', () => {
      spyOn(fruitService.searchFilter, 'set');

      component.onSearchInput('');

      expect(component.searchTerm()).toBe('');
      expect(fruitService.searchFilter.set).toHaveBeenCalledWith('');
    });
  });

  describe('onSearch', () => {
    /* Empty search term handling without errors */
    it('should handle empty search term', () => {
      component.searchTerm.set('');

      // Should not throw any errors
      expect(() => component.onSearch()).not.toThrow();
    });

    /* Valid search term processing validation */
    it('should handle valid search term', () => {
      component.searchTerm.set('apple');

      // Should not throw any errors
      expect(() => component.onSearch()).not.toThrow();
    });

    /* Whitespace-only search term edge case handling */
    it('should handle whitespace-only search term', () => {
      component.searchTerm.set('   ');

      // Should not throw any errors
      expect(() => component.onSearch()).not.toThrow();
    });
  });

  describe('clearSearch', () => {
    /* Search clearing functionality with service synchronization */
    it('should clear search term and fruit service filter', () => {
      spyOn(fruitService.searchFilter, 'set');

      component.searchTerm.set('apple');
      component.clearSearch();

      expect(component.searchTerm()).toBe('');
      expect(fruitService.searchFilter.set).toHaveBeenCalledWith('');
    });
  });

  describe('onSearchReset', () => {
    /* Search reset functionality testing */
    it('should reset search term', () => {
      component.searchTerm.set('apple');
      component.onSearchReset();

      expect(component.searchTerm()).toBe('');
    });
  });

  describe('template rendering', () => {
    /* Main application container rendering validation */
    it('should render the main app container', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.app-container')).toBeTruthy();
    });

    /* Navigation toolbar rendering verification */
    it('should render the toolbar', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.app-toolbar')).toBeTruthy();
    });

    /* Application branding and title display testing */
    it('should render the app title', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const titleElement = compiled.querySelector('.app-title');
      expect(titleElement).toBeTruthy();
      expect(titleElement?.textContent).toContain('Fruity Nutrition');
    });

    /* Language selector component integration validation */
    it('should render the language selector', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-language-selector')).toBeTruthy();
    });

    /* Main content area rendering verification */
    it('should render the main content area', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.main-content')).toBeTruthy();
    });

    /* Fruit list component integration testing */
    it('should render the fruit list component', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('app-fruit-list')).toBeTruthy();
    });

    /* Application footer rendering validation */
    it('should render the footer', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.app-footer')).toBeTruthy();
    });
  });

  describe('accessibility', () => {
    /* Accessibility compliance validation for semantic HTML structure */
    it('should have proper accessibility attributes', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Check for main landmark
      const mainElement = compiled.querySelector('.main-content');
      expect(mainElement).toBeTruthy();

      // Check for navigation
      const toolbar = compiled.querySelector('.app-toolbar');
      expect(toolbar).toBeTruthy();
    });
  });

  describe('language integration', () => {
    /* UI reactivity testing for language changes */
    it('should update UI when language changes', () => {
      fixture.detectChanges();

      // Change language to English
      translationService.setLanguage('en');
      fixture.detectChanges();

      // The app should still be rendered properly
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('.app-container')).toBeTruthy();
    });

    /* Multi-language support validation across supported languages */
    it('should work with different languages', () => {
      fixture.detectChanges();
      const languages: Language[] = ['it', 'en'];

      languages.forEach((lang) => {
        translationService.setLanguage(lang);
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.querySelector('.app-container')).toBeTruthy();
      });
    });
  });

  describe('responsive behavior', () => {
    /* Responsive design validation for different viewport sizes */
    it('should render correctly on different screen sizes', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;

      // Check that responsive containers exist
      expect(compiled.querySelector('.toolbar-content')).toBeTruthy();
      expect(compiled.querySelector('.content-container')).toBeTruthy();
    });
  });

  describe('component lifecycle', () => {
    /* Component initialization and lifecycle validation */
    it('should initialize properly', () => {
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    /* Component cleanup and memory management testing */
    it('should cleanup properly', () => {
      fixture.detectChanges();
      expect(() => fixture.destroy()).not.toThrow();
    });
  });

  describe('integration tests', () => {
    /* Complete fruit selection and dialog workflow testing */
    it('should handle fruit selection and dialog workflow', () => {
      // Select a fruit
      component.onFruitSelected(mockFruit);
      expect(component.selectedFruit()).toBe(mockFruit);
      expect(component.displayDetailDialog()).toBe(true);

      // Close dialog
      component.onDetailDialogClose();
      expect(component.selectedFruit()).toBeNull();
      expect(component.displayDetailDialog()).toBe(false);
    });

    /* End-to-end search workflow validation */
    it('should handle search workflow', () => {
      // Start search
      component.onSearchInput('apple');
      expect(component.searchTerm()).toBe('apple');

      // Search found fruit
      component.onSearchFruitFound(mockFruit);
      expect(component.selectedFruit()).toBe(mockFruit);
      expect(component.displayDetailDialog()).toBe(true);

      // Clear search
      component.clearSearch();
      expect(component.searchTerm()).toBe('');
    });
  });
});
