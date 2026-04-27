import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SavingsProductType } from '../entities/savings-product.entity';

export class SavingsProductDto {
  @ApiProperty({
    description: 'Product UUID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Fixed 12-Month Plan',
  })
  name: string;

  @ApiProperty({
    enum: SavingsProductType,
    description: 'Product type',
    example: SavingsProductType.FIXED,
  })
  type: SavingsProductType;

  @ApiPropertyOptional({
    description: 'Product description',
    nullable: true,
    example: 'A fixed-term savings plan with competitive interest rates',
  })
  description: string | null;

  @ApiProperty({
    description: 'Annual interest rate (%)',
    example: 8.5,
  })
  interestRate: number;

  @ApiProperty({
    description: 'Minimum subscription amount (in XLM)',
    example: 1000,
  })
  minAmount: number;

  @ApiProperty({
    description: 'Maximum subscription amount (in XLM)',
    example: 1000000,
  })
  maxAmount: number;

  @ApiPropertyOptional({
    description: 'Tenure in months (e.g., for fixed deposits)',
    nullable: true,
    example: 12,
  })
  tenureMonths: number | null;

  @ApiPropertyOptional({
    description: 'Soroban vault contract ID (if deployed)',
    nullable: true,
    example: 'CDLZFC3T7B4G4H5H3H4G5H6G7H8G9H0G1H2I3J4K5L6M7N',
  })
  contractId: string | null;

  @ApiProperty({
    description: 'Whether the product is currently active',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Risk level classification (e.g., Low, Medium, High)',
    example: 'Low',
  })
  riskLevel: string;

  @ApiProperty({
    description: 'Total Value Locked (aggregated local balance in XLM)',
    example: 1500000.50,
  })
  tvlAmount: number;

  @ApiProperty({
    description: 'Product creation timestamp',
    type: Date,
    example: '2025-01-15T10:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Product last update timestamp',
    type: Date,
    example: '2025-01-20T15:30:00Z',
  })
  updatedAt: Date;
}
