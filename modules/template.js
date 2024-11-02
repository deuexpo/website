/* eslint-disable no-underscore-dangle */
// TODO:
// - Make render async (fs.readFileSync, since in the future file reading may block the script for some critical time).

import fs from 'fs';
import path from 'path';
import util from 'util';

const CACHE = {};
const DEFAULT_OPTIONS = {
  cache: true, // When true, compiled function is cached.
  views: path.join(process.env.NODE_PATH, 'views'), // Prepend file path with, example: `${views}/filename.ejs`
};
const RESERVED_WORDS = ['__escape', '__filename', '__lineno', '__lines', '__rethrow', '__text'];
const RE_DELIMITERS = /<%(.*?)%>/gs;
const RE_FILENAME = /^[a-z0-9_.\-/]+$/i;
const CODE_DEBUG = `let __lineno = 1;
try {
  const __lines = [];
  with(data) {
%s
    return __lines.join("");
  }
} catch (err) {
  __rethrow(err, __text, __filename, __lineno);
}`;

const ENCODE_RULES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&#34;',
  "'": '&#39;', // eslint-disable-line quotes
};
const RE_HTML_CHARS = /[&<>'"]/g;

function encodeChar(c) {
  return ENCODE_RULES[c] || c;
}

async function __escape(val) {
  if (val && val.render && (typeof val.render === 'function')) {
    return val.render();
  }
  return String(val).replace(RE_HTML_CHARS, encodeChar);
}

function __rethrow(err, text, filename, lineno) {
  // Save error context and re-throw it.
  const lines = text.split('\n');
  const begin = Math.max(lineno - 3, 0);
  const end = Math.min(lines.length, lineno + 3);
  const context = lines.slice(begin, end).map((line, i) => {
    const curr = i + begin + 1;
    const prefix = curr === lineno ? ' >> ' : '    ';
    return `${prefix}${curr}| ${line}`;
  }).join('\n');
  const template = filename || 'template';
  const newError = new Error(err);
  newError.name = err.name;
  newError.message = err.message;
  newError.stack = `${template}:${lineno}\n${context}\n\n${err.stack}`;
  throw newError;
}

class Template {
  constructor(text, data, options) {
    this.filename = (RE_FILENAME.test(text)) ? text : null;
    this.text = this.filename ? null : text.trim();
    this.options = {...DEFAULT_OPTIONS, ...options};
    this.data = {};
    this.update(data);
  }

  _compile() {
    const codeLines = [];
    let index = 0;
    let lineno = 1;
    const appendCode = (line, isJS) => {
      if (line) {
        if (isJS) {
          if (line[0] === '=') {
            const newLine = line.slice(1).trim();
            codeLines.push(`    ; __lines.push(await __escape(${newLine}))`);
          } else {
            const newLine = line.trim();
            codeLines.push(`    ; ${newLine}`);
          }
        } else {
          let newLine = line;
          newLine = newLine.replace(/\\/g, '\\\\');
          newLine = newLine.replace(/\n/g, '\\n');
          newLine = newLine.replace(/\r/g, '\\r');
          newLine = newLine.replace(/"/g, '\\"');
          codeLines.push(`    ; __lines.push("${newLine}")`);
        }
        const increment = line.split('\n').length - 1;
        if (increment) {
          lineno += increment; // Increment lineno outside template code, to prevent wrong values in case of "if ()", "for ()".
          codeLines.push(`    ; __lineno = ${lineno}`);
        }
      }
    };
    let match;
    // eslint-disable-next-line no-cond-assign
    while ((match = RE_DELIMITERS.exec(this.text)) !== null) {
      appendCode(this.text.slice(index, match.index)); // Append text (outside <% %>)
      appendCode(match[1], true); // Append code (inside <% %>)
      index = match.index + match[0].length;
    }
    appendCode(this.text.substr(index, this.text.length - index));
    const code = codeLines.join('\n');
    try {
      // eslint-disable-next-line no-empty-function
      const asyncFunc = async function () {};
      // Use "new asyncFunc.constructor()" instead of "new Function()" to create async function.
      // Every JavaScript function is actually a Function object: "(function(){}).constructor === Function"
      this.func = new asyncFunc.constructor('data', '__text', '__filename', '__escape', '__rethrow', util.format(CODE_DEBUG, code));
    } catch (err) {
      const messages = [];
      if (this.filename) {
        messages.push(`Template "${this.filepath}" compilation error: "${err.message}"`);
      } else {
        messages.push(`Template compilation error: "${err.message}"`);
        messages.push('-'.repeat(80));
        messages.push(this.text);
        messages.push('-'.repeat(80));
      }
      throw new Error(messages.join('\n'));
    }
  }

  get filepath() {
    if (!this.filename) {
      return null;
    }
    const paths = [];
    if (this.options.views) {
      paths.push(this.options.views);
    }
    if (this.filename) {
      paths.push(`${this.filename}.ejs`);
    }
    return path.join(...paths);
  }

  get(key) {
    return this.data[key];
  }

  async render(data) {
    if (this.filename) {
      if (this.options.cache && this.filename in CACHE) {
        const cache = CACHE[this.filename];
        this.func = cache.func;
        this.text = cache.text;
      } else {
        this.text = fs.readFileSync(this.filepath, {encoding: 'utf8'});
        this._compile();
        if (this.options.cache) {
          CACHE[this.filename] = {func: this.func, text: this.text};
        }
      }
    } else {
      this._compile();
    }
    this.update(data);
    return this.func(this.data, this.text, this.filename, __escape, __rethrow);
  }

  set(key, value) {
    if (RESERVED_WORDS.includes(key)) {
      throw new Error(`"${key}" is reserved word in template.`);
    } else {
      this.data[key] = value;
    }
  }

  update(data) {
    if (data) {
      for (const [key, value] of Object.entries(data)) {
        this.set(key, value);
      }
    }
  }
}

export default Template;
