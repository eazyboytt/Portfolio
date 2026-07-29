#!/usr/bin/env pwsh
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Push-Location (Split-Path -Parent $MyInvocation.MyCommand.Path)
try {
  git add -A
  $staged = git diff --cached --quiet
  if ($staged) {
    Write-Host 'Nothing to commit.'
    return
  }
  git commit -m 'chore: update portfolio'
  git push
}
finally {
  Pop-Location
}
