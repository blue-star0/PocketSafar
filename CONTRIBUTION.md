# Contributing to PocketSafar

Thank you for your interest in contributing to PocketSafar! This guide explains how to propose changes, report issues, open pull requests, follow coding/testing standards, and get onboarded quickly.

## Step-by-step: Issues and Pull Requests

1. Check existing issues and discussions to avoid duplicates
2. Open an issue
   - Use the appropriate template (bug, feature, docs)
   - Provide clear title, description, repro steps, expected/actual behavior
   - Add labels: backend/frontend/docs/test/security as applicable
3. Discuss and get alignment
   - Maintainers will triage, clarify scope, and assign priority
   - For larger features, propose an RFC in the issue or a linked doc
4. Create a branch
   - Fork the repo and create a feature branch from main
   - Naming: feature/short-description, fix/area-issue123, docs/topic
5. Implement the change
   - Follow coding standards (see below)
   - Keep commits small and meaningful
   - Update or add tests to maintain coverage
   - Update docs, changelog snippets if needed
6. Run quality checks locally
   - Lint, type-check, format, run tests (see commands below)
7. Open a Pull Request
   - Link the related issue: Closes #123
   - Fill the PR template, include screenshots/logs where useful
   - Describe testing performed and impact/risk
8. Address review feedback
   - Use follow-up commits; avoid force-pushing after reviews unless requested
   - Keep conversation respectful and focused on outcomes
9. Merge
   - Squash and merge after approvals and all checks pass
   - Maintainers may request additional changes or split PRs

## Coding Guidelines

Backend (Python/FastAPI):
- Python 3.11+
- Code style: black; lint: flake8; types: mypy (strict where practical)
- Structure: keep routers/services/schemas separated; avoid business logic in routes
- Env config via .env; no secrets in code
- Prefer Pydantic models for validation and typing
- Logging with standard logging; avoid print

Frontend (React/TypeScript):
- TypeScript strict mode; no any unless justified
- State management: prefer React Query/local state where possible
- Components: functional, hooks-based, accessible (a11y)
- Styling consistent with Tailwind (if used) and design system
- Avoid prop drilling; compose components; test critical UI logic

General:
- Small, cohesive modules; avoid duplication (DRY)
- Document public functions and complex logic
- Meaningful names and commit messages

## Testing Guidelines

Backend:
- pytest with pytest-cov; target coverage >= 85% for changed code
- Unit tests for services/utils; API tests for routers; fixtures for data
- Use factories/mocks; no external network in tests

Frontend:
- @testing-library/react for components; jest/vitest runner
- Test user interactions and accessibility; avoid implementation details

CI expectations:
- Lint, type-check, build, and tests must pass
- Security and license checks must pass

## Local Setup and Commands

Backend:
- python -m venv venv; source venv/bin/activate (Windows: venv\Scripts\activate)
- pip install -r requirements.txt
- Dev tools: pip install -r requirements-dev.txt or pip install black flake8 mypy pytest pytest-cov
- Run: uvicorn app.main:app --reload
- Lint/format/type: black ., flake8, mypy .
- Tests: pytest -q --cov

Frontend:
- cd frontend && npm install
- Run: npm run dev
- Lint/format: npm run lint, npm run format
- Tests: npm test

## Acceptance Criteria for PRs

A PR is ready to merge when:
- Scope aligns with the linked issue and acceptance criteria
- Code follows guidelines and is adequately documented
- Tests are included/updated and pass in CI
- No regressions; manual validation notes/screenshots provided when UI changes
- Security/privacy considerations addressed (no secrets, proper validation)

## Onboarding for New Contributors

1. Read: README, PocketSafar_Setup_Guide.md, CODE_OF_CONDUCT.md, SECURITY.md
2. Environment: set up backend and frontend as per Setup Guide
3. Pick a good first issue labeled good first issue or help wanted
4. Ask questions in the issue; a maintainer will guide you
5. Make a small PR to get feedback on the workflow

## Communication and Support

- Use GitHub Issues/Discussions for technical topics
- For conduct concerns: conduct@pocketsafar.org
- For security: pocketSafar.security@gmail.com

## Resources

- FastAPI: https://fastapi.tiangolo.com/
- Pandas: https://pandas.pydata.org/
- Boto3: https://boto3.amazonaws.com/v1/documentation/api/latest/index.html
- React: https://react.dev/
- TypeScript: https://www.typescriptlang.org/docs/

Happy contributing!
