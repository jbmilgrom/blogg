---
title: Making GitHub Actions Suck a Little Less
subtitle: A Simple Auto-Retry Workflow for Transient Failures
description: Stop babysitting your CI/CD pipeline with a workflow that automatically retries network failures.
date: 2026-01-14
tags: post
layout: layouts/post.liquid
hasTOC: no
---

Do you find yourself babysitting your CI environment because of transients failures like `ETIMEDOUT`. `ECONNRESET`. `npm ERR! network`. `502 Bad Gateway`? Yeah us too.

Our problem has gotten even worse for us lately because of all the AI coding agents under our command. Great throughput requires great responsibility.

## The Solution: A Simple Auto-Retry Workflow

This retry loop:

```yaml
name: Auto-Retry Failed Workflows

on:
  workflow_run:
    workflows: ["Deploy"] # Your main workflow name
    types: [completed]
    branches: [main, dev]

permissions:
  actions: write

jobs:
  check-and-retry:
    runs-on: ubuntu-latest
    if: github.event.workflow_run.conclusion == 'failure'
    steps:
      - name: Check retry count
        id: check
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          ATTEMPT=${{ github.event.workflow_run.run_attempt }}
          echo "attempt=$ATTEMPT" >> $GITHUB_OUTPUT

          # Max 3 total attempts (1 original + 2 retries)
          if [ "$ATTEMPT" -ge 3 ]; then
            echo "should_retry=false" >> $GITHUB_OUTPUT
          else
            echo "should_retry=true" >> $GITHUB_OUTPUT
          fi

      - name: Download and analyze logs
        if: steps.check.outputs.should_retry == 'true'
        id: analyze
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh run view ${{ github.event.workflow_run.id }} \
            --repo ${{ github.repository }} \
            --log-failed > failed_logs.txt 2>&1 || true

          # Transient error patterns
          TRANSIENT_PATTERNS="ETIMEDOUT|ECONNRESET|ENOTFOUND|rate limit|socket hang up|npm ERR! network|fetch failed|503 Service|502 Bad Gateway|504 Gateway|Connection reset|CERT_HAS_EXPIRED"

          if grep -qiE "$TRANSIENT_PATTERNS" failed_logs.txt; then
            echo "is_transient=true" >> $GITHUB_OUTPUT
            MATCHED=$(grep -oiE "$TRANSIENT_PATTERNS" failed_logs.txt | head -1)
            echo "matched_pattern=$MATCHED" >> $GITHUB_OUTPUT
          else
            echo "is_transient=false" >> $GITHUB_OUTPUT
          fi

      - name: Re-run failed jobs
        if: steps.check.outputs.should_retry == 'true' && steps.analyze.outputs.is_transient == 'true'
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: |
          gh run rerun ${{ github.event.workflow_run.id }} \
            --failed \
            --repo ${{ github.repository }}
```

That's it, drop this in `.github/workflows/auto-retry.yml` and you're done - I'm seeing anything in here specific to our infra besides the name of our github token in the secrets config and the "main" workflow we want watched, plus some branch names.

By the way, this entire workflow was vibecoded. I described the problem to Claude, it wrote the workflow, I reviewed and merged... case in point about the compounding nature of the problem.

## How It Works

**Event-driven trigger.** The `workflow_run` event fires immediately when your main workflow completes. The connection is by **name**, not filename. In our case, `workflows: ["Deploy"]` matches the `name: Deploy` field in our deploy workflow. When _any_ of the child jobs fail, the entire workflow is marked as failed, and the retry workflow fires.

> ```yaml
> # deploy.yml
> name: Deploy # <-- This is what workflow_run matches on
>
> on:
>   push:
>     branches: [main, dev]
>
> jobs:
>   lint:
>     runs-on: ubuntu-latest
>     steps: [...]
>
>   typecheck:
>     runs-on: ubuntu-latest
>     steps: [...]
>
>   deploy:
>     needs: [lint, typecheck] # Runs after lint & typecheck pass
>     runs-on: ubuntu-latest
>     steps: [...]
> ```
>
> All these jobs - `lint`, `typecheck`, `deploy` - are part of the single "Deploy" workflow. If `lint` fails due to `ETIMEDOUT`, the retry workflow sees the whole "Deploy" workflow failed and can surgically re-run just the `lint` job.

**Smart retry logic.** GitHub tracks `run_attempt` automatically. We check if we're under 3 total attempts before retrying.

**Log analysis.** Downloads the failed job logs and greps for known transient patterns. If it finds `ETIMEDOUT` or `502 Bad Gateway`, it's probably worth retrying. If it finds `error TS2345: Argument of type 'string'...`, we don't retry for example.

**Surgical retry.** `gh run rerun --failed` only re-runs the jobs that failed, not the entire workflow.

**Slack notifications.** Sends a message when retrying (so you know it's operating and handling) and when it gives up after max attempts (so you know to look). You stay informed without having to check.

## The Transient Pattern List

These are the patterns that trigger a retry:

| Pattern            | What It Catches                 |
| ------------------ | ------------------------------- |
| `ETIMEDOUT`        | Network timeout                 |
| `ECONNRESET`       | Connection reset by peer        |
| `ENOTFOUND`        | DNS resolution failure          |
| `npm ERR! network` | Any npm network error           |
| `rate limit`       | GitHub/npm rate limiting        |
| `socket hang up`   | Connection dropped              |
| `fetch failed`     | Generic fetch failure           |
| `502 Bad Gateway`  | Upstream server error           |
| `503 Service`      | Service temporarily unavailable |
| `504 Gateway`      | Gateway timeout                 |
| `CERT_HAS_EXPIRED` | TLS certificate issues          |

When you discover a new transient pattern in the wild, just add it to the regex.

## Why Doesn't GitHub Just Do This Internally?

Not sure?

## Closing Thoughts

Honestly, this is a lot better.
