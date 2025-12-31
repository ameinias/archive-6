/**
 * Safely renders any value for React
 * Converts Dates, Objects, Arrays, etc. to strings
 */
export const safeRender = (value) => {
  // Null/undefined
  if (value == null) return '';

  // Already a string or number
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  // Date object
  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  // Array
  if (Array.isArray(value)) {
    return value.map(v => safeRender(v)).join(', ');
  }

  // Plain object
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }

  // Fallback
  return String(value);
};

// Format date specifically
export const safeDate = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (value instanceof Date) return value.toLocaleString();
  return new Date(value).toLocaleString();
};


