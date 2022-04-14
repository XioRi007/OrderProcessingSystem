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
} from '@loopback/rest';
import {Order} from '../models';
import {OrderRepository} from '../repositories';
var AWS = require('aws-sdk');
AWS.config.update({region: 'REGION',accessKeyId: "AKIAQNO2VL4XJ5JQP5QF",
secretAccessKey: "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"});

var sqs = new AWS.SQS({apiVersion: '2012-11-05'});


export class OrderController {
  constructor(
    @repository(OrderRepository)
    public orderRepository : OrderRepository,
  ) {}

@post('/orders', {
  responses: {
    '200': {
      description: 'Todo model instance',
      content: {'application/json': {schema: getModelSchemaRef(Order)}},
    },
  },
})
async create(
  @requestBody({
    content: {
      'application/json': {
        schema: getModelSchemaRef(Order, {title: 'NewOrder', exclude: ['_id']}),
      },
    },
  })
  order: Omit<Order, "_id">,
) {
  const res = await this.orderRepository.create(order);
  var params = {
    DelaySeconds: 0,
    MessageAttributes: {},
    MessageBody: JSON.stringify(order),
      MessageGroupId: "Group1",  
    QueueUrl: "https://sqs.us-east-1.amazonaws.com/028912738094/test-que.fifo"
  };
  
  sqs.sendMessage(params, (err:Error)=>{
    if(err){
      console.log(err);
      
      return err;
    }
    else{
      return res; 
    }
    }); 
}


  @get('/orders/count')
  @response(200, {
    description: 'Order model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Order) where?: Where<Order>,
  ): Promise<Count> {
    return this.orderRepository.count(where);
  }

  @get('/orders')
  @response(200, {
    description: 'Array of Order model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Order, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Order) filter?: Filter<Order>,
  ): Promise<Order[]> {
    return this.orderRepository.find(filter);
  }

  @patch('/orders')
  @response(200, {
    description: 'Order PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
    @param.where(Order) where?: Where<Order>,
  ): Promise<Count> {
    return this.orderRepository.updateAll(order, where);
  }

  @get('/orders/{id}')
  @response(200, {
    description: 'Order model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Order, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Order, {exclude: 'where'}) filter?: FilterExcludingWhere<Order>
  ): Promise<Order> {
    return this.orderRepository.findById(id, filter);
  }

  @patch('/orders/{id}')
  @response(204, {
    description: 'Order PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Order, {partial: true}),
        },
      },
    })
    order: Order,
  ): Promise<void> {
    await this.orderRepository.updateById(id, order);
  }

  @put('/orders/{id}')
  @response(204, {
    description: 'Order PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() order: Order,
  ): Promise<void> {
    await this.orderRepository.replaceById(id, order);
  }

  @del('/orders/{id}')
  @response(204, {
    description: 'Order DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.orderRepository.deleteById(id);
  }
}
