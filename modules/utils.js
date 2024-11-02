function deepFreeze(obj) {
  for (const key of Object.getOwnPropertyNames(obj)) {
    const val = obj[key];
    if (val && typeof val === 'object' && !Buffer.isBuffer(val)) {
      deepFreeze(val);
    }
  }
  return Object.freeze(obj);
}

export default {
  deepFreeze,
};
