import { IProducer } from './producer.interface';
import { Kafka, Message, Producer } from 'kafkajs';
import { Logger } from '@nestjs/common';
import { delay } from 'lodash';

export class KafkaJSProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: string,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.producer = this.kafka.producer();
    this.logger = new Logger(topic);
  }

  async produce(message: Message) {
    await this.producer.send({ topic: this.topic, messages: [message] });
  }

  public async connect(): Promise<any> {
    try {
      await this.producer.connect();
    } catch (err) {
      this.logger.error('failed to connect to kafka', err);

      delay(await this.connect(), 5000, 'trying to reconnect');
    }
  }

  public async disconnect(): Promise<any> {
    await this.producer.disconnect();
  }
}
