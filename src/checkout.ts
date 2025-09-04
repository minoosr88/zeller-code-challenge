import { Cart } from "./cart";
import { PricingRules } from "./pricing-rules";
import { ProductManager } from "./product";

export class Checkout {
  private cart: Cart;
  private pricingRules: PricingRules;

  constructor(pricingRules: PricingRules) {
    this.pricingRules = pricingRules;
    this.cart = new Cart(pricingRules);
  }

  scan(sku: string): void {
    const product = ProductManager.getProduct(sku);
    if (product) {
      this.cart.add({ sku: product.sku, name: product.name, price: product.price });
    } else {
      throw new Error(`Product with SKU ${sku} not found`);
    }
  }

  total(): number {
    return this.cart.total();
  }
}


