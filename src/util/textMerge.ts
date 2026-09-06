export function tryAppendMerge(base: string, local: string, remote: string): string | null {
	if (local === remote) return local;
	if (!local.startsWith(base) || !remote.startsWith(base)) return null;
	return base + local.slice(base.length) + remote.slice(base.length);
}
