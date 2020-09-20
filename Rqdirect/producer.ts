import amqp from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { host, Direct_Exchange, Direct_Queue, Rout_Direct_Key, directmessage , Type } from '../constants';


async function assert_Exchange(channel : ConfirmChannel){
    return channel.assertExchange(Direct_Exchange,Type.Direct);
}

async function assert_Queue(channel : ConfirmChannel){
    return channel.assertQueue(Direct_Queue);
}


async function procedure(){
    const connection = amqp.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) =>{
            return await Promise.all([
                 assert_Exchange(channel),
                 assert_Queue(channel),

            ]);
            
        }
    });


    channelData.publish(Direct_Exchange,Rout_Direct_Key, directmessage );
}

console.log("Start Direct ");
procedure();