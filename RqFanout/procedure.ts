import amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';
import {host, Fanout_Exchange, Fanout_Queue_1, Fanout_Queue_2, Fanout_Queue_3, fanoutMessage} from '../constants';



async function producer(){
    const connection = amqp.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel : ConfirmChannel) =>{
            return await Promise.all([
                channel.assertExchange(Fanout_Exchange,'fanout'),
                channel.assertQueue(Fanout_Queue_1),
                channel.assertQueue(Fanout_Queue_2),
                channel.assertQueue(Fanout_Queue_3),
                channel.bindQueue(Fanout_Queue_1, Fanout_Exchange,""),
                channel.bindQueue(Fanout_Queue_2, Fanout_Exchange,""),
                channel.bindQueue(Fanout_Queue_3, Fanout_Exchange,""),
            ]);

        }
    });
    channelData.publish(Fanout_Exchange,"", fanoutMessage,{persistent: true});
    
    
}

console.log("start Direct");
producer();