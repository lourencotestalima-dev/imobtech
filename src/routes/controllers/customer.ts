import { Request, Response } from 'express';
import { Body, Get, JsonController, Param, Post, Put, QueryParams, Req, Res, UploadedFile, UseBefore } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { ErrorHandler } from '../../utils/errors/ErrorHandler';
import { CustomerService } from '../../services/customer';
import { CustomerEntity } from '../../entities/customer';
import { CustomerData, SearchParams } from '../../models/customer';
import { Authenticate } from '../middlewares/authenticate';

@Service()
@JsonController('/customer')
export class CustomerController {
  constructor(
  @Inject(() => CustomerService) private customerService: CustomerService
  ) {}

  @Post('/')
  @UseBefore(Authenticate)
  async create(@Body() body: CustomerData, @Res() res: Response) {
    try {
      await this.customerService.create(body);
      return null;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Get('/')
  @UseBefore(Authenticate)
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const response = await this.customerService.getAll(req.query as unknown as SearchParams);
      return response;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Put('/:id')
  @UseBefore(Authenticate)
  async update(@Param('id') id: string, @Body() body: CustomerData, @Res() res: Response) {
    try {
      await this.customerService.update(id, body);
      return null;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Post('/upload-csv')
  @UseBefore(Authenticate)
  async uploadCsv(@UploadedFile('file') file: Express.Multer.File, @Res() res: Response) {
    try {
      await this.customerService.uploadCsv(file);
      return null;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }
}