import ampq from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

const host = 'amqp://localhost';
const exchangeName = 'RqTopicExchange';
const exchangeType = "topic";
const key ="anounse.foo";
const message = {userpass:"p@ane"};

async function procedure(){
    const connection = ampq.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel : ConfirmChannel) =>{
            channel.assertExchange(exchangeName,exchangeType,{durable: false});
        }
    });
    channelData.publish(exchangeName,key,message);
}

console.log("Start Topic");
procedure();