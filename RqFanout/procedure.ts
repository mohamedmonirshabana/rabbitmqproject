import amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import {host} from '../constants';

// const host = 'amqp://localhost';
const exchangeName = 'fanoutExchange';
const exchangeType = 'fanout';
const queueName = 'fanoutQueue';
const message = {employeename: "medo"};

async function producer(){
    const connection = amqp.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel : ConfirmChannel) =>{
            channel.assertExchange(exchangeName, exchangeType, {durable: false});
            // channel.assertQueue(queueName,{exclusive: true});

        }
    });
    // channelData.sendToQueue(queueName,message);
    channelData.publish(exchangeName,'',message);
}

console.log("start Direct");
producer();