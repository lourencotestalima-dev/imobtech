import { Response } from 'express';
import { Body, Delete, Get, JsonController, Param, Post, Put, Req, Res, UploadedFile, UseBefore } from 'routing-controllers';
import { OpenAPI } from 'routing-controllers-openapi';
import { Inject, Service } from 'typedi';
import { ErrorHandler } from '../../utils/errors/ErrorHandler';
import { CustomerService } from '../../services/customer';
import { CustomerData, SearchParams } from '../../models/customer';
import { Authenticate } from '../middlewares/authenticate';
import { ICustomRequest } from '../../models/request';

@Service()
@OpenAPI({ security: [{ bearerAuth: [] }] })
@JsonController('/customer')
export class CustomerController {
  constructor(
    @Inject(() => CustomerService) private customerService: CustomerService
  ) {}

  @Post('/')
  @UseBefore(Authenticate)
  async create(@Req() req: ICustomRequest, @Body() body: CustomerData, @Res() res: Response) {
    try {
      await this.customerService.create(body, req.session!.userId);
      return null;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Get('/')
  @UseBefore(Authenticate)
  async getAll(@Req() req: ICustomRequest, @Res() res: Response) {
    try {
      const response = await this.customerService.getAll(req.query as unknown as SearchParams);
      return response;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Get('/:id')
  @UseBefore(Authenticate)
  async getById(@Param('id') id: string, @Res() res: Response) {
    try {
      const response = await this.customerService.getById(id);
      return response;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Put('/:id')
  @UseBefore(Authenticate)
  async update(@Req() req: ICustomRequest, @Param('id') id: string, @Body() body: CustomerData, @Res() res: Response) {
    try {
      await this.customerService.update(id, body, req.session!.userId);
      return null;
    } catch (err) {
      return new ErrorHandler(res, err);
    }
  }

  @Delete('/:id')
  @UseBefore(Authenticate)
  async delete(@Req() req: ICustomRequest, @Param('id') id: string, @Res() res: Response) {
    try {
      await this.customerService.delete(id, req.session!.userId);
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
