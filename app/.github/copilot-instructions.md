# Copilot Instructions for Fruity Nutrition App

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview

This is a modern Angular application that displays fruits and their nutritional values using the FruityVice API. The application focuses on promoting healthy, plant-based nutrition with an exceptional user experience.

## Architecture Guidelines

- Use Angular standalone components (no NgModules)
- Implement zoneless change detection
- Follow Angular best practices and style guide
- Use TypeScript strict mode
- Implement proper error handling and loading states

## API Integration

- Base API URL: `https://fruityvice.com/api/`
- Endpoints:
  - All fruits: `api/fruit/all`
  - Single fruit: `api/fruit/{name}`
- Use Angular HttpClient with proper typing
- Implement proxy configuration for CORS handling

## UI/UX Guidelines

- Focus on exceptional user experience
- Use modern, elegant design patterns
- Implement smooth animations and transitions
- Ensure responsive design for all screen sizes
- Follow accessibility best practices (ARIA, keyboard navigation)

## State Management

- Use Angular signals for reactive state
- Implement proper loading and error states
- Cache API responses when appropriate

## Code Quality

- Write clean, readable, and maintainable code
- Use descriptive variable and function names
- Implement proper TypeScript types and interfaces
- Follow SOLID principles
- Write unit tests for critical functionality

## Features to Implement

1. **Home Page**: Display all available fruits in an attractive grid/list
2. **Fruit Details**: Show detailed nutritional information for selected fruits
3. **Search Functionality**: Allow users to search for specific fruits
4. **Responsive Design**: Ensure great UX on all devices
5. **Loading States**: Smooth loading animations and skeletons
6. **Error Handling**: Graceful error handling with user-friendly messages

## Libraries and Tools

- Angular Material or PrimeNG for UI components
- Angular Animations for smooth transitions
- Tailwind CSS or custom SCSS for styling
- Angular CDK for advanced functionality
- NgOptimizedImage for image optimization
