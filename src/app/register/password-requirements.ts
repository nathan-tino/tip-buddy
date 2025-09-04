export const PASSWORD_REQUIREMENTS = [
  {
    key: 'length',
    text: 'At least 6 characters',
    validate: (value: string) => value.length >= 6
  },
  {
    key: 'uppercase',
    text: 'At least one uppercase letter',
    validate: (value: string) => /[A-Z]/.test(value)
  },
  {
    key: 'lowercase',
    text: 'At least one lowercase letter',
    validate: (value: string) => /[a-z]/.test(value)
  },
  {
    key: 'digit',
    text: 'At least one digit',
    validate: (value: string) => /\d/.test(value)
  },
  {
    key: 'nonAlphanumeric',
    text: 'At least one non-alphanumeric character',
    validate: (value: string) => /[^a-zA-Z0-9]/.test(value)
  }
];
