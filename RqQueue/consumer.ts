import amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import { host } from '../constants';

// const host = 'amqp://localhost';
const queueName = "testQueue";

async function consumer(){
    const connection = amqp.connect([host]);
    const channelData = await connection.createChannel({
        setup: async (channel : ConfirmChannel) =>{
            channel.consume(queueName, (msg: any) =>{
                console.log(msg.content.toString());
                channel.ack(msg);
            });
        }
    });
}

console.log("Start Consumer");
consumer();