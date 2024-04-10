import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Message } from 'kafkajs';
import { IProducer } from './producer.interface';
import { ConfigService } from '@nestjs/config';
import { KafkaJSProducer } from './kafkajs.producer';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();

  constructor(private readonly configService: ConfigService) {}

  public async produce(topic: string, message: Message) {
    const producer = await this.getProducer(topic);
    await producer.produce(message);
  }

  public async onApplicationShutdown() {
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }

  private async getProducer(topic: string) {
    const producer = this.producers.get(topic);

    if (producer) {
      return producer;
    }
    const newProducer = new KafkaJSProducer(
      topic,
      this.configService.get('KAFKA_BROKER'),
    );

    await newProducer.connect();
    this.producers.set(topic, newProducer);

    return newProducer;
  }
}
