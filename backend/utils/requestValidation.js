export const hasOnlyAllowedFields = (value, allowedFields) => {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value) ||
    Object.getPrototypeOf(value) !== Object.prototype
  ) {
    return false;
  }

  const allowed = new Set(allowedFields);
  return Object.keys(value).every(
    (field) => allowed.has(field) && !field.endsWith('.') && !field.includes('.')
  );
};
