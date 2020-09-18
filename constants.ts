export enum Type {
    Direct  = 'direct',
    Fanout = 'fanout',
    Topic = 'topic'
};

export const host = 'amqp://localhost';

//-------Direct 
export const Direct_Exchange = "directExchange";
export const Direct_Queue = "directQueue";
export const Rout_Direct_Key ="Droute";
export const Bining_Key = Rout_Direct_Key;
export const directmessage ={name: "medo"};
//--------------Fanout
export const Fanout_Exchange = 'FanoutExchange';
export const Fanout_Queue_1 = 'DesignQueue';
export const Fanout_Queue_2 = 'ASPDeveloperQueue';
export const Fanout_Queue_3 = 'PHPQueue';
export const fanoutMessage = {task : "Finish your Task"};
//------------------------------------Topic
export const Topic_Exchange = "TopicExchange";
export const Topic_Queue = "TopicQueue";
export const Topic_message = {name: "Nodejs"};
//-----------------------------------delay
export const  WORKING_EXCHANGE ="WORKING_EXCHANGE";
export const WORKING_DLX="Exchange_2";
export const TTL_EXCHANGE= "TTL_EXCHANGE";

export const DODO_EXCHANGE= 'DeadLetterExtchang';
export const  WORKING_QUEUE= 'ququWorking';

//--------------------------------deadletter
export const Direct_Queue_1 = "directQueue_1";
export const Direct_Queue_2 = "directQueue_2";
export const deadLetterExchange = "deadLetter";