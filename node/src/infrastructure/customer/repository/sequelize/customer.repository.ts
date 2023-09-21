import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer-repository.interface";
import CustomerModel from "./customer.model";
import EventDispatcher from "../../../../domain/@shared/event/event-dispatcher";
import EnviaConsoleLog1Handler from "../../../../domain/customer/event/handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../../../../domain/customer/event/handler/envia-console-log2.handler";
import CustomerCreatedEvent from "../../../../domain/customer/event/customer-created.event";
import { json } from "sequelize";

export default class CustomerRepository implements CustomerRepositoryInterface {
  private eventDispatcher = new EventDispatcher();
  private eventHandler1 = new EnviaConsoleLog1Handler();
  private eventHandler2 = new EnviaConsoleLog2Handler();

  get EventHandler1(): EnviaConsoleLog1Handler {
    return this.eventHandler1;
  }

  get EventHandler2(): EnviaConsoleLog2Handler {
    return this.eventHandler2;
  }

  constructor(){
    this.eventDispatcher.register("CustomerCreatedEvent", this.eventHandler1);
    this.eventDispatcher.register("CustomerCreatedEvent", this.eventHandler2);
  }
      
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.Address.street,
      number: entity.Address.number,
      zipcode: entity.Address.zip,
      city: entity.Address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    }).then(() => {
      const customerCreatedEvent = new CustomerCreatedEvent({
        name: entity.name,
        description: json(entity),
      });

      this.eventDispatcher.notify(customerCreatedEvent);
    });
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: entity.name,
        street: entity.Address.street,
        number: entity.Address.number,
        zipcode: entity.Address.zip,
        city: entity.Address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Customer> {
    let customerModel;
    try {
      customerModel = await CustomerModel.findOne({
        where: {
          id,
        },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    const customer = new Customer(id, customerModel.name);
    const address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.zipcode,
      customerModel.city
    );
    customer.changeAddress(address);
    return customer;
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll();

    const customers = customerModels.map((customerModels) => {
      let customer = new Customer(customerModels.id, customerModels.name);
      customer.addRewardPoints(customerModels.rewardPoints);
      const address = new Address(
        customerModels.street,
        customerModels.number,
        customerModels.zipcode,
        customerModels.city
      );
      customer.changeAddress(address);
      if (customerModels.active) {
        customer.activate();
      }
      return customer;
    });

    return customers;
  }
}
