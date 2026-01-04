#!/usr/bin/env node
/**
 * Directory Peace v1.0

Commands:',
    ' save <file>    Save / track a file',
    ' status         Show tracked files',
    ' diff <file>    Show last saved time',
    ' remove <file>  Stop tracking file',
    ' clear          Clear screen',
    ' (installed via npm link)',
    ' help           Show help'
  ]);
}

function saveFile(file) {
  if (!fs.existsSync(file)) {
    console.error('✖ File does not exist');
    return;
  }

  const stats = fs.statSync(file);
  state.files[file] = {
    savedAt: new Date().toISOString(),
    size: stats.size
  };
  saveState();
  console.log('✔ File saved successfully');
}

function status() {
  const entries = Object.keys(state.files);
  if (!entries.length) {
    console.log('(no files tracked)');
    return;
  }

  entries.forEach(f => {
    console.log(`${f} — saved ${state.files[f].savedAt}`);
  });
}

function diff(file) {
  if (!state.files[file]) {
    console.error('✖ File not tracked');
    return;
  }
  console.log(`${file}`);
  console.log(`Last saved: ${state.files[file].savedAt}`);
  console.log(`Size: ${state.files[file].size} bytes`);
}

function removeFile(file) {
  if (!state.files[file]) {
    console.error('✖ File not tracked');
    return;
  }
  delete state.files[file];
  saveState();
  console.log('✔ File removed');
}

// Command routing
// Usage: dp <command> [file]
const [, , cmd, arg] = process.argv;

switch (cmd) {
  case 'save':
    saveFile(arg);
    break;
  case 'status':
    status();
    break;
  case 'diff':
    diff(arg);
    break;
  case 'remove':
    removeFile(arg);
    break;
  case 'clear':
    console.clear();
    break;
  case 'install':
    console.log('Run: npm link');
    break;
  case 'help':
  default:
    help();
}
