import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateProjectSchema, ImportGitHubSchema, CreateClaimSchema } from '@/lib/validation';

describe('Validation Schemas', () => {
  it('should validate project creation input', () => {
    const valid = {
      name: 'Test Project',
      description: 'Test description',
      repositoryUrl: 'https://github.com/test/repo',
    };

    const result = CreateProjectSchema.parse(valid);
    expect(result.name).toBe('Test Project');
  });

  it('should reject invalid project URLs', () => {
    const invalid = {
      name: 'Test',
      repositoryUrl: 'not-a-url',
    };

    expect(() => CreateProjectSchema.parse(invalid)).toThrow();
  });

  it('should validate GitHub import schema', () => {
    const valid = {
      repositoryUrl: 'https://github.com/test/repo',
    };

    const result = ImportGitHubSchema.parse(valid);
    expect(result.repositoryUrl).toContain('github.com');
  });

  it('should validate claim creation schema', () => {
    const valid = {
      claimType: 'decision',
      claimText: 'This is a test claim',
    };

    const result = CreateClaimSchema.parse(valid);
    expect(result.verificationStatus).toBe('unverified');
  });
});
