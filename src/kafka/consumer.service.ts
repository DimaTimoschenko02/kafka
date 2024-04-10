import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { IConsumer } from './consumer.interface';
import { ConsumerOptionsInterface } from './interfaces/kafkajs-consumer-options.interface';
import { ConfigService } from '@nestjs/config';
import { KafkaJSConsumer } from './kafkajs.consumer';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(private readonly configService: ConfigService) {}

  public async consume({ onMessage, topic, config }: ConsumerOptionsInterface) {
    const consumer = new KafkaJSConsumer(
      topic,
      config,
      this.configService.get('KAFKA_BROKER'),
    );

    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown(): Promise<any> {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
