import amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { host, DeadL_Direct_Exchange, Dead_letter_Exchange, Dead_direct_queue_1, Dead_direct_queue_2, Dead_Route1, Dead_Route2, Type } from '../constants';

const assertExchange = async(channel: ConfirmChannel)=>{
    return await Promise.all([
        channel.assertExchange(DeadL_Direct_Exchange , Type.Direct),
        channel.assertExchange(Dead_letter_Exchange,Type.Direct)
    ]);
}

const assertQueue = async(channel: ConfirmChannel)=>{
        return await Promise.all([
            channel.assertQueue(Dead_direct_queue_1,{ durable: false, messageTtl: 30000, deadLetterExchange: DeadL_Direct_Exchange ,deadLetterRoutingKey: Dead_Route1  }),
            channel.assertQueue(Dead_direct_queue_2,{durable: false})
        ]);
}

const bindingQueue = async (channel: ConfirmChannel) =>{
    return await Promise.all([
        channel.bindQueue(Dead_direct_queue_1,DeadL_Direct_Exchange,Dead_Route1 ),
        channel.bindQueue(Dead_direct_queue_2, Dead_letter_Exchange, Dead_Route2)
    ]);
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

    channelData.publish(DeadL_Direct_Exchange, Dead_Route1, {message: 'Direct Message from producer'});
    channelData.publish(Dead_letter_Exchange, Dead_Route2, {message: 'Direct Message2 from producer'});
}

console.log("Start Pro");
procedure();