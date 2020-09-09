import amqp from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';

const host = 'amqp://localhost';
const exchangeName = 'direct_logs';
const queueName = 'directRoute';
const exchangeType = "direct";
const RoutingKey = "directRout";
const message =  {workername: 'Jack'};

async function procedure(){
    const connection = amqp.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) =>{
            channel.assertExchange(exchangeName, exchangeType, {durable: false});
            // channel.publish(exchangeName,RoutingKey,Buffer.from(message));
        }
    });

    channelData.publish(exchangeName,RoutingKey,message);
}

console.log("Start Direct ");
procedure();