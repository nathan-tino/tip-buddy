# Copilot Instructions

## TypeScript Type Safety

When writing TypeScript code, do not use 'any' as a type. Always use official types from libraries (e.g., Chart, TooltipItem) for type safety and better maintainability.

## Telephone Textbox Fields

When creating telephone textbox fields, always use:

```html
<input type="tel" ...>
```

This ensures the field behaves as a phone number input, without number spinners, and allows for phone-specific formatting.
