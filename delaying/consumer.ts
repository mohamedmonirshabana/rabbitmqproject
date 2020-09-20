import * as amqp from "amqp-connection-manager";
import { ConfirmChannel, ConsumeMessage } from "amqplib";
import { host, WORKING_EXCHANGE, WORKING_DLX , TTL_EXCHANGE, DODO_EXCHANGE, WORKING_QUEUE } from '../constants';

async function consumer(){
    const connection = await amqp.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel)=>{
            channel.consume(WORKING_QUEUE, async (message: ConsumeMessage | any) => {
                let content: any = Buffer.from(message.content).toString();
                console.log("message Received", content);
                content = JSON.parse(content);
                try{
                    if(content.attempt && content.attempt == 3){
                        channelData.ack(message);
                        console.log('message');
                        return;
                    }
                    throw new Error("Error");
                }catch(e){
                    channelData.ack(message);
                    let content: any = Buffer.from(message.content).toString();
                    content = JSON.parse(content);
                    let attempt = ++content.attempt || 1;
                    if(attempt <= 3){
                        content.attempt = attempt;
                        let routingKey = `retry-${attempt}`;
                        await channelData.publish(TTL_EXCHANGE,routingKey,content);
                        return;
                    }
                    console.log("Faild  Handle");
                }
            });//WORKING_QUEUE
        }
    });
}

console.log("Start");
consumer();