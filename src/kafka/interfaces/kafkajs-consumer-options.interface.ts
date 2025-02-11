import { ConsumerConfig, ConsumerSubscribeTopic, KafkaMessage } from 'kafkajs';

export interface ConsumerOptionsInterface {
  topic: ConsumerSubscribeTopic;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<void>;
}
