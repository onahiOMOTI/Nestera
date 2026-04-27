import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { StellarService } from './stellar.service';
import { TransactionDto } from './dto/transaction.dto';

@ApiTags('Blockchain')
@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly stellarService: StellarService) {}

  @Post('wallets/generate')
  @ApiOperation({
    summary: 'Generate a new Stellar keypair',
    description: 'Generates a new Stellar public/private keypair. **IMPORTANT**: The secret key is returned only once and must be stored securely.',
  })
  @ApiResponse({
    status: 201,
    description: 'Keypair generated successfully',
    schema: {
      type: 'object',
      properties: {
        publicKey: {
          type: 'string',
          example: 'GABCDEF234567ABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHJKLMN',
          description: 'Stellar public key (G... format)',
        },
        secretKey: {
          type: 'string',
          example: 'SABC1234...',
          description: 'Stellar secret key - store securely! Only shown once.',
        },
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - rate limit exceeded',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  generateWallet() {
    return this.stellarService.generateKeypair();
  }

  @Get('wallets/:publicKey/transactions')
  @ApiOperation({
    summary: 'Get recent on-chain transactions for a Stellar wallet',
    description: 'Retrieve recent transaction history for a Stellar public key from the Horizon API.',
  })
  @ApiParam({
    name: 'publicKey',
    description: 'The Stellar public key (starting with G) of the wallet',
    example: 'GAAZI4TCR3TY5OJHCTJC2A4QSY6CJWJH5IAJTGKIN2ER7LBNVKOCCWN',
  })
  @ApiResponse({
    status: 200,
    description: 'Array of recent transactions mapped to sanitized objects',
    type: [TransactionDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid public key format',
  })
  @ApiResponse({
    status: 404,
    description: 'Wallet not found or no transactions',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - rate limit exceeded',
  })
  @ApiResponse({
    status: 503,
    description: 'Horizon API unavailable',
  })
  getWalletTransactions(
    @Param('publicKey') publicKey: string,
  ): Promise<TransactionDto[]> {
    return this.stellarService.getRecentTransactions(publicKey);
  }

  @Get('rpc/status')
  @ApiOperation({
    summary: 'Get status of all configured RPC endpoints',
    description:
      'Returns information about primary and fallback RPC/Horizon endpoints for monitoring and debugging',
  })
  @ApiResponse({
    status: 200,
    description:
      'Status of all RPC endpoints including current active endpoint',
    schema: {
      type: 'object',
      example: {
        primary: 'https://soroban-testnet.stellar.org',
        fallbacks: ['https://rpc1.stellar.org', 'https://rpc2.stellar.org'],
        horizonPrimary: 'https://horizon-testnet.stellar.org',
        horizonFallbacks: ['https://horizon1.stellar.org'],
        currentRpcEndpoint: 'https://soroban-testnet.stellar.org',
      },
    },
  })
  @ApiResponse({ status: 429, description: 'Too many requests' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  getRpcStatus() {
    return this.stellarService.getEndpointsStatus();
  }
}
