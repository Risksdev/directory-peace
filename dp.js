#!/usr/bin/env node
/**
 * Directory Peace v1.0
 * Terminal-based local file tracker
 * © 2026 Directory Peace
 */

const fs = require("fs");
const path = require("path");

const STATE_FILE = ".directory-peace.json";

/* ------------------ STATE ------------------ */

let state = { files: {} };

if (fs.existsSync(STATE_FILE)) {
  try {
    state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
  } catch {
    console.error("✖ Failed to read state file");
    process.exit(1);
  }
}

function saveState() {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

/* ------------------ UI ------------------ */

function box(lines) {
  const width = Math.max(...lines.map(l => l.length)) + 2;
  console.log("┌" + "─".repeat(width) + "┐");
  lines.forEach(l => {
    console.log("│ " + l.padEnd(width - 1) + "│");
  });
  console.log("└" + "─".repeat(width) + "┘");
}

/* ------------------ COMMANDS ------------------ */

function help() {
  box([
    "Directory Peace v1.0",
    "",
    "Commands:",
    " save <file>    Track/save a file",
    " status         Show tracked files",
    " diff <file>    Show last saved info",
    " remove <file>  Stop tracking a file",
    " init           Initialize project",
    " clear          Clear terminal",
    " help           Show help"
  ]);
}

function init() {
  if (fs.existsSync(STATE_FILE)) {
    console.log("✔ Directory Peace already initialized");
    return;
  }
  saveState();
  console.log("✔ Initialized Directory Peace");
}

function saveFile(file) {
  if (!file) {
    console.error("✖ No file specified");
    return;
  }

  if (!fs.existsSync(file)) {
    console.error("✖ File does not exist");
    return;
  }

  const stats = fs.statSync(file);

  state.files[path.resolve(file)] = {
    savedAt: new Date().toISOString(),
    size: stats.size
  };

  saveState();
  console.log("✔ File saved successfully");
}

function status() {
  const files = Object.keys(state.files);
  if (!files.length) {
    console.log("(no fil
