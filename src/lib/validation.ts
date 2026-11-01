import { z } from 'zod';

export const CreateProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  repositoryUrl: z.string().url('Invalid repository URL'),
});

export const ImportGitHubSchema = z.object({
  repositoryUrl: z.string().url('Invalid repository URL'),
});

export const CreateClaimSchema = z.object({
  claimType: z.enum([
    'decision',
    'rationale',
    'rejected_approach',
    'experiment_result',
    'unfinished_task',
    'dependency',
    'ownership',
    'open_question',
  ]),
  claimText: z.string().min(1, 'Claim text is required'),
  verificationStatus: z
    .enum(['supported', 'partially_supported', 'unverified', 'conflicting', 'missing_evidence'])
    .default('unverified'),
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type ImportGitHubInput = z.infer<typeof ImportGitHubSchema>;
export type CreateClaimInput = z.infer<typeof CreateClaimSchema>;
