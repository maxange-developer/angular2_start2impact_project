/**
 * TranslationService Test Suite
 *
 * This comprehensive test suite validates the TranslationService functionality including
 * language management, translation retrieval, localStorage persistence, SSR compatibility,
 * and reactive signal-based translation updates.
 *
 * Testing Focus Areas:
 * - Multi-language support (Italian and English)
 * - Signal-based reactive translation system
 * - Browser localStorage persistence for language preferences
 * - Server-Side Rendering (SSR) compatibility testing
 * - Nested translation key resolution and fallback handling
 * - Edge case scenarios and error conditions
 * - Translation consistency and reactivity validation
 */

import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { provideZonelessChangeDetection } from '@angular/core';
import { TranslationService, Language } from './translation.service';

describe('TranslationService', () => {
  let service: TranslationService;

  beforeEach(() => {
    /* Mock localStorage for comprehensive browser storage testing */
    const localStorageMock = {
      getItem: jasmine.createSpy('getItem').and.returnValue(null),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
      clear: jasmine.createSpy('clear'),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    /* Configure test module with browser platform and zoneless change detection */
    TestBed.configureTestingModule({
      providers: [
        TranslationService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        provideZonelessChangeDetection(),
      ],
    });
    service = TestBed.inject(TranslationService);
  });

  /* Basic service instantiation validation */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('language management', () => {
    /* Default language initialization testing */
    it('should default to Italian language', () => {
      expect(service.language()).toBe('it');
    });

    /* Language switching functionality validation */
    it('should set language correctly', () => {
      service.setLanguage('en');
      expect(service.language()).toBe('en');
    });

    /* localStorage persistence testing for language preferences */
    it('should persist language to localStorage', () => {
      service.setLanguage('en');
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'fruity-app-language',
        'en'
      );
    });
  });

  describe('translations', () => {
    /* Italian language translation validation */
    it('should provide Italian translations', () => {
      service.setLanguage('it');
      const translations = service.t();

      expect(translations.nav.allFruits).toBe('Tutti i Frutti');
      expect(translations.home.title).toBe('Fruity Nutrition');
      expect(translations.fruitDetail.calories).toBe('Calorie');
    });

    /* English language translation validation */
    it('should provide English translations', () => {
      service.setLanguage('en');
      const translations = service.t();

      expect(translations.nav.allFruits).toBe('All Fruits');
      expect(translations.home.title).toBe('Fruity Nutrition');
      expect(translations.fruitDetail.calories).toBe('Calories');
    });

    /* Reactive translation updates on language change */
    it('should update translations when language changes', () => {
      service.setLanguage('it');
      let translations = service.t();
      expect(translations.nav.allFruits).toBe('Tutti i Frutti');

      service.setLanguage('en');
      translations = service.t();
      expect(translations.nav.allFruits).toBe('All Fruits');
    });
  });

  describe('utility methods', () => {
    /* Dynamic translation key resolution testing */
    it('should translate keys correctly', () => {
      service.setLanguage('it');
      expect(service.getTranslation('nav.allFruits')).toBe('Tutti i Frutti');

      service.setLanguage('en');
      expect(service.getTranslation('nav.allFruits')).toBe('All Fruits');
    });

    /* Missing translation key fallback handling */
    it('should handle missing translation keys', () => {
      const result = service.getTranslation('nonexistent.key');
      expect(result).toBe('nonexistent.key'); // Should return the key itself
    });

    /* Nested translation structure validation */
    it('should handle nested translation keys', () => {
      service.setLanguage('it');
      expect(service.getTranslation('fruitDetail.nutritionalInfo')).toBe(
        'Informazioni Nutrizionali'
      );
    });

    /* Deep nested path resolution testing */
    it('should handle deep nested paths', () => {
      service.setLanguage('en');
      expect(service.getTranslation('fruitDetail.protein')).toBe('Protein');
    });
  });

  describe('computed signal behavior', () => {
    /* Reactive signal-based translation system validation */
    it('should provide reactive translations through t() signal', () => {
      service.setLanguage('it');
      const italianTranslations = service.t();
      expect(italianTranslations.nav.allFruits).toBe('Tutti i Frutti');

      service.setLanguage('en');
      const englishTranslations = service.t();
      expect(englishTranslations.nav.allFruits).toBe('All Fruits');

      // The signal should be different instances for different languages
      expect(italianTranslations.nav.allFruits).not.toBe(
        englishTranslations.nav.allFruits
      );
    });

    /* Translation consistency validation for same language */
    it('should provide consistent translations for same language', () => {
      service.setLanguage('it');
      const translations1 = service.t();
      const translations2 = service.t();

      expect(translations1).toBe(translations2); // Should be the same reference
    });
  });

  describe('SSR support', () => {
    /* Server-Side Rendering compatibility testing */
    it('should work correctly in SSR mode', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          TranslationService,
          { provide: PLATFORM_ID, useValue: 'server' },
          provideZonelessChangeDetection(),
        ],
      });

      service = TestBed.inject(TranslationService);

      service.setLanguage('en');
      expect(service.t().nav.allFruits).toBe('All Fruits');

      // Should not try to save to localStorage in SSR
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    /* Rapid language switching stress testing */
    it('should handle rapid language changes', () => {
      service.setLanguage('en');
      service.setLanguage('it');
      service.setLanguage('en');

      expect(service.language()).toBe('en');
      expect(service.t().nav.allFruits).toBe('All Fruits');
    });

    /* Partial translation path resolution validation */
    it('should handle partial translation paths', () => {
      const result = service.getTranslation('nav.allFruits');
      expect(result).toBe('Tutti i Frutti');
    });

    /* Empty translation path edge case handling */
    it('should handle empty translation path', () => {
      const result = service.getTranslation('');
      expect(result).toBe(''); // Should return empty string
    });
  });

  describe('specific translation sections', () => {
    beforeEach(() => {
      service.setLanguage('it');
    });

    /* Navigation section translation validation */
    it('should provide navigation translations', () => {
      const t = service.t();
      expect(t.nav.allFruits).toBe('Tutti i Frutti');
      expect(t.nav.search).toBe('Cerca');
      expect(t.nav.languageSelector).toBe('Lingua');
    });

    /* Home page section translation validation */
    it('should provide home page translations', () => {
      const t = service.t();
      expect(t.home.title).toBe('Fruity Nutrition');
      expect(t.home.searchPlaceholder).toBe('Cerca un frutto...');
      expect(t.home.noResults).toBe(
        'Nessun frutto trovato con i filtri selezionati'
      );
    });

    /* Fruit detail section translation validation */
    it('should provide fruit detail translations', () => {
      const t = service.t();
      expect(t.fruitDetail.nutritionalInfo).toBe('Informazioni Nutrizionali');
      expect(t.fruitDetail.calories).toBe('Calorie');
      expect(t.fruitDetail.protein).toBe('Proteine');
      expect(t.fruitDetail.fat).toBe('Grassi');
      expect(t.fruitDetail.carbohydrates).toBe('Carboidrati');
    });
  });
});
