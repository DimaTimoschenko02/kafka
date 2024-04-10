import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.service';
import { TestConsumer } from './consumers/test.consumer';

@Module({
  exports: [ProducerService, ConsumerService],
  providers: [ProducerService, ConsumerService, TestConsumer],
})
export class KafkaModule {}
