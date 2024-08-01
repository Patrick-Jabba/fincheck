import { ValidateBankAccountOwnershipService } from './../../bank-accounts/services/validate-bank-account-ownership.service';
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './../dto/create-transaction.dto';
import { UpdateTransactionDto } from './../dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { ValidateCategoryOwnershipService } from '../../categories/services/validate-categories-ownership.service';
import { ValidateTransactionOwnershipService } from './validate-transaction-ownership.service';
import { TransactionType } from '../entities/TransactionType';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepo: TransactionsRepository,
    private readonly validateBankAccountOwnershipService: ValidateBankAccountOwnershipService,
    private readonly validateCategoryOwnerShipService: ValidateCategoryOwnershipService,
    private readonly validateTransactionOwnerShipService: ValidateTransactionOwnershipService,
  ){}

  async create(userId: string, createTransactionDto: CreateTransactionDto) {
    const { 
      bankAccountId, 
      categoryId, 
      name, 
      value, 
      date, 
      type, 
    } = createTransactionDto;
    await this.validateEntitiesOwnership({
      userId, 
      bankAccountId,
      categoryId,
    });

    return this.transactionsRepo.create({
      data: {
        userId,
        bankAccountId,
        categoryId,
        name,
        value,
        date,
        type, 
      }
    })
  }

  findAllByUserId(
    userId: string, 
    filters: {
      month: number;
      year: number;
      bankAccountId?: string;
      type?: TransactionType},
  ) {
    return this.transactionsRepo.findMany({
      where: { 
        userId,
        bankAccountId: filters.bankAccountId,
        type: filters.type,
        date: {
          gte: new Date(Date.UTC(filters.year, filters.month)),
          lte: new Date(Date.UTC(filters.year, filters.month+1))
        },
      },
    })
  }

  async update(
    userId: string, 
    transactionId: string, 
    updateTransactionDto: UpdateTransactionDto
  ) {
    const { bankAccountId, categoryId, date, type, name, value} = updateTransactionDto;

    await this.validateEntitiesOwnership({
      userId,
      bankAccountId,
      categoryId,
      transactionId
    });

    return this.transactionsRepo.update({
      where: {
        id: transactionId,
      },
      data: {
        bankAccountId,
        categoryId,
        name,
        date,
        type,
        value,
      }
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateEntitiesOwnership({userId, transactionId});


    await  this.transactionsRepo.delete({
      where: {
        id: transactionId
      }
    });

    return null;
  }

  private async validateEntitiesOwnership({ 
    userId, 
    bankAccountId, 
    categoryId,
    transactionId
  }: { 
    userId: string; 
    bankAccountId?: string; 
    categoryId?: string;
    transactionId?: string; 
  }) {
    await Promise.all([
      transactionId && 
        this.validateTransactionOwnerShipService.validate(userId, transactionId),
      bankAccountId && 
        this.validateBankAccountOwnershipService.validate(userId, bankAccountId),
      categoryId &&
        this.validateCategoryOwnerShipService.validate(userId, categoryId)
    ]);
  }
}
