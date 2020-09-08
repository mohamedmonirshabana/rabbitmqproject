import amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

const host = 'amqp://localhost';
const exchangeName = 'directExchange';
const exchangeType = 'direct';
const queueName = 'directQueue';
const message = {employeename: "medo"};
 