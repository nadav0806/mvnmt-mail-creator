export function buildCreateAccountPayload(firstName, lastName) {
  return {
    firstName: String(firstName ?? '').trim(),
    lastName: String(lastName ?? '').trim(),
  };
}

export function normalizeCreateAccountResponse(payload) {
  return payload && typeof payload === 'object'
    ? {
        success: Boolean(payload.success),
        email: String(payload.email ?? ''),
        password: String(payload.password ?? ''),
        displayName: String(payload.displayName ?? ''),
      }
    : {
        success: false,
        email: '',
        password: '',
        displayName: '',
      };
}
