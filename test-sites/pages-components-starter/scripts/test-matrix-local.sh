#!/bin/bash
set -euo pipefail

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

if ! command -v nvm >/dev/null 2>&1; then
  echo "❌ Error: nvm is not available. Please install nvm first."
  exit 1
fi

NODE_VERSIONS=("18" "20" "22" "24")
REACT_VERSIONS=("18.2.0") # TODO: Add "19.2.1"

INITIAL_NODE_VERSION=$(node -v)
echo "🔍 Detected initial Node version: $INITIAL_NODE_VERSION"

if command -v jq >/dev/null 2>&1; then
  INITIAL_REACT_VERSION=$(jq -r '.dependencies.react // .devDependencies.react // empty' package.json)
  echo "🔍 Detected initial React version: $INITIAL_REACT_VERSION"
else
  # Fallback using grep/sed (less reliable but works without jq)
  INITIAL_REACT_VERSION=$(grep -A1 '"react"' package.json | grep -oE '"[^"]+"' | head -1 | tr -d '"')
  echo "🔍 Detected initial React version: $INITIAL_REACT_VERSION"
fi

cleanup() {
  echo "🧹 Running cleanup..."
  # Restore original Node version if nvm is available
  if command -v nvm >/dev/null 2>&1; then
    echo "⏪ Restoring Node $INITIAL_NODE_VERSION..."
    nvm install "$INITIAL_NODE_VERSION" --reinstall-packages-from=current || true
    nvm use "$INITIAL_NODE_VERSION" || true
  fi

  # Restore original React version in consumer
  if [[ -n "$INITIAL_REACT_VERSION" ]]; then
    echo "⏪ Restoring React $INITIAL_REACT_VERSION..."
    pnpm add react@"$INITIAL_REACT_VERSION" react-dom@"$INITIAL_REACT_VERSION" --save-exact --silent >/dev/null 2>&1 || {
      echo "⚠️ Failed to restore React version"
    }
  fi

  echo "✅ Cleanup complete."
}

# Register cleanup to run on any exit
trap cleanup EXIT

for node_ver in "${NODE_VERSIONS[@]}"; do
  echo "=== Testing with Node $node_ver ==="
  nvm install $node_ver
  nvm use $node_ver

  for react_ver in "${REACT_VERSIONS[@]}"; do
    echo "---- Node $node_ver / React $react_ver ----"

    # Force install specific React version
    pnpm add react@"$react_ver" react-dom@"$react_ver" --force --silent || {
      echo "❌ pnpm add react failed"
      exit 1
    }

    echo "Running Playwright tests (Node $node_ver + React $react_ver)..."
    pnpm test
    echo "✅ Passed: Node $node_ver + React $react_ver"

  done
done

echo "All combinations passed!"