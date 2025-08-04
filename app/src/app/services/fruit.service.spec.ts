/**
 * FruitService Test Suite
 *
 * This comprehensive test suite validates the FruitService functionality including
 * HTTP operations, caching mechanisms, signal-based state management, error handling,
 * and data filtering capabilities.
 *
 * Testing Strategies:
 * - HTTP client testing with mock responses and error scenarios
 * - Caching behavior validation for performance optimization
 * - Signal-based reactive state management testing
 * - Data filtering and search functionality validation
 * - Error handling for various failure scenarios (network, server, not found)
 * - Edge case testing for boundary conditions and invalid inputs
 */

import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { FruitService } from './fruit.service';
import { Fruit } from '../models/fruit.model';

describe('FruitService', () => {
  let service: FruitService;
  let httpMock: HttpTestingController;

  /* Standard fruit mock for basic testing scenarios */
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

  /* Multiple fruits mock for comprehensive filtering and collection testing */
  const mockFruits: Fruit[] = [
    mockFruit,
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

  beforeEach(() => {
    /* Configure test module with HTTP testing utilities and zoneless change detection */
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FruitService, provideZonelessChangeDetection()],
    });
    service = TestBed.inject(FruitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  /* Verify that no outstanding HTTP requests remain after each test */
  afterEach(() => {
    httpMock.verify();
  });

  /* Basic service instantiation validation */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllFruits', () => {
    /* Successful fruit fetching with signal state updates */
    it('should fetch all fruits and update signals', () => {
      service.getAllFruits().subscribe((fruits) => {
        expect(fruits).toEqual(mockFruits);
        expect(service.fruits()).toEqual(mockFruits);
        expect(service.loading()).toBeFalse();
        expect(service.error()).toBeNull();
      });

      const req = httpMock.expectOne('/api/fruit/all');
      expect(req.request.method).toBe('GET');
      req.flush(mockFruits);
    });

    /* HTTP error handling with proper error state management */
    it('should handle HTTP errors gracefully', () => {
      service.getAllFruits().subscribe({
        next: () => fail('should have failed'),
        error: (error: any) => {
          expect(error).toBeTruthy();
          expect(service.loading()).toBeFalse();
          expect(service.error()).toContain('Server error');
        },
      });

      const req = httpMock.expectOne('/api/fruit/all');
      req.flush('Server error', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });

    it('should use cache on subsequent calls', () => {
      // First call
      service.getAllFruits().subscribe();
      const req1 = httpMock.expectOne('/api/fruit/all');
      req1.flush(mockFruits);

      // Second call should use cache
      service.getAllFruits().subscribe((fruits) => {
        expect(fruits).toEqual(mockFruits);
      });

      // Should not make another HTTP request
      httpMock.expectNone('/api/fruit/all');
    });
  });

  describe('searchFruit', () => {
    it('should search for a specific fruit by name', () => {
      const fruitName = 'apple';

      service.searchFruit(fruitName).subscribe((result) => {
        expect(result.fruit).toEqual(mockFruit);
        expect(result.error).toBeUndefined();
      });

      const req = httpMock.expectOne(`/api/fruit/${fruitName}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockFruit);
    });

    it('should handle fruit not found error', () => {
      const fruitName = 'nonexistent';

      service.searchFruit(fruitName).subscribe((result) => {
        expect(result.fruit).toBeUndefined();
        expect(result.error).toContain('not found');
      });

      const req = httpMock.expectOne(`/api/fruit/${fruitName}`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });

    it('should return error for empty query', () => {
      service.searchFruit('').subscribe((result) => {
        expect(result.error).toBe('Please enter a fruit name');
        expect(result.fruit).toBeUndefined();
      });

      httpMock.expectNone('/api/fruit/');
    });
  });

  describe('getFruitsByFamily', () => {
    beforeEach(() => {
      service.getAllFruits().subscribe();
      const req = httpMock.expectOne('/api/fruit/all');
      req.flush(mockFruits);
    });

    it('should filter fruits by family', () => {
      service.getFruitsByFamily('Rosaceae').subscribe((fruits) => {
        expect(fruits).toEqual([mockFruit]);
      });
    });

    it('should be case insensitive', () => {
      service.getFruitsByFamily('rosaceae').subscribe((fruits) => {
        expect(fruits).toEqual([mockFruit]);
      });
    });

    it('should return empty array for non-existent family', () => {
      service.getFruitsByFamily('NonExistent').subscribe((fruits) => {
        expect(fruits).toEqual([]);
      });
    });
  });

  describe('getFruitFamilies', () => {
    it('should return unique families sorted alphabetically', () => {
      service.getAllFruits().subscribe();
      const req = httpMock.expectOne('/api/fruit/all');
      req.flush(mockFruits);

      service.getFruitFamilies().subscribe((families) => {
        expect(families).toEqual(['Musaceae', 'Rosaceae']);
      });
    });
  });

  describe('signals and computed values', () => {
    beforeEach(() => {
      service.fruits.set(mockFruits);
    });

    it('should filter fruits based on search filter', () => {
      service.searchFilter.set('apple');
      expect(service.filteredFruits()).toEqual([mockFruit]);
    });

    it('should return all fruits when filter is empty', () => {
      service.searchFilter.set('');
      expect(service.filteredFruits()).toEqual(mockFruits);
    });

    it('should filter case-insensitively', () => {
      service.searchFilter.set('APPLE');
      expect(service.filteredFruits()).toEqual([mockFruit]);
    });

    it('should return empty array when no fruits match filter', () => {
      service.searchFilter.set('nonexistent');
      expect(service.filteredFruits()).toEqual([]);
    });
  });

  describe('filterFruitsByNutrition', () => {
    it('should filter by maximum calories', () => {
      const filtered = service.filterFruitsByNutrition(mockFruits, {
        maxCalories: 60,
      });
      expect(filtered).toEqual([mockFruit]);
    });

    it('should filter by minimum protein', () => {
      const filtered = service.filterFruitsByNutrition(mockFruits, {
        minProtein: 0.5,
      });
      expect(filtered).toEqual([mockFruits[1]]);
    });

    it('should filter by multiple criteria', () => {
      const filtered = service.filterFruitsByNutrition(mockFruits, {
        maxCalories: 60,
        minProtein: 0.1,
      });
      expect(filtered).toEqual([mockFruit]);
    });
  });

  describe('refreshFruits', () => {
    it('should clear cache and fetch fresh data', () => {
      // First call to populate cache
      service.getAllFruits().subscribe();
      const req1 = httpMock.expectOne('/api/fruit/all');
      req1.flush(mockFruits);

      // Refresh should clear cache and make new request
      service.refreshFruits().subscribe((fruits) => {
        expect(fruits).toEqual(mockFruits);
      });

      const req2 = httpMock.expectOne('/api/fruit/all');
      req2.flush(mockFruits);
    });
  });

  describe('error handling', () => {
    it('should handle network errors', () => {
      service.getAllFruits().subscribe({
        next: () => fail('should have failed'),
        error: () => {
          expect(service.error()).toContain('Network error');
        },
      });

      const req = httpMock.expectOne('/api/fruit/all');
      req.error(new ProgressEvent('Network error'), { status: 0 });
    });

    it('should set loading state correctly', () => {
      expect(service.loading()).toBeFalse();

      service.getAllFruits().subscribe();

      const req = httpMock.expectOne('/api/fruit/all');
      req.flush(mockFruits);

      expect(service.loading()).toBeFalse();
    });
  });
});
