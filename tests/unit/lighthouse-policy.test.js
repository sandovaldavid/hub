import { describe, expect, test } from 'bun:test';
import {
	aggregateAuditValues,
	aggregateCategoryScores,
	LIGHTHOUSE_POLICY,
	parseRunsPerUrl,
} from '@scripts/run-lighthouse.mjs';

describe('Lighthouse release policy', () => {
	test('keeps the agreed category floors and audit ceilings', () => {
		expect(LIGHTHOUSE_POLICY.categories).toEqual([
			{ id: 'performance', minScore: 0.9 },
			{ id: 'accessibility', minScore: 0.95 },
			{ id: 'best-practices', minScore: 0.95 },
			{ id: 'seo', minScore: 0.95 },
		]);
		expect(LIGHTHOUSE_POLICY.audits).toEqual([
			{ id: 'first-contentful-paint', maxNumericValue: 3_000, unit: 'ms' },
			{ id: 'largest-contentful-paint', maxNumericValue: 4_000, unit: 'ms' },
			{ id: 'cumulative-layout-shift', maxNumericValue: 0.1, unit: '' },
			{ id: 'total-blocking-time', maxNumericValue: 200, unit: 'ms' },
			{ id: 'speed-index', maxNumericValue: 3_000, unit: 'ms' },
			{ id: 'total-byte-weight', maxNumericValue: 500_000, unit: 'bytes' },
		]);
	});

	test('defaults to three runs and accepts only a positive override', () => {
		expect(parseRunsPerUrl(undefined)).toBe(3);
		expect(parseRunsPerUrl('')).toBe(3);
		expect(parseRunsPerUrl('1')).toBe(1);
		expect(parseRunsPerUrl('3')).toBe(3);
		expect(() => parseRunsPerUrl('0')).toThrow(
			'LIGHTHOUSE_RUNS must be a positive integer, received: 0'
		);
		expect(() => parseRunsPerUrl('1.5')).toThrow(
			'LIGHTHOUSE_RUNS must be a positive integer, received: 1.5'
		);
	});

	test('keeps optimistic aggregation across runs', () => {
		expect(aggregateCategoryScores([0.7, 0.9, 0.8])).toBe(0.9);
		expect(aggregateAuditValues([300, 100, 200])).toBe(100);
	});
});
