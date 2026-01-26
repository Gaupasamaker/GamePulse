import { SEED_COMPANIES } from '@/data/companies';

describe('GamePulse Smoke Tests', () => {
    test('Seed data is correctly populated', () => {
        expect(SEED_COMPANIES.length).toBeGreaterThanOrEqual(30);
        expect(SEED_COMPANIES.find(c => c.ticker === 'NTDOY')).toBeDefined();
        expect(SEED_COMPANIES.find(c => c.ticker === 'SONY')).toBeDefined();
    });

    test('Company categories are valid', () => {
        const validCategories = ['Publisher', 'Platform', 'Holding', 'Indie-public', 'Esports-related'];
        SEED_COMPANIES.forEach(company => {
            expect(validCategories).toContain(company.category);
        });
    });

    test('Tickers are uppercase', () => {
        SEED_COMPANIES.forEach(company => {
            // Except those from KRX or other markets that might have dots/numbers
            if (!company.ticker.includes('.')) {
                expect(company.ticker).toBe(company.ticker.toUpperCase());
            }
        });
    });
});
