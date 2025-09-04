import { ProductManager } from "../product";

export function initializeProducts(): void {
    const appleTv = new ProductManager("atv", "Apple TV", 109.50);
    appleTv.addProduct();
    
    const superIpad = new ProductManager("ipd", "Super iPad", 549.99);
    superIpad.addProduct();
    
    const macbookPro = new ProductManager("mbp", "MacBook Pro", 1399.99);
    macbookPro.addProduct();
    
    const vga = new ProductManager("vga", "VGA adapter", 30.00);
    vga.addProduct();
  }