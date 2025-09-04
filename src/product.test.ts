import { ProductManager } from "./product";

describe("ProductManager", () => {
  test("should create product and expose getters", () => {
    const pm = new ProductManager("test-sku", "Test Product", 123.45);
    expect(pm.sku).toBe("test-sku");
    expect(pm.name).toBe("Test Product");
    expect(pm.price).toBe(123.45);
  });

  test("should add product to storage and retrieve by static getProduct", () => {
    const sku = "test-sku-2";
    const name = "Stored Product";
    const price = 99.99;
    const pm = new ProductManager(sku, name, price);
    pm.addProduct();

    const productObjects = ProductManager.getProduct(sku);
    expect(productObjects).not.toBeNull();
    expect(productObjects!.sku).toBe(sku);
    expect(productObjects!.name).toBe(name);
    expect(productObjects!.price).toBe(price);
  });

  test("should return correct price using getPrice for existing product", () => {
    const sku = "test-sku-3";
    const pm = new ProductManager(sku, "Priced Product", 10.5);
    pm.addProduct();
    expect(pm.getPrice(sku)).toBe(10.5);
  });

  test("getPrice should throw sku is not there", () => {
    const pm = new ProductManager("test-sku-4", "Any", 1);
    expect(() => pm.getPrice("miss-sku-1")).toThrow("product not exist!");
  });

  test("static getProduct should return null if sku is not there", () => {
    expect(ProductManager.getProduct("miss-sku-2")).toBeNull();
  });

  test("should handle multiple products", () => {
    const a = new ProductManager("test-sku-A", "A", 1);
    const b = new ProductManager("test-sku-B", "B", 2);
    a.addProduct();
    b.addProduct();

    const fetchedA = ProductManager.getProduct("test-sku-A");
    const fetchedB = ProductManager.getProduct("test-sku-B");
    expect(fetchedA!.name).toBe("A");
    expect(fetchedA!.price).toBe(1);
    expect(fetchedB!.name).toBe("B");
    expect(fetchedB!.price).toBe(2);
  });
});


