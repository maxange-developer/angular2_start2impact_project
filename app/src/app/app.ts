import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

// PrimeNG component imports for modern UI framework
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

// Application-specific component imports
import { FruitList } from './components/fruit-list/fruit-list';
import { FruitDetail } from './components/fruit-detail/fruit-detail';
import { LanguageSelectorComponent } from './components/language-selector/language-selector';
import { Fruit } from './models/fruit.model';
import { TranslationService } from './services/translation.service';
import { FruitService } from './services/fruit.service';

/**
 * Main application component implementing the root layout and navigation.
 * Features:
 * - Global toolbar with search functionality
 * - Fruit list management with filtering
 * - Modal dialog system for fruit details
 * - Multi-language support
 * - Toast notifications for user feedback
 */
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    FormsModule,
    RouterOutlet,
    // PrimeNG UI components
    ToolbarModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    DialogModule,
    ToastModule,
    // Custom application components
    FruitList,
    FruitDetail,
    LanguageSelectorComponent,
  ],
  providers: [MessageService],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  /**
   * Application title displayed in the header
   */
  protected readonly title = signal('Fruity Nutrition App');

  /**
   * Injected services for dependency management
   */
  protected translationService = inject(TranslationService);
  private fruitService = inject(FruitService);
  private messageService = inject(MessageService);

  /**
   * Reactive state management using Angular Signals
   */
  // Currently selected fruit for detailed view
  selectedFruit = signal<Fruit | null>(null);
  // Controls visibility of the fruit detail modal dialog
  displayDetailDialog = signal<boolean>(false);
  // Active tab index for navigation state
  activeTab = signal<number>(0);

  /**
   * Search functionality state
   */
  // Current search term entered by user
  searchTerm = signal<string>('');
  // Loading state indicator for search operations
  isSearching = signal<boolean>(false);

  /**
   * Handles fruit selection from the list component.
   * Opens the detail dialog with the selected fruit information.
   * @param fruit - The selected fruit object containing nutritional data
   */
  onFruitSelected(fruit: Fruit): void {
    this.selectedFruit.set(fruit);
    this.displayDetailDialog.set(true);
  }

  /**
   * Handles closing of the fruit detail dialog.
   * Resets the selected fruit state and hides the modal.
   */
  onDetailDialogClose(): void {
    this.displayDetailDialog.set(false);
    this.selectedFruit.set(null);
  }

  /**
   * Handles tab navigation changes (if tab system is implemented).
   * @param event - Tab change event containing the new index
   */
  onTabChange(event: any): void {
    this.activeTab.set(event.index);
  }

  /**
   * Handles fruit found from search functionality.
   * Directly opens the detail dialog with the found fruit.
   * @param fruit - The fruit found through search
   */
  onSearchFruitFound(fruit: Fruit): void {
    this.selectedFruit.set(fruit);
    this.displayDetailDialog.set(true);
  }

  /**
   * Processes search input changes and updates the filter in real-time.
   * Implements debounced search through the fruit service.
   * @param value - The new search term entered by the user
   */
  onSearchInput(value: string): void {
    this.searchTerm.set(value);
    // Update the search filter in the fruit service for real-time filtering
    this.fruitService.searchFilter.set(value.trim());
  }

  /**
   * Initiates a search operation.
   * Currently maintains real-time filtering through onSearchInput.
   * Can be extended for API-based search functionality if needed.
   */
  onSearch(): void {
    // Real-time filtering is handled by onSearchInput
    // This method can be used for specific API search operations in the future
    const term = this.searchTerm().trim();
    if (!term) return;

    // Optional: Maintain for specific API searches
    // Currently using local filtering for better performance
  }

  /**
   * Clears the current search term and resets filters.
   * Restores the full fruit list without any search constraints.
   */
  clearSearch(): void {
    this.searchTerm.set('');
    this.fruitService.searchFilter.set('');
  }

  /**
   * Handles search reset events from child components.
   * Ensures consistent search state across the application.
   */
  onSearchReset(): void {
    this.searchTerm.set('');
  }
}
