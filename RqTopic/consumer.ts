import ampq from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { host } from '../constants';

// const host = 'amqp://localhost';
const exchangeName = 'RqTopicExchange';
const exchangeType = "topic";
const key ="anounse.foo";
const message = {userpass:"p@ane"};


async function consumer(){
    const connection = ampq.connect([host]);
    let queuename;
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) =>{
            channel.assertExchange(exchangeName, exchangeType, {durable: false});
            const que = await channel.assertQueue('',{exclusive: true});
            queuename =que.queue ;
            channel.bindQueue(queuename,exchangeName, key);
            channel.consume(queuename, (msg: ConsumeMessage | any) =>{
                console.log(msg.content.toString());
            },{noAck: true});
        }
    });
}

console.log("Start Consumer ");
consumer();