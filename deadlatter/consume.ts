import amqp from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { host, Direct_Exchange, Direct_Queue, Direct_Queue_1, deadLetterExchange, Bining_Key, Rout_Direct_Key } from '../constants';

async function consumeing (channel : ConfirmChannel){
    return await Promise.all([
        channel.consume(Direct_Queue,async (message: ConsumeMessage | any) =>{
            console.log("dead message", Buffer.from(message.content).toString());
        })
    ]);
}

async function consumeing_1 (channel : ConfirmChannel){
    return await Promise.all([
        channel.consume(Direct_Queue_1,async (message: ConsumeMessage | any) =>{
            console.log("dead message", Buffer.from(message.content).toString());
        })
    ]);
}

async function consume(){
    const connection = amqp.connect([host]);
    const ChannelData = await connection.createChannel({
        json: true,
        setup: async (channel : ConfirmChannel) =>{
            await consumeing(channel);
            await consumeing_1(channel);
        }
    });
}
console.log("Start Consume");
consume();