import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import {Order} from '../models';
let AWS = require('aws-sdk');
@injectable({scope: BindingScope.TRANSIENT})
export class AwsSqsService { 
  sqs; 
  binaryAgent;
  constructor() {    
    AWS.config.update({region: 'REGION',accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY });
    this.sqs = new AWS.SQS({apiVersion: '2012-11-05'});
    this.binaryAgent = (str:String) => {

      var newBin = str.split(" ");
      var binCode = [];
      
      for (let i = 0; i < newBin.length; i++) {
          binCode.push(String.fromCharCode(parseInt(newBin[i], 2)));
        }
      return binCode.join("");
      }
  } 
  async send_message(order:Order, _id?:String){
    let pr = "[";
    
    order.products.forEach((e,i)=>{
      pr+=JSON.stringify(e);
      pr+=","
    });
    pr+="]";
    pr = pr.substring(0, pr.length-2) + "]";
    var params = {
      DelaySeconds: 0,
      MessageAttributes: {
        "_id": {
          DataType: "String",
          StringValue: _id?.toString()
        },
        "address": {
          DataType: "String",
          StringValue: order.address
        },
        "general_price": {
          DataType: "String",
          StringValue: order.general_price.toString()
        },
        "products": {
          DataType: "String",
          StringValue: pr
        },
        "user_email": {
          DataType: "String",
          StringValue: order.user_email
        },
        "user_name": {
          DataType: "String",
          StringValue: order.user_name
        },
        "status": {
          DataType: "String",
          StringValue: "added"
        },
      },
      MessageBody: "Stock APP",
      QueueUrl: process.env.QUEUE_URL 
    };
    try{
      const res = await this.sqs.sendMessage(params).promise();
      console.log(res);
      return {ok:true, message:"Message has been added to the que"};
    }catch(err){
      return {ok:false, message:err.message};
    }
    
    
  }
  async receive_message(){
    var params = {
      AttributeNames: [
         "SentTimestamp"
      ],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
         "All"
      ],
      QueueUrl: process.env.QUEUE_URL,
      VisibilityTimeout: 30,
      WaitTimeSeconds: 2
     };
     

    const res = await this.sqs.receiveMessage(params).promise(); 
    console.log(res);
    
    if(!res.Messages) return [];
    const l = res.Messages.map((e:any,i:number)=>{   
        let r:any = {};
        for(let obj in e.MessageAttributes){
            if(obj == "products"){
                r[obj]=JSON.parse(e.MessageAttributes[obj].StringValue);

            }else{
                r[obj]=e.MessageAttributes[obj].StringValue;
            }                
        }   
        r.ReceiptHandle=e.ReceiptHandle;
        return r;
    });
      return l;
  }
  async delete_message(ReceiptHandle:String){
    
    var deleteParams = {
      QueueUrl: process.env.QUEUE_URL,
      ReceiptHandle: this.binaryAgent(ReceiptHandle)
    }; 
    try{
      await this.sqs.deleteMessage(deleteParams).promise();
      return {ok:true, message:"Message has been deleted"};
    }catch(err){
      return {ok:false, message:err.message};
    }
  }
  async changeVisibility(ReceiptHandle:String, VisibilityTimeout:number){
    var params = {
      QueueUrl: process.env.QUEUE_URL ,
      ReceiptHandle: this.binaryAgent(ReceiptHandle),
      VisibilityTimeout: VisibilityTimeout 
    };
    try{
      await this.sqs.changeMessageVisibility(params).promise();
      return {ok:true, message:"Visibility changed"};
    }catch(err){
      return {ok:false, message:err.message};
    }    
  }
}
