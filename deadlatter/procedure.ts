import amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { host,Direct_Exchange, Direct_Queue, Direct_Queue_1, deadLetterExchange,Bining_Key, Rout_Direct_Key } from '../constants';

const assertExchange = async(channel: ConfirmChannel)=>{
    return await Promise.all([
        channel.assertExchange(Direct_Exchange, "direct"),
        channel.assertExchange(deadLetterExchange,"direct")
    ]);
}

const assertQueue = async(channel: ConfirmChannel)=>{
        channel.assertQueue(Direct_Queue,{ durable: false, messageTtl: 30000, deadLetterExchange: deadLetterExchange ,deadLetterRoutingKey: "ROUTE_KEY_DIRECT2"});
        channel.assertQueue(Direct_Queue_1,{durable: false});
}

const bindingQueue = (channel: ConfirmChannel) =>{
    channel.bindQueue(Direct_Queue,Direct_Exchange,Bining_Key );
    channel.bindQueue(Direct_Queue_1, deadLetterExchange, Rout_Direct_Key);
}

async function procedure(){
    const connection = amqp.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel : ConfirmChannel) =>{
           await assertExchange(channel);
           await assertQueue(channel);
           await bindingQueue(channel);
        }
    });

    channelData.publish(Direct_Exchange, Rout_Direct_Key, {message: 'Direct Message from producer'});


}

console.log("Start Pro");
procedure();