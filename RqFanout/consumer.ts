import amqp from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { JsxEmit } from 'typescript';
import { host } from '../constants';

// const host = 'amqp://localhost';
const exchangeName = 'fanoutExchange';
const exchangeType = 'fanout';

async function consumer(){
    const connection = amqp.connect([host]);
    let queName ;
    const channelData = await connection.createChannel({
        json:true,
        setup: async (channel : ConfirmChannel)=>{
            await channel.assertExchange(exchangeName, exchangeType,{durable:false});
            const qu = await (channel.assertQueue('',{exclusive: true}));
            queName = qu.queue;
            console.log(queName);
            channel.bindQueue(queName,exchangeName,'');
            channel.consume( queName,(messge: ConsumeMessage | any) =>{
                 if(messge.content == null){
                     console.log("message is null");
                 }else{
                     console.log("not null");
                 }
                 console.log(messge?.content.toString());
                //  const msg = await messge.content.toString()
                // console.log(msg);
            });
        }
    });
}

console.log("Start Consuming");
consumer();