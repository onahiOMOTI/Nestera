import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import {
  RegisterDto,
  LoginDto,
  GetNonceDto,
  VerifySignatureDto,
  LinkWalletDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ auth: { limit: 5, ttl: 15 * 60 * 1000 } })
  @ApiOperation({
    summary: 'Register a new email/password account',
    description: 'Creates a new user account with email and password. Rate limited to 5 attempts per 15 minutes.',
  })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '550e8400-e29b-41d4-a716-446655440000' },
            email: { type: 'string', example: 'alice@example.com' },
            name: { type: 'string', nullable: true },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid registration data or email already exists' })
  @ApiResponse({ status: 429, description: 'Too many registration attempts - please try again later' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @Throttle({ auth: { limit: 5, ttl: 15 * 60 * 1000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login and receive a JWT',
    description: 'Authenticate with email and password to receive a JWT token for API access. Rate limited to 5 attempts per 15 minutes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            name: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['USER', 'ADMIN'] },
            kycStatus: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED'] },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid credentials' })
  @ApiResponse({ status: 429, description: 'Too many login attempts - please try again later' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('nonce')
  @Throttle({ auth: { limit: 5, ttl: 15 * 60 * 1000 } })
  @ApiOperation({
    summary: 'Generate a one-time nonce for wallet signature',
    description: 'Generates a random nonce that must be signed by the user\'s Stellar wallet to verify ownership. Rate limited to 5 requests per 15 minutes.',
  })
  @ApiQuery({
    name: 'publicKey',
    description: 'Stellar public key (G... format)',
    required: true,
    example: 'GABCDEF234567ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHJKLMN',
  })
  @ApiResponse({
    status: 200,
    description: 'Nonce generated successfully',
    schema: {
      type: 'object',
      properties: {
        nonce: { type: 'string', example: 'abc123def456789...' },
        expiresAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid public key format' })
  @ApiResponse({ status: 429, description: 'Too many requests - please try again later' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getNonce(@Query('publicKey') publicKey: string) {
    return this.authService.generateNonce(publicKey);
  }

  @Post('verify-signature')
  @Throttle({ auth: { limit: 5, ttl: 15 * 60 * 1000 } })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Verify wallet signature and receive a JWT',
    description: 'Verifies the Ed25519 signature of the nonce and issues a JWT token. Rate limited to 5 attempts per 15 minutes.',
  })
  @ApiResponse({
    status: 200,
    description: 'Signature verified, JWT issued',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            publicKey: { type: 'string', example: 'GABCDEF...' },
            role: { type: 'string' },
            kycStatus: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid signature or nonce' })
  @ApiResponse({ status: 429, description: 'Too many verification attempts' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  verifySignature(@Body() dto: VerifySignatureDto) {
    return this.authService.verifySignature(dto);
  }

  /**
   * POST /auth/link-wallet
   *
   * Links a Stellar wallet address to the currently authenticated email account.
   *
   * Pre-conditions (enforced by this endpoint):
   *  - Caller must provide a valid Bearer JWT (JwtAuthGuard)
   *  - publicKey must be a valid Stellar Ed25519 public key
   *  - signature must be a valid Ed25519 signature of `nonce` by the wallet's secret key
   *  - publicKey must not already be linked to ANY account (returns 409 if so)
   */
  @Post('link-wallet')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Link a Stellar wallet address to the authenticated email account',
    description:
      '1. Call GET /auth/nonce?publicKey=<key> to get a fresh nonce. ' +
      '2. Sign the nonce bytes with the wallet secret key (Ed25519). ' +
      '3. POST { publicKey, nonce, signature } with your Bearer token.',
  })
  @ApiResponse({ status: 200, description: 'Wallet linked successfully' })
  @ApiResponse({ status: 400, description: 'Invalid public key format or signature' })
  @ApiResponse({
    status: 401,
    description: 'Invalid or missing JWT / bad signature',
  })
  @ApiResponse({
    status: 409,
    description: 'Wallet already linked to an account',
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  linkWallet(
    @Request() req: { user: { id: string } },
    @Body() dto: LinkWalletDto,
  ) {
    return this.authService.linkWallet(req.user.id, dto);
  }
}
