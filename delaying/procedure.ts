import amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { WORKING_EXCHANGE, WORKING_DLX , TTL_EXCHANGE, DODO_EXCHANGE, WORKING_QUEUE, host } from '../constants';

function assertExchange(channel : ConfirmChannel){
    return Promise.all([
        channel.assertExchange(WORKING_EXCHANGE,'fanout'),
        channel.assertExchange(WORKING_DLX,'fanout'),
        channel.assertExchange(TTL_EXCHANGE,'direct'),
        channel.assertExchange(DODO_EXCHANGE, 'fanout')
    ]);
}

function assertQueue(channel: ConfirmChannel){
    return Promise.all([
        channel.assertQueue("work-retry-1-10s", { messageTtl: 10000, deadLetterExchange: "DODO_DLX" }),
        channel.assertQueue("work-retry-1-40s", { messageTtl: 40000, deadLetterExchange: "DODO_DLX" }),
        channel.assertQueue("work-retry-1-1m", { messageTtl: 60000, deadLetterExchange: "DODO_DLX" })
    ]);  
}

function bind(channel: ConfirmChannel){
    return Promise.all([
        channel.bindQueue(WORKING_QUEUE,WORKING_EXCHANGE,""),
        
        channel.bindQueue("work-retry-1-10s", TTL_EXCHANGE, "retry-1"),
        channel.bindQueue("work-retry-1-40s", TTL_EXCHANGE, "retry-2"),
        channel.bindQueue("work-retry-1-1m", TTL_EXCHANGE, "retry-3"),

        channel.bindQueue(WORKING_QUEUE,DODO_EXCHANGE,"")
         
    ]);
}



async function procedure(){
    const connection = amqp.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async(channel: ConfirmChannel)=>{
           await assertExchange(channel);
           await assertQueue(channel);
           await bind(channel);
        }
    });
    console.log("Start Sending");

    await channelData.close();
    await connection.close();

    // connectionData.publish(exchangeName, RoutKey, message, {headers: {'x-delay':3000 }})
}


procedure();