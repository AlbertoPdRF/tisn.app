#!/bin/bash

api() {
  git subtree push --prefix api heroku master
}

client() {
  cd client/
  npm run deploy
  cd ../
}

allowed_commands="api client"

if [ $# -eq 0 ]; then
  for command in $allowed_commands; do
    $command
  done
fi

print_usage_and_exit() {
  echo -n "Usage: $0 "
  echo -n "[] "
  for command in $allowed_commands; do
    echo -n "[$command] "
  done
  echo
  exit
}

if [ $# -gt 2 ]; then
  print_usage_and_exit
fi

listcontains() {
  for word in $1; do
    [[ $word = $2 ]] && return 0
  done
  return 1
}

for command in "$@"; do
  if ! listcontains "$allowed_commands" $command; then
    echo "Unrecognized command: $command"
    print_usage_and_exit
  fi
done

for command in "$@"; do
  $command
done
