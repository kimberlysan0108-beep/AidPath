import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',testMatch:'e2e.spec.ts',use:{baseURL:process.env.E2E_BASE_URL??'http://localhost:4173',headless:true},reporter:'list'});
