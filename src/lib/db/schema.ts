import {
    pgTable,
    serial,
    text,
    timestamp,
    boolean,
    integer,
    date,
    varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const customers = pgTable('customers', {
    id: serial('id').primaryKey(),
    publicId: text('public_id').notNull(),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    fullName: text('full_name').notNull(),
    birthDate: date('birth_date'),
    registrationNumber: integer('registration_number'),
    ico: text('ico'),
    phone: text('phone'),
    email: text('email'),
    registratedSince: date('registrated_since'),
    salonName: text('salon_name'),
    address: text('address'),
    town: text('town'),
    psc: text('psc'),
    note: text('note'),
    gdpr: integer('gdpr'),
    dealerId: integer('dealer_id'),
    salesManagerId: integer('sales_manager_id'),
    salesManagerSinceQ: integer('sales_manager_since_q'),
    salesManagerSinceYear: integer('sales_manager_since_year'),
})

export const accounts = pgTable('accounts', {
    id: serial('id').primaryKey(),
    active: boolean('active').notNull().default(true),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    lifetimePoints: integer('lifetime_points').notNull().default(0),
    currentYearPoints: integer('current_year_points').notNull().default(0),
    totalDepositedPoints: integer('total_deposited_points').notNull().default(0),
    totalWithdrawnPoints: integer('total_withdrawn_points').notNull().default(0),
    averagePointsBeforeSalesManager: integer('average_points_before_sales_manager'),
    customerId: integer('customer_id')
        .notNull()
        .references(() => customers.id),
})

export const transactions = pgTable('transactions', {
    id: serial('id').primaryKey(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    year: integer('year').notNull(),
    quarter: integer('quarter').notNull(),
    points: integer('points').notNull(),
    value: integer('value').notNull(),
    date: date('date').notNull(),
    voucher: text('voucher'),
    accountId: integer('account_id')
        .notNull()
        .references(() => accounts.id),
})

// Relations
export const customersRelations = relations(customers, ({ one, many }) => ({
    account: one(accounts, {
        fields: [customers.id],
        references: [accounts.customerId],
    }),
    dealer: one(customers, {
        fields: [customers.dealerId],
        references: [customers.id],
    }),
}))

export const accountsRelations = relations(accounts, ({ one, many }) => ({
    customer: one(customers, {
        fields: [accounts.customerId],
        references: [customers.id],
    }),
    transactions: many(transactions),
}))

export const transactionsRelations = relations(transactions, ({ one }) => ({
    account: one(accounts, {
        fields: [transactions.accountId],
        references: [accounts.id],
    }),
}))
