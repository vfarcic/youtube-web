#!/usr/bin/env nu

source scripts/mcp.nu

def main [] {}

def "main setup" [] {

    main apply mcp --enable-playwright true
}
