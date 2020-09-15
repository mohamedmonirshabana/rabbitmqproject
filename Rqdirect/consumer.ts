import amqp from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { host, Direct_Exchange, Direct_Queue, Bining_Key } from '../constants';


async function bind(channel: ConfirmChannel){
    return channel.bindQueue(Direct_Queue, Direct_Exchange,Bining_Key);
}

async function consumer (){
    const connection = amqp.connect([host]);
    let queName;
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) =>{
            return await Promise.all([
                bind,
                channel.bindQueue(Direct_Queue, Direct_Exchange,Bining_Key),
                channel.consume(Direct_Queue, message => {
                    console.log(message?.content.toString());
                }, {noAck: true})
            ]);
        }
    });
    
}


console.log("start Consume");
consumer(); 