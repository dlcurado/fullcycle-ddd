import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import OrderRepositoryInterface from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    // Atualizando cada item do pedido
    entity.items.forEach(async orderItem => {
      const [affectedRows] = await OrderItemModel.update(
        {
          quantity: orderItem.quantity
        },
        {
          where: {
            id: orderItem.id
          }
        }
      );

      if(affectedRows === 0){
        await OrderItemModel.create(
          {
            id: orderItem.id,
            order_id: entity.id,
            product_id: orderItem.productId,
            name: orderItem.name,
            price: orderItem.price,
            quantity: orderItem.quantity
          }
        );
      }
              
    });
    
    await OrderModel.update(
      {
        total: entity.total(),
      },
      {
        where: {
          id: entity.id
        }
      }
    );
  }

  async find(id: string): Promise<Order> {
    const orderModel = await OrderModel.findByPk(
      id,
      { include: ["items"] }
    );
    let items = orderModel.items.map((orderItem) => {
      return new OrderItem(orderItem.id,orderItem.name,orderItem.price,orderItem.product_id,orderItem.quantity)
    });
    return new Order(orderModel.id, orderModel.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    const orderModel = await OrderModel.findAll(
      { include: ["items"] }
    );
    let orders = orderModel.map((order) => {
      let items = order.items.map((orderItem) => {
        return new OrderItem(orderItem.id,orderItem.name,orderItem.price,orderItem.product_id,orderItem.quantity)
      });

      return new Order(order.id, order.customer_id, items);
    })
    
    return orders;
  }

}
