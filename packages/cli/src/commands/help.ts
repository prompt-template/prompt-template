const cyan = '\x1b[36m'
const dim = '\x1b[2m'
const reset = '\x1b[0m'

const helpMessage = `
${cyan}Usage:${reset} @prompt-template/cli <command> <prompt-template-file> [args]

${cyan}Commands:${reset}
  help       Show help message
  inspect    Inspect a prompt template and print its description and input variables
  format     Format and print a prompt template with input variables mapped to command line arguments

${cyan}Examples:${reset}
  ${dim}# Inspect a prompt template${reset}
  npx @prompt-template/cli inspect <prompt-template-file>

  ${dim}# Format a prompt template${reset}
  npx @prompt-template/cli format <prompt-template-file> --input <input>

  ${dim}# Pipe a formatted prompt to a code agent (e.g. Claude Code or Codex)${reset}
  npx @prompt-template/cli format <prompt-template-file> | claude

  ${dim}# Pipe a formatted prompt template to multiple code agents (serial)${reset}
  for file in dir/*.md; do
    npx @prompt-template/cli format <prompt-template-file> \\
      --input <input> \\
      --filePath "$PWD/$file" | claude -p
  done

  ${dim}# Pipe a formatted prompt template to multiple code agents (parallel)${reset}
  echo dir/*.md | xargs -n 1 -P 4 -I {} \
    npx @prompt-template/cli format <prompt-template-file> \\
      --input <input> \\
      --filePath "$PWD/$file" | claude -p
`

console.log(helpMessage.trim())
