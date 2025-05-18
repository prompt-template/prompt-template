const command = process.argv[2]

process.argv.splice(2, 1)

if (!command) {
  throw new Error('No command provided')
}

switch (command) {
  case 'format':
    await import('./commands/format.js')
    break
  case '-h':
  case '--help':
  case 'help':
    await import('./commands/help.js')
    break
  case 'inspect':
    await import('./commands/inspect.js')
    break
  default:
    throw new Error(`Unknown command: ${command}`)
}
