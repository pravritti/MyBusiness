import { Account } from 'models';
import TenantRepository from '@/repositories/TenantRepository';
import { IAccount } from '@/interfaces';
import { Knex } from 'knex';

export default class AccountRepository extends TenantRepository {
  /**
   * Gets the repository's model.
   */
  get model() {
    return Account.bindKnex(this.knex);
  }

  /**
   * Retrieve accounts dependency graph.
   * @returns {}
   */
  async getDependencyGraph(withRelation, trx) {
    const accounts = await this.all(withRelation, trx);

    return this.model.toDependencyGraph(accounts);
  }

  /**
   * Retrieve.
   * @param {string} slug
   * @return {Promise<IAccount>}
   */
  findBySlug(slug: string) {
    return this.findOne({ slug });
  }

  /**
   * Changes account balance.
   * @param {number} accountId
   * @param {number} amount
   * @return {Promise<void>}
   */
  async balanceChange(accountId: number, amount: number): Promise<void> {
    const method: string = amount < 0 ? 'decrement' : 'increment';

    await this.model.query().where('id', accountId)[method]('amount', amount);
    this.flushCache();
  }

  /**
   * Activate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  activateById(userId: number): Promise<IAccount> {
    return super.update({ active: 1 }, { id: userId });
  }

  /**
   * Inactivate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  inactivateById(userId: number): Promise<void> {
    return super.update({ active: 0 }, { id: userId });
  }

  /**
   * Activate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  async activateByIds(userIds: number[], trx): Promise<IAccount> {
    const results = await this.model
      .query(trx)
      .whereIn('id', userIds)
      .patch({ active: true });

    this.flushCache();
    return results;
  }

  /**
   * Inactivate user by the given id.
   * @param  {number} userId - User id.
   * @return {Promise<void>}
   */
  async inactivateByIds(userIds: number[], trx): Promise<IAccount> {
    const results = await this.model
      .query(trx)
      .whereIn('id', userIds)
      .patch({ active: false });

    this.flushCache();
    return results;
  }

  /**
   *
   * @param {string} currencyCode
   * @param extraAttrs
   * @param trx
   * @returns
   */
  findOrCreateAccountReceivable = async (
    currencyCode: string = '',
    extraAttrs = {},
    trx?: Knex.Transaction
  ) => {
    let result = await this.model
      .query(trx)
      .onBuild((query) => {
        if (currencyCode) {
          query.where('currencyCode', currencyCode);
        }
        query.where('accountType', 'accounts-receivable');
      })
      .first();

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        name: this.i18n.__('account.accounts_receivable.currency', {
          currency: currencyCode
        }),
        accountType: 'accounts-receivable',
        currencyCode,
        active: 1,
        ...extraAttrs,
      });
    }
    return result;
  };

  findOrCreateAccountsPayable = async (
    currencyCode: string = '',
    extraAttrs = {},
    trx?: Knex.Transaction
  ) => {
    let result = await this.model
      .query(trx)
      .onBuild((query) => {
        if (currencyCode) {
          query.where('currencyCode', currencyCode);
        }
        query.where('accountType', 'accounts-payable');
      })
      .first();

    if (!result) {
      result = await this.model.query(trx).insertAndFetch({
        name: this.i18n.__('account.accounts_payable.currency', {
          currency: currencyCode,
        }),
        accountType: 'accounts-payable',
        currencyCode,
        active: 1,
        ...extraAttrs,
      });
    }
    return result;
  };
}
