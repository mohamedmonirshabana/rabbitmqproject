import amqp from 'amqp-connection-manager';
import { ConfirmChannel  } from 'amqplib';

const host = 'amqp://localhost';
const queueName = "testQueue";
const message = {content: "test Queue"};



async function procedure(){
    const connection = amqp.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel) =>{
            channel.assertQueue(queueName);
        }
    });
    await channelData.sendToQueue(queueName, message);
}

console.log("Start work");
procedure();

