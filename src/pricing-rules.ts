import { productDetails } from "./product";

interface PricingRule {
  apply(products: productDetails[]): number | undefined;
  matches(productId: string): boolean;
}

export class AtvPolicy implements PricingRule {
  matches(productSku: string): boolean {
    return productSku === "atv";
  }

  apply(products: productDetails[]): number | undefined {
    const unitPrice = products[0].price;
    const qty = products.length;
    // 3 for 2 deal: for every 3 items, pay for 2
    const payableQty = qty - Math.floor(qty / 3);
    if (unitPrice) {
      return payableQty * unitPrice;
    }
    return undefined;
  }
}

export class IpdPolicy implements PricingRule {
  matches(productSku: string): boolean {
    return productSku === "ipd";
  }

  apply(products: productDetails[]): number | undefined {
    const qty = products.length;
    // Bulk discount: if more than 4, price drops to $499.99 each
    if (qty > 4) {
      return qty * 499.99; // instead of hardcoding price we can have another data store for pricing
    }
    // Regular pricing
    return products.reduce((sum, product) => sum + product.price, 0);
  }
}

export class PricingRules {
  private rules: PricingRule[] = [];

  addRule(rule: PricingRule): void {
    //can have more than one rule for a product?
    this.rules.push(rule);
  }

  calculate(products: productDetails[]): number {
    const grouped = this.groupBySku(products);
    let total = 0;

    for (const group of Object.values(grouped)) {
      const rule = this.rules.find(r => r.matches(group[0].sku));
      if (rule) {
        const ruleTotal = rule.apply(group);
        total += ruleTotal ?? 0;
      } else {
        // when there is no valid rule, use regular pricing
        total += group.reduce((sum, product) => sum + product.price, 0);
      }
    }

    return parseFloat(total.toFixed(2));
  }

    private groupBySku(products: productDetails[]): Record<string, productDetails[]> {
      return products.reduce((acc, product) => {
        if (!acc[product.sku]) acc[product.sku] = [];
        acc[product.sku].push(product);
        return acc;
      }, {} as Record<string, productDetails[]>);
    }
}