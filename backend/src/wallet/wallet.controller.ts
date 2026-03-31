import { Controller, Get, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getWallet(@CurrentUser() user: any) {
    return this.walletService.getWalletSummary(user.id);
  }

  @Get('balance')
  @UseGuards(JwtAuthGuard)
  async getBalance(@CurrentUser() user: any) {
    // New users may not have a wallet row yet, so create one on first read.
    const wallet = await this.walletService.getOrCreateWallet(user.id);
    return {
      balance: wallet.balance,
      totalEarnings: wallet.totalEarnings,
      pendingEarnings: wallet.pendingEarnings,
    };
  }
}
