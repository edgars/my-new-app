#!/usr/bin/env bash
#
# clean-repo.sh — wipe the repo clean for a fresh project.
#
# Removes every file and directory in the repo root EXCEPT:
#   - .git           (the git repository itself)
#   - .gitignore     (so ignore rules survive)
#   - this script    (clean-repo.sh)
#
# After wiping, commits the deletions and pushes to the main branch.
#
# Usage:
#   ./clean-repo.sh          # asks for confirmation
#   ./clean-repo.sh -y       # skip confirmation

set -euo pipefail

# Always operate from the directory the script lives in.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_NAME="$(basename "${BASH_SOURCE[0]}")"
cd "$SCRIPT_DIR"

# Safety: refuse to run if this is not a git repo root.
if [ ! -d ".git" ]; then
  echo "Error: no .git directory here. Refusing to wipe a non-repo-root: $SCRIPT_DIR" >&2
  exit 1
fi

# Items to keep.
KEEP=(".git" ".gitignore" "$SCRIPT_NAME")

is_kept() {
  local name="$1"
  for k in "${KEEP[@]}"; do
    [ "$name" = "$k" ] && return 0
  done
  return 1
}

# Build deletion list (includes dotfiles, excludes . and ..).
to_delete=()
shopt -s dotglob nullglob
for entry in *; do
  base="$(basename "$entry")"
  is_kept "$base" && continue
  to_delete+=("$entry")
done
shopt -u dotglob nullglob

if [ "${#to_delete[@]}" -eq 0 ]; then
  echo "Already clean. Nothing to remove."
  exit 0
fi

echo "Will delete the following from $SCRIPT_DIR:"
for item in "${to_delete[@]}"; do
  echo "  - $item"
done

if [ "${1:-}" != "-y" ]; then
  printf "Proceed? [y/N] "
  read -r answer
  case "$answer" in
    y|Y|yes|YES) ;;
    *) echo "Aborted."; exit 0 ;;
  esac
fi

rm -rf -- "${to_delete[@]}"
echo "Done. Repo is clean."

# Commit and push the cleanup to the main branch.
echo "Committing and pushing to main..."
git add -A
if git diff --cached --quiet; then
  echo "Nothing to commit."
else
  git commit -m "chore: clean repo for fresh project"
fi
git push origin main
echo "Pushed to main."
