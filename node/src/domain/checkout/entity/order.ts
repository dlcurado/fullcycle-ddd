import { NIL } from "uuid";
import Product from "../../product/entity/product";
import OrderItem from "./order_item";
export default class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];
  private _total: number;

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;
    this._total = this.total();
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  validate(): boolean {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }
    if (this._customerId.length === 0) {
      throw new Error("CustomerId is required");
    }
    if (this._items.length === 0) {
      throw new Error("Items are required");
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }

    return true;
  }

  total(): number {
    return this._items.reduce((acc, item) => acc + item.total(), 0);
  }

  replaceItems(items: OrderItem[]) {
    this._items = items;
    this.validate();
  }

  updateOrdemItem(item: OrderItem){
    const itemIndex = this._items.findIndex(objItem => {
      return objItem.id === item.id
    });

    // Se o item não existir, adicionamos ao pedido
    if(itemIndex < 0)
      this.addItem(item);
    // Se já existir, atualizamos a quantidade de itens pedido
    // Optei por permitir somente a atualização da quantidade pois não
    // faz sentido pra mim atualizar as outras infos como name or price
    // Esse tipo de atualização não me parece fazer parte do dominio de Order
    else{
      console.log("Item já existente")
      const itemFounded = this._items[itemIndex];
      itemFounded.updateQuantity(item.quantity);
    }
    this.validate();
  }

  addItem(item: OrderItem){
    this._items.push(item);
    this.validate();
  }
  
}
