import { IConsumer } from './consumer.interface';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopic,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import { Logger } from '@nestjs/common';
import { delay } from 'lodash';
import * as retry from 'async-retry';

export class KafkaJSConsumer implements IConsumer {
  private readonly consumer: Consumer;
  private readonly kafka: Kafka;
  private readonly logger: Logger;

  constructor(
    private readonly topic: ConsumerSubscribeTopic,
    config: ConsumerConfig,
    broker: string,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topic.topic}-${config.groupId}`);
  }

  public async connect(): Promise<any> {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error('failed to connect to kafka', err);

      delay(await this.connect(), 5000, 'trying to reconnect');
    }
  }

  public async disconnect(): Promise<any> {
    await this.consumer.disconnect();
  }

  public async consume(
    onMessage: (message: KafkaMessage) => Promise<void>,
  ): Promise<any> {
    await this.consumer.subscribe(this.topic);
    await this.consumer.run({
      eachMessage: async ({ message, partition }) => {
        this.logger.debug(
          `Message partition - ${partition}`,
          message.value.toString(),
        );
        try {
          await retry(async () => onMessage(message), {
            retries: 3,
            onRetry: (error, attempt) =>
              this.logger.error(
                `Error while sending message attempt ${attempt / 3}`,
                error,
              ),
          });
        } catch (err) {
          this.logger.error('Err consuming msg');
          // await this.addMsgToDlq();
        }
        await onMessage(message);
      },
    });
  }
}
