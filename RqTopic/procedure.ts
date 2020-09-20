import ampq from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import {host, Topic_Exchange, Topic_Queue, Topic_message, Type} from '../constants';

// const host = 'amqp://localhost';
// const exchangeName = 'RqTopicExchange';
// const exchangeType = "topic";
// const key ="anounse.foo";
// const message = {userpass:"p@ane"};

async function procedure(){
    const connection = ampq.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel : ConfirmChannel) =>{
            return await Promise.all([
                channel.assertExchange(Topic_Exchange, Type.Topic),
                channel.assertQueue(Topic_Queue, {durable: true}),

            ]);
            // channel.assertExchange(exchangeName,exchangeType,{durable: false});
        }
    });
    channelData.publish(Topic_Exchange,"develop.nodejs.#",Topic_message,{persistent: true});
}

console.log("Start Topic");
procedure();