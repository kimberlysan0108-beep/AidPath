import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const sessions=sqliteTable('sessions',{id:text('id').primaryKey(),revision:integer('revision').notNull().default(0),answers:text('answers').notNull().default('{}'),plan:text('plan').notNull().default('[]'),createdAt:integer('created_at').notNull(),updatedAt:integer('updated_at').notNull()},t=>[index('session_expiry').on(t.updatedAt)]);
export const events=sqliteTable('events',{id:text('id').primaryKey(),sessionId:text('session_id').notNull(),name:text('name').notNull(),programId:text('program_id'),value:integer('value'),createdAt:integer('created_at').notNull()},t=>[index('event_session').on(t.sessionId),index('event_time').on(t.createdAt)]);
export const sources=sqliteTable('sources',{url:text('url').primaryKey(),hash:text('hash').notNull(),status:text('status').notNull(),checkedAt:text('checked_at').notNull(),error:text('error')});
export const policies=sqliteTable('policy_versions',{id:text('id').primaryKey(),programId:text('program_id').notNull(),version:text('version').notNull(),payload:text('payload').notNull(),createdAt:text('created_at').notNull()});
export const failures=sqliteTable('failures',{id:text('id').primaryKey(),route:text('route').notNull(),code:text('code').notNull(),createdAt:integer('created_at').notNull()});

export const approvals=sqliteTable('policy_approvals',{id:text('id').primaryKey(),sourceHash:text('source_hash').notNull(),reviewedAt:text('reviewed_at').notNull()});
