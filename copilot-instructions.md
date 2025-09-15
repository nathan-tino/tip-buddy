# Copilot Instructions


## TypeScript Type Safety

When writing TypeScript code, do not use 'any' as a type. Always use official types from libraries (e.g., Chart, TooltipItem) for type safety and better maintainability.


## Telephone Textbox Fields

When creating telephone textbox fields, always use:

```html
<input type="tel" ...>
```

This ensures the field behaves as a phone number input, without number spinners, and allows for phone-specific formatting.


## Styling PrimeNG Components in Angular: ViewEncapsulation & ::ng-deep

When styling PrimeNG components (or other third-party Angular libraries), you may find that your CSS selectors do not apply as expected. This is because Angular's default ViewEncapsulation (Emulated) scopes styles only to elements directly in your component's template. Elements rendered inside PrimeNG components (like `.p-toolbar-start` or `.p-toolbar-end`) are not part of your template, so your styles won't reach them.

To style these deeply nested PrimeNG elements, use `:host ::ng-deep` in your component CSS:

```css
:host ::ng-deep .shifts-toolbar .p-toolbar-start {
  /* your styles here */
}
:host ::ng-deep .shifts-toolbar .p-toolbar-end {
  /* your styles here */
}
```

This approach forces Angular to apply your styles beyond the component boundary, allowing you to target PrimeNG's internal structure. Use `::ng-deep` whenever you need to style elements inside child components or third-party library components. This is a common source of confusion and can be time-consuming to debug, so keep it in mind for all Angular projects using PrimeNG.
