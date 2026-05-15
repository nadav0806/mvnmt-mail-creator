import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCreateAccountPayload, normalizeCreateAccountResponse } from '../src/lib/create-account.mjs';

test('buildCreateAccountPayload trims names', () => {
  assert.deepEqual(
    buildCreateAccountPayload('  Noah ', ' Levine  '),
    { firstName: 'Noah', lastName: 'Levine' }
  );
});

test('normalizeCreateAccountResponse maps success payload', () => {
  assert.deepEqual(
    normalizeCreateAccountResponse({
      success: true,
      email: 'noah.levine@themailman.info',
      password: 'C7wsQHlKL^7L',
      displayName: 'noah levine',
    }),
    {
      success: true,
      email: 'noah.levine@themailman.info',
      password: 'C7wsQHlKL^7L',
      displayName: 'noah levine',
    }
  );
});
