import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { ProposalListItemDto } from './dto/proposal-list-item.dto';
import { ProposalVotesResponseDto } from './dto/proposal-votes-response.dto';
import { ProposalStatus } from './entities/governance-proposal.entity';
import { GovernanceService } from './governance.service';

@ApiTags('governance')
@Controller('governance/proposals')
export class GovernanceProposalsController {
  constructor(private readonly governanceService: GovernanceService) {}

  @Get()
  @ApiOperation({
    summary: 'List governance proposals',
    description:
      'Returns indexed proposals from the DB cache, optionally filtered by status.',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ProposalStatus,
    description:
      'Filter by proposal status (e.g. ACTIVE, PASSED, FAILED, CANCELLED)',
    example: 'ACTIVE',
  })
  @ApiResponse({
    status: 200,
    description:
      'List of proposals with computed vote percentages and timeline boundaries',
    type: [ProposalListItemDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid status filter value',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - rate limit exceeded',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  getProposals(
    @Query('status') statusKey?: string,
  ): Promise<ProposalListItemDto[]> {
    let status: ProposalStatus | undefined;

    if (statusKey !== undefined) {
      const byKey =
        ProposalStatus[statusKey.toUpperCase() as keyof typeof ProposalStatus];
      const byValue = Object.values(ProposalStatus).includes(
        statusKey as ProposalStatus,
      )
        ? (statusKey as ProposalStatus)
        : undefined;
      status = byKey ?? byValue;

      if (!status) {
        throw new BadRequestException(
          `Invalid status "${statusKey}". Valid values: ${Object.keys(ProposalStatus).join(', ')}`,
        );
      }
    }

    return this.governanceService.getProposals(status);
  }

  @Get(':id/votes')
  @ApiOperation({
    summary: 'Get proposal vote tally and recent voters',
    description:
      'Returns a proposal vote tally plus the most recent voters for a given proposal onChainId.',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Maximum number of recent voter entries to return',
    example: 20,
  })
  @ApiParam({
    name: 'id',
    description: 'On-chain proposal ID',
    type: 'integer',
    example: 42,
  })
  @ApiResponse({
    status: 200,
    description: 'Vote tally and recent voter list for proposal',
    type: ProposalVotesResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid proposal ID or limit parameter',
  })
  @ApiResponse({
    status: 404,
    description: 'Proposal not found',
  })
  @ApiResponse({
    status: 429,
    description: 'Too many requests - rate limit exceeded',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  getProposalVotes(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ): Promise<ProposalVotesResponseDto> {
    return this.governanceService.getProposalVotesByOnChainId(id, limit);
  }
}
