import { Cart } from "./cart";
import { PricingRules } from "./pricing-rules";
import { productDetails } from "./product";

describe("Cart", () => {
  let cart: Cart;
  let pricingRules: PricingRules;

  beforeEach(() => {
    pricingRules = new PricingRules();
    cart = new Cart(pricingRules);
  });

  test("should initialize with empty items", () => {
    expect(cart.total()).toBe(0);
  });

  test("should add single product and calculate total", () => {
    const product: productDetails = {
      sku: "vga",
      name: "VGA adapter",
      price: 30.00
    };

    cart.add(product);
    expect(cart.total()).toBe(30.00);
  });

  test("should add multiple different products", () => {
    const products: productDetails[] = [
      { sku: "vga", name: "VGA adapter", price: 30.00 },
      { sku: "mbp", name: "MacBook Pro", price: 1399.99 }
    ];

    products.forEach(product => cart.add(product));
    expect(cart.total()).toBe(1429.99);
  });

  test("should handle empty cart", () => {
    expect(cart.total()).toBe(0);
  });
});
