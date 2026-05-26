import { Request, Response } from 'express';
import { Body, Get, JsonController, Param, Post, Put, QueryParams, Req, Res, UploadedFile } from 'routing-controllers';
import { Inject, Service } from 'typedi';
import { ErrorHandler } from '../../utils/errors/ErrorHandler';
import { CustomerService } from '../../services/customer';
import { CustomerEntity } from '../../entities/customer';
import { SearchParams } from '../../models/customer';

@Service()
@JsonController('/customer')
export class CustomerController {
  constructor(
  @Inject(() => CustomerService) private customerService: CustomerService
  ) {}

  @Post('/')
  async create(@Body() body: CustomerEntity, @Res() res: Response) {
    try {
      await this.customerService.create(body);
      return null;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Get('/')
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      return this.customerService.getAll(req.query as unknown as SearchParams);
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Put('/:id')
  async update(@Param('id') id: string, @Body() body: CustomerEntity, @Res() res: Response) {
    try {
      await this.customerService.update(id, body);
      return null;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Post('/upload-csv')
  async uploadCsv(@UploadedFile('file') file: Express.Multer.File, @Res() res: Response) {
    try {
      await this.customerService.uploadCsv(file);
      return null;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }
}