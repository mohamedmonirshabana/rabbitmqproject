import amqp from 'amqp-connection-manager';
import { ConfirmChannel } from 'amqplib';

const host = 'amqp://localhost';

const    WORKING_EXCHANGE="Exchange_1";
const    WORKING_DLX="Exchange_2";
const    TTL_EXCHANGE= "Exchange_3";
const    DODO_EXCHANGE= 'DODO_DLX';
const    WORKING_QUEUE= 'ququWorking';



async function consumer(){
    const connection = amqp.connect([host]);
    const channelData = await connection.createChannel({
        json: true,
        setup: async (channel: ConfirmChannel)=>{
            channel.consume(WORKING_QUEUE,message =>{
                console.log(message);
            })
        }
    });
}