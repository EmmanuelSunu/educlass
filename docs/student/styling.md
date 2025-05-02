# Student UI Styling Guidelines

## Color Scheme

### Primary Colors
```css
--primary: #2563eb;      /* Blue 600 */
--primary-light: #60a5fa; /* Blue 400 */
--primary-dark: #1e40af;  /* Blue 800 */
```

### Status Colors
```css
/* Event Types */
.class {
  background: #ECFDF5;   /* Green 50 */
  border: #34D399;       /* Green 400 */
  text: #065F46;         /* Green 900 */
}

.examination {
  background: #FEF2F2;   /* Red 50 */
  border: #F87171;       /* Red 400 */
  text: #991B1B;         /* Red 900 */
}

.test {
  background: #FFFBEB;   /* Yellow 50 */
  border: #FBBF24;       /* Yellow 400 */
  text: #92400E;         /* Yellow 900 */
}

.meeting {
  background: #EFF6FF;   /* Blue 50 */
  border: #60A5FA;       /* Blue 400 */
  text: #1E40AF;         /* Blue 800 */
}
```

### Text Colors
```css
--text-primary: #1e293b;   /* Slate 800 */
--text-secondary: #64748b; /* Slate 500 */
--text-light: #94a3b8;    /* Slate 400 */
```

## Typography

### Font Family
```css
font-family: 'Inter', system-ui, sans-serif;
```

### Font Sizes
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
```

## Component Styles

### Cards
```css
.card {
  @apply bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow;
  @apply p-4 md:p-6;
}
```

### Buttons
```css
.btn-primary {
  @apply bg-primary text-white;
  @apply hover:bg-primary-dark;
  @apply px-4 py-2 rounded-md;
  @apply transition-colors;
}

.btn-secondary {
  @apply bg-gray-100 text-gray-700;
  @apply hover:bg-gray-200;
  @apply px-4 py-2 rounded-md;
  @apply transition-colors;
}
```

### Form Elements
```css
.input {
  @apply w-full rounded-md;
  @apply border-gray-300;
  @apply focus:border-primary focus:ring-primary;
  @apply shadow-sm;
}

.select {
  @apply w-full rounded-md;
  @apply border-gray-300;
  @apply focus:border-primary focus:ring-primary;
  @apply shadow-sm;
}
```

## Layout

### Grid System
```css
.grid-cols-1 md:grid-cols-2 lg:grid-cols-3
.gap-4 md:gap-6
```

### Spacing
```css
--spacing-1: 0.25rem;  /* 4px */
--spacing-2: 0.5rem;   /* 8px */
--spacing-3: 0.75rem;  /* 12px */
--spacing-4: 1rem;     /* 16px */
--spacing-6: 1.5rem;   /* 24px */
--spacing-8: 2rem;     /* 32px */
```

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

## Animations

### Transitions
```css
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

### Hover Effects
```css
.hover-scale {
  @apply hover:scale-105;
  @apply transition-transform;
}

.hover-shadow {
  @apply hover:shadow-md;
  @apply transition-shadow;
}
```

## Icons

### Size Guidelines
```css
--icon-sm: 1rem;      /* 16px */
--icon-base: 1.25rem; /* 20px */
--icon-lg: 1.5rem;    /* 24px */
```

### Usage
```typescript
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
```

## Responsive Design

### Mobile First
- Use `sm:`, `md:`, `lg:` prefixes
- Default styles for mobile
- Progressive enhancement for larger screens

### Common Patterns
```css
/* Text size adjustment */
.text-base md:text-lg

/* Padding adjustment */
.p-4 md:p-6

/* Grid columns adjustment */
.grid-cols-1 md:grid-cols-2 lg:grid-cols-3

/* Visibility control */
.hidden md:block
``` 