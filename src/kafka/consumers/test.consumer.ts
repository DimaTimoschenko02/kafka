import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../consumer.service';

@Injectable()
export class TestConsumer implements OnModuleInit {
  constructor(private readonly consumerService: ConsumerService) {}

  async onModuleInit(): Promise<void> {
    await this.consumerService.consume({
      topic: { topic: 'test' },
      config: { groupId: 'test-consumer' },
      onMessage: async (message) => {
        console.log(message.value.toString());
      },
    });
  }
}
