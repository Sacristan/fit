import { describe, it, expect } from 'vitest';
import { tryAppendMerge } from './textMerge';

describe('tryAppendMerge', () => {
	it('merges when both sides only append different content', () => {
		const base = 'line1\nline2\n';
		const local = base + 'local addition\n';
		const remote = base + 'remote addition\n';
		expect(tryAppendMerge(base, local, remote)).toBe(base + 'local addition\n' + 'remote addition\n');
	});

	it('takes local when only local appended', () => {
		const base = 'line1\n';
		const local = base + 'local addition\n';
		const remote = base;
		expect(tryAppendMerge(base, local, remote)).toBe(local);
	});

	it('takes remote when only remote appended', () => {
		const base = 'line1\n';
		const local = base;
		const remote = base + 'remote addition\n';
		expect(tryAppendMerge(base, local, remote)).toBe(remote);
	});

	it('returns the shared content unchanged when nothing changed', () => {
		const base = 'unchanged\n';
		expect(tryAppendMerge(base, base, base)).toBe(base);
	});

	it('returns local as-is when local and remote are byte-identical, even if both differ from base', () => {
		const base = 'old\n';
		const same = 'old\nnew converging edit\n';
		expect(tryAppendMerge(base, same, same)).toBe(same);
	});

	it('merges when base is empty and both sides add different content', () => {
		expect(tryAppendMerge('', 'local only\n', 'remote only\n')).toBe('local only\nremote only\n');
	});

	it('returns null when local edits existing content instead of only appending', () => {
		const base = 'line1\nline2\n';
		const local = 'line1-edited\nline2\n';
		const remote = base + 'remote addition\n';
		expect(tryAppendMerge(base, local, remote)).toBeNull();
	});

	it('returns null when remote edits existing content instead of only appending', () => {
		const base = 'line1\nline2\n';
		const local = base + 'local addition\n';
		const remote = 'line1\nline2-edited\n';
		expect(tryAppendMerge(base, local, remote)).toBeNull();
	});

	it('returns null when both sides edit existing content differently', () => {
		const base = 'line1\nline2\n';
		const local = 'line1-local\nline2\n';
		const remote = 'line1-remote\nline2\n';
		expect(tryAppendMerge(base, local, remote)).toBeNull();
	});

	it('returns null when a side deletes part of the base instead of only appending', () => {
		const base = 'line1\nline2\nline3\n';
		const local = 'line1\nline3\n';
		const remote = base + 'remote addition\n';
		expect(tryAppendMerge(base, local, remote)).toBeNull();
	});
});
