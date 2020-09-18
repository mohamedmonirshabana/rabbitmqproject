import  * as amqp from 'amqp-connection-manager';
import { ConfirmChannel,  ConsumeMessage } from 'amqplib';
import { host, WORKING_EXCHANGE, WORKING_DLX , TTL_EXCHANGE, DODO_EXCHANGE, WORKING_QUEUE } from '../constants';

async function consumer(){
    const connection = await amqp.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel)=>{
            channel.consume("ququWorking", handleDeadMessage);//WORKING_QUEUE
        }
    });

    const handleDeadMessage = (message: ConsumeMessage) =>{
        let content: any = Buffer.from(message.content).toString();
        console.log("Dead Message Received", content);
        content = JSON.parse(content);
        try{
            if(content.attempt && content.attempt == 3){
                channelData.ack(message);
                console.log("Message ");
                return ;
            }
            throw new Error("error or Handle");
        }catch(e){
            delayedDelivery(message);
        }
    }

    const delayedDelivery = async (message : ConsumeMessage)=>{
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

        console.log("Failed Handle Delayed");
    }

}

// const handelDeadMessage = (message : ConsumeMessage) =>{
//     let content: any = Buffer.from(message.content).toString();
//     console.log("Dead Message Recived",content);

//     content = JSON.parse(content);

//     try{
//         if(content.attempt && content.attempt == 3){
//             channelData.ack(message);
//             console.log("Message Handled");
//             return;
//         }
//         throw new Error("fucking error ");
//     } catch(err){
//         dealyDeliver(message);
//     }
// };



// const dealyDeliver = async (message: ConsumeMessage) =>{
//     channelData.ack(message);
//     let connect: any = Buffer.from(message).toString();
//     content = JSON.parse(content);
//     let attempt = ++content.attempt || 1 ;
//     if(attempt <=3){
//         content.attempt = attempt;
//         let routingKey = `retry-${attempt}`;
//         await channelWrapper.publish(TTL_EXCHANGE, routingKey,connect);
//         return;
//     }
//     console.log("Failed Handle Delayed Message");
// }

console.log("Start");
consumer();