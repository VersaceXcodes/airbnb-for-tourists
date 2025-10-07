const fs = require('fs');

let content = fs.readFileSync('server.ts', 'utf8');

// Replace the server startup section
const oldStartup = `// Start the server
server.listen(port, '0.0.0.0', () => {
  console.log(\`Server running on port \${port} and listening on 0.0.0.0\`);
});`;

const newStartup = `// Start the server after initializing database
(async () => {
  try {
    await initDatabase();
    console.log('Database initialized successfully');
    
    server.listen(port, '0.0.0.0', () => {
      console.log(\`Server running on port \${port} and listening on 0.0.0.0\`);
    });
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
})();`;

content = content.replace(oldStartup, newStartup);
fs.writeFileSync('server.ts', content);
console.log('Fixed server.ts');