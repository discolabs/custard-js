import { STEPS_ALL } from './index';

test('expected steps in STEPS_ALL', () => {
  expect(STEPS_ALL.length).toBeGreaterThanOrEqual(6);
  expect(STEPS_ALL).toContain('contact_information');
  expect(STEPS_ALL).toContain('shipping_method');
  expect(STEPS_ALL).toContain('payment_method');
  expect(STEPS_ALL).toContain('review');
  expect(STEPS_ALL).toContain('thank_you');
  expect(STEPS_ALL).toContain('order_status');
});
