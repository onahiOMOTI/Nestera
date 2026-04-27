import { IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationPreferenceDto {
  @ApiPropertyOptional({
    description: 'Receive email notifications for account activity',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Receive in-app notifications',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  inAppNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Receive notifications about sweep events',
    example: false,
  })
  @IsOptional()
  @IsBoolean()
  sweepNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Receive notifications about claim status updates',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  claimNotifications?: boolean;

  @ApiPropertyOptional({
    description: 'Receive notifications about yield earnings',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  yieldNotifications?: boolean;
}
