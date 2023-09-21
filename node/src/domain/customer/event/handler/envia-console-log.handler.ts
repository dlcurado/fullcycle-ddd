import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import CustomerAddressChangedEvent from "../customer-address-changed.event";

export default class EnviaConsoleLogHandler implements EventHandlerInterface<CustomerAddressChangedEvent>{
  handle(event: CustomerAddressChangedEvent): void {
    console.log(`"Endereço do cliente: id=${event.eventData.id}, nome=${event.eventData.nome} alterado para: ${event.eventData.endereco}".`);
  }
  
}