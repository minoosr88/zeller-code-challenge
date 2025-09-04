import { Checkout } from "./checkout";
import { createDefaultPricingRules } from "./utils/rules-definition";
import { initializeProducts } from "./utils/product-initializer";

beforeAll(() => {
  initializeProducts();
});

describe("Checkout System", () => {
  let pricingRules: any;
  let co: Checkout;

  beforeEach(() => {
    pricingRules = createDefaultPricingRules();
    co = new Checkout(pricingRules);
  });

  test("should handle single Apple TV", () => {
    co.scan("atv");
    expect(co.total()).toBe(109.50);
  });

  test("should handle 3 Apple TVs with 3-for-2 deal", () => {
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    // 2 * 109.50 = 219.00
    expect(co.total()).toBe(219.00);
  });

  test("should handle 6 Apple TVs with 3-for-2 deal", () => {
    for (let i = 0; i < 6; i++) {
      co.scan("atv");
    }
    // 4 * 109.50 = 438.00
    expect(co.total()).toBe(438.00);
  });

  test("should handle single Super iPad", () => {
    co.scan("ipd");
    expect(co.total()).toBe(549.99);
  });

  test("should handle 4 Super iPads - no bulk discount", () => {
    for (let i = 0; i < 4; i++) {
      co.scan("ipd");
    }
    //4 * 549.99 = 2199.96
    expect(co.total()).toBe(2199.96);
  });

  test("should handle 5 Super iPads with bulk discount", () => {
    for (let i = 0; i < 5; i++) {
      co.scan("ipd");
    }
    // 5 * 499.99 = 2499.95
    expect(co.total()).toBe(2499.95);
  });

  test("should handle MacBook Pro (no special pricing)", () => {
    co.scan("mbp");
    expect(co.total()).toBe(1399.99);
  });

  test("should handle VGA adapter (no special pricing)", () => {
    co.scan("vga");
    expect(co.total()).toBe(30.00);
  });

  test("should handle mixed items with different pricing rules", () => {
    // 3 Apple TVs (3-for-2 deal)
    co.scan("atv");
    co.scan("atv");
    co.scan("atv");
    
    // 5 Super iPads (bulk discount)
    for (let i = 0; i < 5; i++) {
      co.scan("ipd");
    }
    
    // 1 MacBook Pro (regular price)
    co.scan("mbp");
    
    // 1 VGA adapter (regular price)
    co.scan("vga");
    
    // total:
    // Apple TVs: 2 * 109.50 = 219.00
    // Super iPads: 5 * 499.99 = 2499.95
    // MacBook Pro: 1399.99
    // VGA adapter: 30.00
    // Total: 219.00 + 2499.95 + 1399.99 + 30.00 = 4148.94
    expect(co.total()).toBe(4148.94);
  });

  test("should throw error for invalid SKU", () => {
    expect(() => {
      co.scan("invalid");
    }).toThrow("Product with SKU invalid not found");
  });
});