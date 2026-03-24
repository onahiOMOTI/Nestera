import { Module } from '@nestjs/common';
import { SavingsModule } from './modules/savings/savings.module';
import { GovernanceModule } from './modules/governance/governance.module';
import { BlockchainModule } from './modules/blockchain/blockchain.module';

@Module({
  imports: [SavingsModule, GovernanceModule, BlockchainModule],
})
export class AppModule {}
