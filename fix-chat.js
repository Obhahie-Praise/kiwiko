const fs = require('fs');
const file = './src/components/teams/chat/ChatWindow.tsx';
let content = fs.readFileSync(file, 'utf8');

// The error is an extra closing brace:
//              setMessages(historyMessages);
//              }
//            }
//         });
// we just need to replace it. Let's use regex:
content = content.replace(/setMessages\(historyMessages\);(\s*)\}(\s*)\}/g, 'setMessages(historyMessages);$2}');
fs.writeFileSync(file, content);
console.log('Fixed');
