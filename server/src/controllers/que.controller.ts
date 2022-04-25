import { inject, service } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
  RestBindings,
  Response,
} from '@loopback/rest';
import {OrderRepository} from '../repositories';
import { AwsSqsService } from '../services';
//

export class QueController {
  constructor(
    @repository(OrderRepository)
    public orderRepository : OrderRepository,
    @service() public AwsSqsService: AwsSqsService,
    @inject(RestBindings.Http.RESPONSE) private response: Response
  ) {}

  
//get messages from que
  @get('/que')
  @response(200, {
    description: 'Array of Order model instances',
  })
  async func(
    ){       
      return await this.AwsSqsService.receive_message();
    }

//change VisibilityTimeout 
  @patch('/que/{ReceiptHandle}') 
  async updateById(    
    @param.path.string('ReceiptHandle') ReceiptHandle: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['VisibilityTimeout'],
            properties: {
              VisibilityTimeout: {
                type: 'number',
              },
            },
          },
        },
      },
    })
    order: any,
  ){      
      const res:any = await this.AwsSqsService.changeVisibility(ReceiptHandle, order.VisibilityTimeout);      
      if(!res.ok){
        this.response.status(400).send({
          message: res.message,
        });
      }else{
        this.response.status(204).send({
          message: res.message,
        });
      }
    return this.response;
    
  }
//delete message from que 
  @del('/que/{ReceiptHandle}')
  @response(204, {
    description: 'Order DELETE success',
  })
  async deleteById(@param.path.binary('ReceiptHandle') ReceiptHandle: string){   
    await this.AwsSqsService.delete_message(ReceiptHandle);   
  }
}
