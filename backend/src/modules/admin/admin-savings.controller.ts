import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { SavingsService } from '../savings/savings.service';
import { SavingsProduct } from '../savings/entities/savings-product.entity';
import { CreateProductDto } from '../savings/dto/create-product.dto';
import { UpdateProductDto } from '../savings/dto/update-product.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@ApiTags('admin/savings')
@Controller('admin/savings')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminSavingsController {
  constructor(private readonly savingsService: SavingsService) {}

  @Post('products')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a savings product (admin only)',
    description: 'Create a new savings product with specify interest rate, limits, and tenure. Admin access required.',
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: SavingsProduct,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid product data (validation failed)',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - No valid JWT token provided',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin access required',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - rate limit exceeded',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async createProduct(@Body() dto: CreateProductDto): Promise<SavingsProduct> {
    return await this.savingsService.createProduct(dto);
  }

  @Patch('products/:id')
  @ApiOperation({
    summary: 'Update a savings product (admin only)',
    description: 'Update an existing savings product details. Admin access required.',
  })
  @ApiParam({
    name: 'id',
    description: 'Product UUID',
    type: 'string',
    format: 'uuid',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({
    status: 200,
    description: 'Product updated successfully',
    type: SavingsProduct,
  })
  @ApiResponse({ status: 400, description: 'Invalid product data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin required' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async updateProduct(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<SavingsProduct> {
    return await this.savingsService.updateProduct(id, dto);
  }
}
