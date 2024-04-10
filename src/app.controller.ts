import { Controller, Get } from '@nestjs/common';
import { ProducerService } from './kafka/producer.service';

@Controller()
export class AppController {
  constructor(private readonly producerService: ProducerService) {}

  @Get()
  async getHello() {
    await this.producerService.produce('test', { value: 'Hello world' });

    return 'ale';
  }
}
