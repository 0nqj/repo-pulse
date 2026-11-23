#!/usr/bin/env bash
set -euo pipefail

day=${1:?Informe a data de São Paulo no formato AAAA-MM-DD}
[[ "$day" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]] || { echo "Data inválida: $day" >&2; exit 1; }
branch="mensal/${day:0:7}"
main=$(git rev-parse --verify refs/remotes/origin/main)
remote_branch="refs/remotes/origin/$branch"
marker=".repo-pulse/arquivo-diario"

export GIT_AUTHOR_NAME="${GITHUB_REPOSITORY_OWNER:?}"
export GIT_AUTHOR_EMAIL="${GITHUB_REPOSITORY_OWNER_ID:?}+${GITHUB_REPOSITORY_OWNER}@users.noreply.github.com"
export GIT_COMMITTER_NAME="github-actions[bot]"
export GIT_COMMITTER_EMAIL="41898282+github-actions[bot]@users.noreply.github.com"

if git show-ref --verify --quiet "$remote_branch"; then
  git switch --detach "$remote_branch"
  if [[ -f "$marker" ]]; then
    read -r last_day _ < "$marker"
    if [[ "$last_day" == "$day" || "$last_day" > "$day" ]]; then
      echo "$branch já possui um registro de $last_day."
      exit 0
    fi
  fi
  git merge --no-ff --no-commit "$main"
else
  git switch --detach "$main"
fi

mkdir -p .repo-pulse
printf '%s %s\n' "$day" "$main" > "$marker"
git add -- "$marker"
git commit -m "chore(arquivo): registrar main em $day [bot]"
git push origin "HEAD:refs/heads/$branch"
