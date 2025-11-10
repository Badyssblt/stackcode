// Mauvais usage d'eval
const userInput = "2 + 2";
const result = eval(userInput); // Semgrep détectera usage d'eval

// Hardcoded secret
const API_KEY = "123456789abcdef"; // Semgrep détectera un secret

// Possible SQL injection
import { query } from "some-db-lib";
const userId = "1 OR 1=1";
query(`SELECT * FROM users WHERE id=${userId}`); // Semgrep peut détecter injection SQL

// Unsafe function construction
const fn = new Function("a", "b", "return a + b"); // Semgrep détectera new Function

// Console logging secrets
console.log("Password is:", "mypassword"); // Semgrep détectera le mot 'password'
