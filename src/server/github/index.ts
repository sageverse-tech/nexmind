import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { db } from '../db';
import { sourceEvents } from '../db/schema';

const GITHUB_API_BASE = 'https://api.github.com';

interface GitHubRepoInfo {
  owner: string;
  repo: string;
}

export async function parseGitHubUrl(url: string): Promise<GitHubRepoInfo> {
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) {
    throw new Error('Invalid GitHub repository URL');
  }
  return { owner: match[1], repo: match[2] };
}

export async function fetchRepositoryMetadata(owner: string, repo: string) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}`;
  const response = await axios.get(url, {
    headers: process.env.GITHUB_TOKEN
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {},
  });
  return response.data;
}

export async function fetchCommits(owner: string, repo: string, page = 1, perPage = 30) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/commits`;
  const response = await axios.get(url, {
    params: { page, per_page: perPage },
    headers: process.env.GITHUB_TOKEN
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {},
  });
  return response.data;
}

export async function fetchPullRequests(owner: string, repo: string, page = 1, perPage = 30) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/pulls`;
  const response = await axios.get(url, {
    params: { page, per_page: perPage, state: 'all' },
    headers: process.env.GITHUB_TOKEN
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {},
  });
  return response.data;
}

export async function fetchIssues(owner: string, repo: string, page = 1, perPage = 30) {
  const url = `${GITHUB_API_BASE}/repos/${owner}/${repo}/issues`;
  const response = await axios.get(url, {
    params: { page, per_page: perPage, state: 'all' },
    headers: process.env.GITHUB_TOKEN
      ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
      : {},
  });
  return response.data;
}

export async function importGitHubRepository(
  projectId: string,
  sourceConnectionId: string,
  owner: string,
  repo: string
) {
  const results = {
    commits: 0,
    pullRequests: 0,
    issues: 0,
    errors: [] as string[],
  };

  // Fetch commits
  try {
    const commits = await fetchCommits(owner, repo);
    for (const commit of commits) {
      const sourceId = `commit-${commit.sha.substring(0, 8)}`;
      await db()
        .insert(sourceEvents)
        .values({
          id: uuid(),
          projectId,
          sourceConnectionId,
          sourceType: 'commit',
          sourceId,
          title: commit.commit.message.split('\n')[0],
          content: commit.commit.message,
          sourceUrl: commit.html_url,
          timestamp: new Date(commit.commit.author.date),
          metadata: {
            author: commit.commit.author.name,
            committer: commit.commit.committer?.name,
            sha: commit.sha,
          },
        })
        .onConflictDoNothing();
      results.commits++;
    }
  } catch (error) {
    results.errors.push(`Failed to import commits: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Fetch pull requests
  try {
    const prs = await fetchPullRequests(owner, repo);
    for (const pr of prs) {
      const sourceId = `pr-${pr.number}`;
      await db()
        .insert(sourceEvents)
        .values({
          id: uuid(),
          projectId,
          sourceConnectionId,
          sourceType: 'pull_request',
          sourceId,
          title: pr.title,
          content: pr.body || '',
          sourceUrl: pr.html_url,
          timestamp: new Date(pr.created_at),
          metadata: {
            author: pr.user.login,
            status: pr.state,
            number: pr.number,
          },
        })
        .onConflictDoNothing();
      results.pullRequests++;
    }
  } catch (error) {
    results.errors.push(`Failed to import pull requests: ${error instanceof Error ? error.message : String(error)}`);
  }

  // Fetch issues
  try {
    const issues = await fetchIssues(owner, repo);
    for (const issue of issues) {
      const sourceId = `issue-${issue.number}`;
      await db()
        .insert(sourceEvents)
        .values({
          id: uuid(),
          projectId,
          sourceConnectionId,
          sourceType: 'issue',
          sourceId,
          title: issue.title,
          content: issue.body || '',
          sourceUrl: issue.html_url,
          timestamp: new Date(issue.created_at),
          metadata: {
            author: issue.user.login,
            status: issue.state,
            number: issue.number,
          },
        })
        .onConflictDoNothing();
      results.issues++;
    }
  } catch (error) {
    results.errors.push(`Failed to import issues: ${error instanceof Error ? error.message : String(error)}`);
  }

  return results;
}
