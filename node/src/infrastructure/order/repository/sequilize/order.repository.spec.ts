import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  
    

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  

  // it("should add a new order item in a existent order", async () => {
  //   // Global Objects usados em todos os testes
  //   const customerRepository = new CustomerRepository();
  //   const customer1 = new Customer("customer123", "Customer 1");
  //   const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
  //   const productRepository = new ProductRepository();
  //   const product1 = new Product("product123", "Product 1", 10);
  //   const product2 = new Product("product234", "Product 2", 15);
  //   let orderItem1 = new OrderItem(
  //     "orderitem123",
  //     product1.name,
  //     product1.price,
  //     product1.id,
  //     2
  //   );

  //   let orderItem2 = new OrderItem(
  //     "orderitem234",
  //     product2.name,
  //     product2.price,
  //     product2.id,
  //     3
  //   );

  //   const order1 = new Order("order123", customer1.id, [orderItem1]);

  //   // Criando o repositorio da order
  //   const orderRepository = new OrderRepository();

  //   // Criando um cliente e seu endereço
  //   customer1.changeAddress(address);
  //   await customerRepository.create(customer1);

  //   // Criando um produto que o cliente possa comprar
  //   await productRepository.create(product1);

  //   // Persistindo a order
  //   await orderRepository.create(order1);

  //   // Resgatando a order para validação
  //   const orderModel = await OrderModel.findOne({
  //     where: { id: order1.id },
  //     include: ["items"],
  //   });

    
  //   expect(orderModel.toJSON()).toStrictEqual({
  //     id: order1.id,
  //     customer_id: order1.customerId,
  //     total: order1.total(),
  //     items: [
  //       {
  //         id: orderItem1.id,
  //         name: orderItem1.name,
  //         price: orderItem1.price,
  //         quantity: orderItem1.quantity,
  //         order_id: order1.id,
  //         product_id: product1.id,
  //       }
  //     ],
  //   });

  //   // Atualizando a quantidade do pedido do item que já existe na order
  //   order1.addItem(orderItem2);

  //   // Persistindo a order no banco
  //   await orderRepository.update(order1);

  //   // Resgatando a order para validação
  //   const orderModelUpdated = await OrderModel.findOne({
  //     where: { id: order1.id },
  //     include: ["items"],
  //   });

  //   // Deve conter 2 items
  //   expect(orderModelUpdated.items.length).toEqual(2);

  //   expect(orderModelUpdated.toJSON()).toStrictEqual({
  //     id: order1.id,
  //     customer_id: order1.customerId,
  //     total: order1.total(),
  //     items: [
  //       {
  //         id: orderItem1.id,
  //         name: orderItem1.name,
  //         price: orderItem1.price,
  //         quantity: orderItem1.quantity,
  //         order_id: order1.id,
  //         product_id: product1.id,
  //       },
  //       {
  //         id: orderItem2.id,
  //         name: orderItem2.name,
  //         price: orderItem2.price,
  //         quantity: orderItem2.quantity,
  //         order_id: order1.id,
  //         product_id: product2.id,
  //       },
  //     ],
  //   });
  // });

  it("should create a new order", async () => {
    // Global Objects usados em todos os testes
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("customer123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const productRepository = new ProductRepository();
    const product1 = new Product("product123", "Product 1", 10);
    const product2 = new Product("product234", "Product 2", 15);
    let orderItem1 = new OrderItem(
      "orderitem123",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    const order1 = new Order("order123", customer1.id, [orderItem1]);

    // Criando o repositorio da order
    const orderRepository = new OrderRepository();

    customer1.changeAddress(address);
    await customerRepository.create(customer1);

    await productRepository.create(product1);

    await orderRepository.create(order1);
    const orderModel = await OrderModel.findOne({
      where: { id: order1.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order1.id,
      customer_id: order1.customerId,
      total: order1.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: order1.id,
          product_id: product1.id,
        },
      ],
    });
  })

  it("should update an existent order item in a existent order", async () => {
    // Global Objects usados em todos os testes
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("customer123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    const productRepository = new ProductRepository();
    const product1 = new Product("product123", "Product 1", 10);
    const product2 = new Product("product234", "Product 2", 15);
    let orderItem1 = new OrderItem(
      "orderitem123",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    let orderItem2 = new OrderItem(
      "orderitem234",
      product2.name,
      product2.price,
      product2.id,
      3
    );

    const order1 = new Order("order123", customer1.id, [orderItem1]);

    // Criando o repositorio da order
    const orderRepository = new OrderRepository();
    // Criando um cliente e seu endereço
    customer1.changeAddress(address);
    await customerRepository.create(customer1);

    // Criando um produto que o cliente possa comprar
    await productRepository.create(product1);

    // Persistindo a order
    await orderRepository.create(order1);

    // Resgatando a order para validação
    const orderModel = await OrderModel.findOne({
      where: { id: order1.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: order1.id,
      customer_id: order1.customerId,
      total: order1.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: order1.id,
          product_id: product1.id,
        },
      ],
    });

    // Atualizando a quantidade do pedido do item que já existe na order
    orderItem1.updateQuantity(4);
    order1.updateOrdemItem(orderItem1);
    // Persistindo a order no banco
    await orderRepository.update(order1);

    // Resgatando a order para validação
    const orderModelUpdated = await OrderModel.findOne({
      where: { id: order1.id },
      include: ["items"],
    });

    expect(orderModelUpdated.toJSON()).toStrictEqual({
      id: order1.id,
      customer_id: order1.customerId,
      total: order1.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          price: orderItem1.price,
          quantity: orderItem1.quantity,
          order_id: order1.id,
          product_id: product1.id,
        },
      ],
    });

  });

  it("should find an order", async () => {
    // Global Objects usados em todos os testes
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("customer123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    // Criando um cliente e seu endereço
    customer1.changeAddress(address);
    await customerRepository.create(customer1);

    const productRepository = new ProductRepository();
    const product1 = new Product("product123", "Product 1", 10);
    // Criando um produto que o cliente possa comprar
    await productRepository.create(product1);

    // Criando o repositorio da order
    const orderRepository = new OrderRepository();
    let orderItem1 = new OrderItem(
      "orderitem123",
      product1.name,
      product1.price,
      product1.id,
      2
    );
    const order1 = new Order("order123", customer1.id, [orderItem1]);

    // Persistindo a order
    await orderRepository.create(order1);

    // Resgatando a order para validação
    const orderModel = await OrderModel.findOne({
      where: { id: order1.id },
      include: ["items"],
    });


    const foundOrder = await orderRepository.find("order123");
    const foundOrderItems = foundOrder.items;

    expect(orderModel.toJSON()).toStrictEqual({
      id: foundOrder.id,
      customer_id: foundOrder.customerId,
      total: foundOrder.total(),
      items: [
        {
          id: foundOrderItems[0].id,
          name: foundOrderItems[0].name,
          price: foundOrderItems[0].price,
          quantity: foundOrderItems[0].quantity,
          order_id: foundOrder.id,
          product_id: foundOrderItems[0].productId,          
        },
      ],
    });
  });

  it("should find all products", async () => {
    // Global Objects usados em todos os testes
    const customerRepository = new CustomerRepository();
    const customer1 = new Customer("customer123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    // Criando um cliente e seu endereço
    customer1.changeAddress(address);
    await customerRepository.create(customer1);

    const productRepository = new ProductRepository();
    const product1 = new Product("product123", "Product 1", 10);
    const product2 = new Product("product234", "Product 2", 15);
    // Criando um produto que o cliente possa comprar
    await productRepository.create(product1);
    await productRepository.create(product2);

    let orderItem1 = new OrderItem(
      "orderitem123",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    let orderItem2 = new OrderItem(
      "orderitem234",
      product2.name,
      product2.price,
      product2.id,
      3
    );

    const order1 = new Order("order123", customer1.id, [orderItem1]);
    const order2 = new Order("order234", customer1.id, [orderItem2]);
    // Criando o repositorio da order
    const orderRepository = new OrderRepository();
    // Persistindo a order
    await orderRepository.create(order1);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();
    const orders = [order1, order2];

    expect(orders).toEqual(foundOrders);    
  });
});