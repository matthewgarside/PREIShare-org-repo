# PREIshare setup log

**Learner:** Matt Garside
**Date:** 2026-09-01
**OS:** macOS
**Team repo (upstream):** https://github.com/EdTechForLearning/PREIShare-org-repo
**Orientation notes used:** `docs/onboarding/team-orientation-notes.md`

## 1. Accounts and fork

| Check | Result | Notes |
| --- | --- | --- |
| GitHub sign-in works | PASS  | Account username: <@matthewgarside> |
| Can view team repo https://github.com/EdTechForLearning/PREIShare-org-repo | PASS | |
| Fork created in my account | PASS  | My fork URL: https://github.com/<matthewgarside>/PREIShare-org-repo |

## 2. Git install and identity

```text
# git version 2.39.5 (Apple Git-154)

# matthewgarside
# matthewgarside7@gmail.com
# (email may be partially redacted in shared copies)
```

Identity configured: PASS

## 3. Clone (of MY fork)

- Parent directory used: `/Users/mattgarside/INFO3330`
- Clone command used: `git clone https://github.com/matthewgarside/PREIShare-org-repo.git`
- Cloned my fork (not the team repo): PASS 
- Clone completed without error: PASS 
- Local project path: `/Users/mattgarside/INFO3330/PREIShare-org-repo`

## 4. Remotes (run inside the repo)

- `git remote add upstream https://github.com/EdTechForLearning/PREIShare-org-repo.git` run: PASS 

### git remote -v

```text
# paste output — expect four lines:
#origin  https://github.com/matthewgarside/PREIShare-org-repo.git (fetch)
#origin  https://github.com/matthewgarside/PREIShare-org-repo.git (push)
#upstream        https://github.com/EdTechForLearning/PREIShare-org-repo.git (fetch)
#upstream        https://github.com/EdTechForLearning/PREIShare-org-repo.git (push)
```

origin points at MY fork: PASS 
upstream points at the team repo: PASS 

## 5. Post-clone verification

### git status

```text
# Your branch is up to date with 'origin/main'.
```

### Default branch

```text
# main
```

Default branch name: `<main>`
Working tree clean after clone: PASS 

## 6. Auth notes (no secrets)

- Clone method: HTTPS
- Auth method used (if prompted): browser
- Auth succeeded: PASS 
- **Do not paste tokens or private keys here**

## 7. Issues and fixes

| Issue | What I tried | Outcome |
| --- | --- | --- |
| <none or describe> | | |

## 8. Ready for next step

I have a fork I own, a local clone of it with origin and upstream set, and a setup log another teammate could audit: YES 