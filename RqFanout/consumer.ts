import amqp from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { JsxEmit } from 'typescript';
import { host, Fanout_Exchange, Fanout_Queue_1, Fanout_Queue_2, Fanout_Queue_3 } from '../constants';

// const host = 'amqp://localhost';
// const exchangeName = 'fanoutExchange';
// const exchangeType = 'fanout';

async function consumer(){
    const connection = amqp.connect([host]);
    
    const channelData = await connection.createChannel({
        json:true,
        setup: async (channel : ConfirmChannel)=>{
            return await Promise.all([
                channel.consume(Fanout_Queue_1, message => {
                    console.log(message?.content.toString());
                }, {noAck: true}),
                channel.consume(Fanout_Queue_2, message => {
                    console.log(message?.content.toString());
                }, {noAck: true}),
                channel.consume(Fanout_Queue_3, message => {
                    console.log(message?.content.toString());
                }, {noAck: true}),
            ]);
        }
    });
}

console.log("Start Consuming");
consumer();