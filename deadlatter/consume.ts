import amqp from 'amqp-connection-manager';
import { ConfirmChannel, ConsumeMessage } from 'amqplib';
import { host, DeadL_Direct_Exchange, Dead_letter_Exchange, Dead_direct_queue_1, Dead_direct_queue_2, Dead_Route1, Dead_Route2, Type} from '../constants';

// async function consumeing (channel : ConfirmChannel){
//         await channel.consume(Direct_Queue, async (message: ConsumeMessage | any) =>{
//             const M = await Buffer.from(message.content).toString();
//             console.log(M);
//         })
// }

// async function consumeing_1 (channel : ConfirmChannel){
//     await channel.consume(Direct_Queue_1, (message: ConsumeMessage | any) =>{
//             console.log("dead message", Buffer.from(message.content).toString());
//         });
// }

async function consume(){
    const connection = amqp.connect([host]);
    const ChannelData = await connection.createChannel({
        json: true,
        setup: async (channel : ConfirmChannel) =>{
            channel.consume(Dead_direct_queue_1, async (message: ConsumeMessage | any) =>{
                const msg = await Buffer.from(message.content).toString();
                console.log(msg);
            });
            channel.consume(Dead_direct_queue_2, async(message: ConsumeMessage | any) =>{
                const msg = await Buffer.from(message.content).toString();
                console.log(msg);
            });
            // await consumeing(channel);
            // await consumeing_1(channel);
        }
    });
}

console.log("Start Consume");
consume();