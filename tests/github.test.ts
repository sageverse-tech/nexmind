import { describe, it, expect } from 'vitest';
import { parseGitHubUrl } from '@/server/github';

describe('GitHub Integration', () => {
  it('should parse GitHub URLs correctly', () => {
    const url = 'https://github.com/sageverse-tech/nexmind';
    const result = parseGitHubUrl(url);

    expect(result.owner).toBe('sageverse-tech');
    expect(result.repo).toBe('nexmind');
  });

  it('should reject invalid GitHub URLs', () => {
    const url = 'https://example.com/invalid';

    expect(() => parseGitHubUrl(url)).toThrow('Invalid GitHub repository URL');
  });
});
