const command = process.argv[2]

process.argv.splice(2, 1)

if (!command) {
  throw new Error('No command provided')
}

switch (command) {
  case '-h':
  case '--help':
  case 'help':
    await import('./commands/help.js')
    break
  case 'format':
    await import('./commands/format.js')
    break
  default:
    throw new Error(`Unknown command: ${command}`)
}
