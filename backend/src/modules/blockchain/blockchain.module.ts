import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { IndexerService } from './indexer.service';
import { DeadLetterEvent } from './entities/dead-letter-event.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([DeadLetterEvent]),
  ],
  providers: [IndexerService],
  exports: [IndexerService],
})
export class BlockchainModule {}
