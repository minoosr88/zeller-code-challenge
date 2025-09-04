import { AtvPolicy, IpdPolicy, PricingRules } from "./pricing-rules";
import { productDetails } from "./product";

describe("Pricing Rules", () => {
  describe("AtvPolicy", () => {
    const atvPolicy = new AtvPolicy();

    test("should match Apple TV SKU", () => {
      expect(atvPolicy.matches("atv")).toBe(true);
    });

    test("should not match other SKUs", () => {
      expect(atvPolicy.matches("ipd")).toBe(false);
    });

    test("should apply 3-for-2 deal correctly for 1 Apple TV", () => {
      const products: productDetails[] = [
        { sku: "atv", name: "Apple TV", price: 109.50 }
      ];
      expect(atvPolicy.apply(products)).toBe(109.50);
    });

    test("should apply 3-for-2 deal correctly for 2 Apple TVs", () => {
      const products: productDetails[] = [
        { sku: "atv", name: "Apple TV", price: 109.50 },
        { sku: "atv", name: "Apple TV", price: 109.50 }
      ];
      expect(atvPolicy.apply(products)).toBe(219.00);
    });

    test("should apply 3-for-2 deal correctly for 3 Apple TVs", () => {
      const products: productDetails[] = [
        { sku: "atv", name: "Apple TV", price: 109.50 },
        { sku: "atv", name: "Apple TV", price: 109.50 },
        { sku: "atv", name: "Apple TV", price: 109.50 }
      ];
      // 2 * 109.50 = 219.00
      expect(atvPolicy.apply(products)).toBe(219.00);
    });

    test("should apply 3-for-2 deal correctly for 6 Apple TVs", () => {
      const products: productDetails[] = Array(6).fill({ sku: "atv", name: "Apple TV", price: 109.50 });
      // 4 * 109.50 = 438.00
      expect(atvPolicy.apply(products)).toBe(438.00);
    });

    test("should apply 3-for-2 deal correctly for 7 Apple TVs", () => {
      const products: productDetails[] = Array(7).fill({ sku: "atv", name: "Apple TV", price: 109.50 });
      // 5 * 109.50 = 547.50
      expect(atvPolicy.apply(products)).toBe(547.50);
    });
  });

  describe("IpdPolicy", () => {
    const ipdPolicy = new IpdPolicy();

    test("should match Super iPad SKU", () => {
      expect(ipdPolicy.matches("ipd")).toBe(true);
    });

    test("should not match other SKUs", () => {
      expect(ipdPolicy.matches("atv")).toBe(false);
    });

    test("should apply regular pricing for 1 Super iPad", () => {
      const products: productDetails[] = [
        { sku: "ipd", name: "Super iPad", price: 549.99 }
      ];
      expect(ipdPolicy.apply(products)).toBe(549.99);
    });

    test("should apply regular pricing for 4 Super iPads", () => {
      const products: productDetails[] = Array(4).fill({ sku: "ipd", name: "Super iPad", price: 549.99 });
      // 4 * 549.99 = 2199.96
      expect(ipdPolicy.apply(products)).toBe(2199.96);
    });

    test("should apply bulk discount for 5 Super iPads", () => {
      const products: productDetails[] = Array(5).fill({ sku: "ipd", name: "Super iPad", price: 549.99 });
      // 5 * 499.99 = 2499.95
      expect(ipdPolicy.apply(products)).toBe(2499.95);
    });
  });

  describe("PricingRules", () => {
    let pricingRules: PricingRules;

    beforeEach(() => {
      pricingRules = new PricingRules();
    });

    test("should add rules correctly", () => {
      const atvRule = new AtvPolicy();
      const ipdRule = new IpdPolicy();
      
      pricingRules.addRule(atvRule);
      pricingRules.addRule(ipdRule);
      
      const atvProducts: productDetails[] = Array(3).fill({ sku: "atv", name: "Apple TV", price: 109.50 });
      const ipdProducts: productDetails[] = Array(5).fill({ sku: "ipd", name: "Super iPad", price: 549.99 });
      
      expect(pricingRules.calculate(atvProducts)).toBe(219.00); // 3-for-2 deal
      expect(pricingRules.calculate(ipdProducts)).toBe(2499.95); // bulk discount
    });

    test("should apply regular pricing for products without rules", () => {
      const products: productDetails[] = [
        { sku: "mbp", name: "MacBook Pro", price: 1399.99 },
        { sku: "vga", name: "VGA adapter", price: 30.00 }
      ];
      
      // Should use regular pricing since no rules are defined
      expect(pricingRules.calculate(products)).toBe(1429.99);
    });

    test("should handle mixed products with and without rules", () => {
      const atvRule = new AtvPolicy();
      const ipdRule = new IpdPolicy();
      pricingRules.addRule(atvRule);
      pricingRules.addRule(ipdRule);

      const products: productDetails[] = [
        { sku: "atv", name: "Apple TV", price: 109.50 },
        { sku: "atv", name: "Apple TV", price: 109.50 },
        { sku: "atv", name: "Apple TV", price: 109.50 },
        { sku: "ipd", name: "Super iPad", price: 549.99 },
        { sku: "ipd", name: "Super iPad", price: 549.99 },
        { sku: "ipd", name: "Super iPad", price: 549.99 },
        { sku: "ipd", name: "Super iPad", price: 549.99 },
        { sku: "ipd", name: "Super iPad", price: 549.99 },
        { sku: "mbp", name: "MacBook Pro", price: 1399.99 },
        { sku: "vga", name: "VGA adapter", price: 30.00 }
      ];

      // Expected total:
      // Apple TVs: 2 * 109.50 = 219.00 (3-for-2 deal)
      // Super iPads: 5 * 499.99 = 2499.95 (bulk discount)
      // MacBook Pro: 1399.99 (regular price)
      // VGA adapter: 30.00 (regular price)
      // Total: 219.00 + 2499.95 + 1399.99 + 30.00 = 4148.94
      expect(pricingRules.calculate(products)).toBe(4148.94);
    });

    test("should handle empty product list", () => {
      expect(pricingRules.calculate([])).toBe(0);
    });

  });
});
