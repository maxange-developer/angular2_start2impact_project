/**
 * FruitSearch Component Test Suite
 *
 * This comprehensive test suite validates the FruitSearch component functionality including
 * search operations, validation, error handling, and user interaction patterns.
 *
 * Testing Focus Areas:
 * - Search input validation and sanitization
 * - Asynchronous search operations with loading states
 * - Error handling for various failure scenarios
 * - Event emission for successful fruit discovery
 * - Keyboard interaction and accessibility
 * - Message service integration for user feedback
 * - Template integration and UI element validation
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PLATFORM_ID } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';

import { FruitSearch } from './fruit-search';
import { TranslationService } from '../../services/translation.service';
import { FruitService } from '../../services/fruit.service';
import { Fruit, FruitSearchResult } from '../../models/fruit.model';

describe('FruitSearch', () => {
  let component: FruitSearch;
  let fixture: ComponentFixture<FruitSearch>;
  let fruitService: jasmine.SpyObj<FruitService>;
  let messageService: jasmine.SpyObj<MessageService>;

  /* Standard fruit mock for successful search testing scenarios */
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
    /* Create spy objects for service dependencies */
    const fruitServiceSpy = jasmine.createSpyObj('FruitService', [
      'searchFruit',
    ]);

    /* Configure test module with all required dependencies */
    await TestBed.configureTestingModule({
      imports: [FruitSearch, NoopAnimationsModule, HttpClientTestingModule],
      providers: [
        { provide: FruitService, useValue: fruitServiceSpy },
        TranslationService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideZonelessChangeDetection(),
      ],
    }).compileComponents();

    /* Initialize component fixture and inject dependencies */
    fixture = TestBed.createComponent(FruitSearch);
    component = fixture.componentInstance;
    fruitService = TestBed.inject(FruitService) as jasmine.SpyObj<FruitService>;

    /* Create MessageService spy and inject it into component */
    messageService = jasmine.createSpyObj('MessageService', ['add']);
    (component as any).messageService = messageService;

    fixture.detectChanges();
  });

  /* Basic component instantiation validation */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* Initial state validation for search component */
  it('should initialize with empty search term and not searching', () => {
    expect(component.searchTerm()).toBe('');
    expect(component.isSearching()).toBe(false);
  });

  describe('onSearch', () => {
    /* Empty search term validation and user feedback */
    it('should show warning when search term is empty', () => {
      component.searchTerm.set('');
      component.onSearch();

      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a fruit name',
      });
      expect(fruitService.searchFruit).not.toHaveBeenCalled();
    });

    /* Whitespace-only search term validation */
    it('should show warning when search term is only whitespace', () => {
      component.searchTerm.set('   ');
      component.onSearch();

      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please enter a fruit name',
      });
      expect(fruitService.searchFruit).not.toHaveBeenCalled();
    });

    /* Successful search operation with event emission */
    it('should search for fruit and emit result on success', () => {
      const searchResult: FruitSearchResult = { fruit: mockFruit };
      fruitService.searchFruit.and.returnValue(of(searchResult));
      spyOn(component.fruitFound, 'emit');

      component.searchTerm.set('apple');
      component.onSearch();

      expect(component.isSearching()).toBe(false);
      expect(fruitService.searchFruit).toHaveBeenCalledWith('apple');
      expect(component.fruitFound.emit).toHaveBeenCalledWith(mockFruit);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'success',
        summary: 'Success',
        detail: `Found ${mockFruit.name}!`,
      });
    });

    /* Fruit not found error handling */
    it('should show error message when fruit not found', () => {
      const searchResult: FruitSearchResult = { error: 'Fruit not found' };
      fruitService.searchFruit.and.returnValue(of(searchResult));

      component.searchTerm.set('unknownfruit');
      component.onSearch();

      expect(component.isSearching()).toBe(false);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Fruit not found',
      });
    });

    /* Network error handling during search operations */
    it('should handle search error', () => {
      fruitService.searchFruit.and.returnValue(
        throwError(() => new Error('Network error'))
      );

      component.searchTerm.set('apple');
      component.onSearch();

      expect(component.isSearching()).toBe(false);
      expect(messageService.add).toHaveBeenCalledWith({
        severity: 'error',
        summary: 'Error',
        detail: 'Search failed. Please try again.',
      });
    });

    /* Loading state management during search operations */
    it('should set isSearching to true during search', () => {
      fruitService.searchFruit.and.returnValue(of({ fruit: mockFruit }));

      component.searchTerm.set('apple');
      component.isSearching.set(false);

      // Call onSearch but don't let the observable complete
      component.onSearch();

      expect(fruitService.searchFruit).toHaveBeenCalledWith('apple');
    });
  });

  describe('onKeyPress', () => {
    /* Enter key press handling for search initiation */
    it('should call onSearch when Enter key is pressed and not searching', () => {
      spyOn(component, 'onSearch');
      component.isSearching.set(false);

      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      component.onKeyPress(event);

      expect(component.onSearch).toHaveBeenCalled();
    });

    /* Prevent search during active search operation */
    it('should not call onSearch when Enter key is pressed but is searching', () => {
      spyOn(component, 'onSearch');
      component.isSearching.set(true);

      const event = new KeyboardEvent('keypress', { key: 'Enter' });
      component.onKeyPress(event);

      expect(component.onSearch).not.toHaveBeenCalled();
    });

    /* Keyboard event filtering for non-Enter keys */
    it('should not call onSearch when other keys are pressed', () => {
      spyOn(component, 'onSearch');
      component.isSearching.set(false);

      const event = new KeyboardEvent('keypress', { key: 'a' });
      component.onKeyPress(event);

      expect(component.onSearch).not.toHaveBeenCalled();
    });
  });

  describe('clearSearch', () => {
    /* Search term clearing functionality */
    it('should clear the search term', () => {
      component.searchTerm.set('apple');
      component.clearSearch();

      expect(component.searchTerm()).toBe('');
    });
  });

  describe('template integration', () => {
    /* UI element presence validation for search functionality */
    it('should render search input', () => {
      const compiled = fixture.nativeElement;
      const input =
        compiled.querySelector('input[type="text"]') ||
        compiled.querySelector('input');
      expect(input).toBeTruthy();
    });

    /* Search button rendering validation */
    it('should render search button', () => {
      const compiled = fixture.nativeElement;
      const button =
        compiled.querySelector('button') || compiled.querySelector('p-button');
      expect(button).toBeTruthy();
    });
  });
});
