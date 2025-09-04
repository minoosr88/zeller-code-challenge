import { PricingRules } from "./pricing-rules";
import { productDetails } from "./product";

export class Cart {
  private items: productDetails[] = [];
  private pricingRules: PricingRules;

  constructor(pricingRules: PricingRules) {
    this.pricingRules = pricingRules;
  }

  add(product: productDetails): void {
    this.items.push(product);
  }

  total(): number {
    return this.pricingRules.calculate(this.items);
  }
}