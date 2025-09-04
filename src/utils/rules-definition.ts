import { AtvPolicy, IpdPolicy, PricingRules } from "../pricing-rules";

export function createDefaultPricingRules(): PricingRules {
    const rules = new PricingRules();
    rules.addRule(new AtvPolicy()); // 3 for 2 deal on Apple TVs
    rules.addRule(new IpdPolicy()); // Bulk discount on Super iPads
    return rules;
  }