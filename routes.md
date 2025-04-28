# Routes Checklist

## API Routes

### Bonuses
- [ ] `/api/bonuses/options` - GET - Returns bonus options for select dropdown

### Transactions
- [X] `/api/transactions` - GET - Gets transactions for a customer account
- [ ] `/api/transactions` - POST - Creates a new transaction
- [ ] `/api/transactions` - PUT - Updates an existing transaction
- [ ] `/api/transactions/[id]` - DELETE - Deletes a transaction by ID
- [ ] `/api/transactions/report-obratu` - Various routes
- [ ] `/api/transactions/premium-bonus` - Various routes
- [ ] `/api/transactions/salesManager` - Various routes

### Accounts
- [X] `/api/accounts` - GET - Gets all active accounts with transformed data
- [X] `/api/accounts/[id]` - Various methods (GET, PUT, DELETE)

### Saving Periods
- [X] `/api/saving-periods` - Various methods
- [X] `/api/saving-periods/[id]` - Various methods

### Customers
- [X] `/api/customers/[id]` - Various methods
- [ ] `/api/customers/saving-periods` - Various methods

### Sales Manager
- [ ] `/api/sales-manager/customers` - Various methods
- [ ] `/api/sales-manager/transactions` - Various methods

### Health
- [ ] `/api/health` - Various methods

## Server Actions

### Bonus Actions
- [ ] `getBonusesServerAction`
- [ ] `getBonusServerAction`
- [ ] `createBonusServerAction`
- [ ] `updateBonusServerAction`
- [ ] `deleteBonusServerAction`
- [ ] `refreshBonusesDataServerAction`

### Dealer Actions
- [ ] `addDealerServerAction`
- [ ] `updateDealerServerAction`
- [ ] `refreshDealersDataServerAction`

### Sales Manager Actions
- [ ] `addSalesManagerServerAction`
- [ ] `updateSalesManagerServerAction`
- [ ] `refreshSalesManagersDataServerAction`

### Transaction Actions
- [ ] (Empty file - to be implemented)

## Service Layer

### Bonus Service
- [ ] `create(data: Prisma.BonusCreateInput): Promise<Bonus>`
- [ ] `update(id: number, data: Prisma.BonusUpdateInput): Promise<Bonus>`
- [ ] `delete(id: number): Promise<Bonus>`
- [ ] `get(id: number): Promise<Bonus>`
- [ ] `getAll(): Promise<Bonus[]>`
- [ ] `getBonusesForSelect(): Promise<SelectOption[]>`

### Account Service
- [ ] `create(data: CreateAccountDTO): Promise<Account>`
- [ ] `update(id: number, data: UpdateAccountDTO): Promise<Account>`
- [ ] `get(id: number): Promise<AccountResponseDTO>`
- [ ] `getAll(): Promise<Account[]>`
- [ ] `delete(id: number): Promise<Account>`
- [ ] `getAccountWithSavingPeriods(id: number): Promise<AccountResponseDTO | null>`
- [ ] `getAllActiveAccounts(): Promise<AccountResponseDTO[]>`

### Transaction Service
- [ ] `create(data: CreateTransactionDTO): Promise<Transaction>`
- [ ] `get(id: number): Promise<Transaction>`
- [ ] `getAll(): Promise<Transaction[]>`
- [ ] `update(id: number, data: UpdateTransactionDTO): Promise<Transaction>`
- [ ] `delete(id: number): Promise<Transaction>`
- [ ] `getByAccountId(accountId: number): Promise<Transaction[]>`

### Sales Manager Service
- [ ] `create(data: CreateSalesManagerDTO): Promise<SalesManagerResponseDTO>`
- [ ] `update(id: number, data: UpdateSalesManagerDTO): Promise<SalesManager>`
- [ ] `delete(id: number): Promise<SalesManager>`
- [ ] `get(id: number): Promise<SalesManager>`
- [ ] `getAll(): Promise<SalesManagerResponseDTO[]>`
- [X] `getSalesManagersForSelect(): Promise<SalesManagerSelectDTO[]>`
- [ ] `getLifeTimePointsOfCustomers(salesManagerId: number): Promise<number>`
- [ ] `getCustomersWithAccounts(salesManagerId: number)`
- [ ] `getCustomersCountsInfo(salesManagerId: number, year: number)`

### Saving Period Service
- [ ] (Empty file - to be implemented)

### Dealer Service
- [ ] `create(data: CreateDealerDTO): Promise<DealerResponseDTO>`
- [ ] `update(id: number, data: UpdateDealerDTO): Promise<Dealer>`
- [ ] `delete(id: number): Promise<Dealer>`
- [ ] `get(id: number): Promise<Dealer>`
- [ ] `getAll(): Promise<Dealer[]>`
- [X] `getDealersForSelect(): Promise<DealerSelectDTO[]>`

### Customer Service
- [ ] (Service file not found) 