import amqp from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';

const host = 'amqp://localhost';
const exchangeName = 'direct_logs';
// const queueName = 'directRoute';
const exchangeType = "direct";
const RoutingKey = "directRout";
const message = {workername: 'Jack'};

async function consumer (){
    const connection = amqp.connect([host]);
    let queName;
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) =>{
            await channel.assertExchange(exchangeName, exchangeType, {durable: false});
            const que = await channel.assertQueue('', {exclusive: true});
            queName =  que.queue;
            channel.bindQueue(queName, exchangeName, RoutingKey);
            channel.consume(queName, msg => {
                console.log(msg?.content.toString());
            }, { noAck: true});
        }
    });
}

console.log("start Consume");
consumer(); 