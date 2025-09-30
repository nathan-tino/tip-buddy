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


## Test Writing Best Practices

When writing unit tests, follow these guidelines to ensure high-quality, maintainable test code:

### Avoid Type Safety Bypasses
- **NEVER use `as any`** to bypass TypeScript type checking in tests - this is a critical anti-pattern
- **NEVER use `null as any`** or similar type assertions - work within the actual type system
- **Never use manual component instantiation** with `new Component(dependencies)` - this bypasses Angular's TestBed
- Instead of bypassing types, create realistic test scenarios:
  - Use `TestBed.createComponent()`: `const freshFixture = TestBed.createComponent(Component); const freshComponent = freshFixture.componentInstance;`
  - Test actual edge cases like uninitialized components or undefined properties
  - Use proper mock objects that match expected interfaces
  - If testing edge cases like `null` values, ensure your interfaces actually support those types

### Use Exact Object Matching
- **Avoid `jasmine.objectContaining()`** for critical assertions
- Use exact object matching `expect(spy).toHaveBeenCalledWith(param, exactObject)` 
- This catches:
  - Missing required properties
  - Unexpected extra properties 
  - Incorrect data structure
  - Wrong property values

### Verify Logic, Not Just Outcomes
- **Test the actual conversion logic** rather than assuming outcomes
- For nullish coalescing (`??`), test both undefined/null conversion AND preservation of defined values
- Include descriptive comments explaining what logic is being verified
- Example: Test that `value ?? 0` converts undefined to 0 but preserves defined values

### Example of Good vs Bad Test Patterns

```typescript
// ❌ BAD: Type bypass, manual instantiation, and partial matching
component.shift = undefined as any;
const badComponent = new Component(mockService, mockDateService);
expect(service.call).toHaveBeenCalledWith(jasmine.objectContaining({id: '1'}));

// ✅ GOOD: Type-safe, TestBed integration, and exact matching
const freshFixture = TestBed.createComponent(Component);
const freshComponent = freshFixture.componentInstance;
freshComponent.ngOnInit();
expect(service.call).toHaveBeenCalledWith('1', {
  id: '1',
  creditTips: 0, // undefined → 0 via ?? operator
  cashTips: 75,  // preserved defined value
  date: expectedDate,
  hoursWorked: 8
});
```

This ensures tests are robust, type-safe, and catch regressions effectively.
