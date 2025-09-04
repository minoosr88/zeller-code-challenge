export type productDetails ={
    sku: string,
    name: string,
    price: number
}

export type productValues = {
    name: string;
    price: number;
}
const productStorage = new Map<string, productValues>();
export class ProductManager {
    private _sku: string;
    private _name: string;
    private _price: number;
     constructor(sku: string, name: string, price: number){
        this._sku = sku;
        this._name = name;
        this._price = price;
     }

     public addProduct(): void{
        productStorage.set(this._sku, {
            name : this._name,
            price: this._price
        })
     }

    get sku(){
        return this._sku;
    }
    get name(){
        return this._name;
    }
    get price(){
        return this._price;
    }

     public getPrice(_sku: string){
        if(productStorage.has(_sku)){
            return productStorage.get(_sku)?.price ?? 0;
        }else{
            throw new Error("product not exist!")
        }
     }

     public static getProduct(sku: string): ProductManager | null {
        if(productStorage.has(sku)){
            const product = productStorage.get(sku)!;
            return new ProductManager(sku, product.name, product.price);
        }
        return null;
     }
}