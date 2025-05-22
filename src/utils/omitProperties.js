/**
 * Returns a new object with the specified property omitted.
 * @param {Object} obj - The source object.
 * @param {string|string[]} keys - The property name(s) to omit.
 * @returns {Object} A new object without the specified property/properties.
 */
function omitProperties(obj, keys) {
  if (!obj || typeof obj !== "object") return {};
  const omitKeys = Array.isArray(keys) ? keys : [keys];
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !omitKeys.includes(key))
  );
}

module.exports = { omitProperties };
