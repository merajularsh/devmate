# 🔍 DevMate — AI Code Reviewer

An intelligent code reviewer powered by Claude AI. Paste your code, and get **instant feedback on bugs, security issues, and improvements**.

**Live:** [https://devmate-xyz123.vercel.app](https://devmate-xyz123.vercel.app)

---

## ✨ What DevMate Does

You paste code → DevMate analyzes it → You get:
- 🐛 **Bugs found** (with severity levels: 🔴 HIGH, 🟡 MEDIUM, 🟢 LOW)
- 🔒 **Security vulnerabilities** (SQL injection, XSS, unsafe operations)
- ⚡ **Performance issues** (slow loops, inefficient code)
- ✅ **Fixed version** of your code
- 📋 **Explanations** for each issue and how to fix it

---

## 🎯 Features

| Feature | What It Does |
|---------|------------|
| **Multi-Language Support** | Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, PHP, Ruby, SQL |
| **Auto-Detection** | Doesn't know the language? DevMate figures it out |
| **Severity Levels** | Issues marked as High (critical), Medium (important), or Low (nice-to-fix) |
| **Improved Code** | Get a corrected version with one click |
| **Line Numbers** | Know exactly which line has the problem |
| **Syntax Highlighting** | Beautiful color-coded code display |
| **Save Reviews** | Keep a history of all your past reviews |
| **Export Markdown** | Download your review as a .md file |
| **Side-by-Side View** | Compare original vs improved code |
| **Copy Button** | One-click copy of improved code to clipboard |

---

## 🚀 How to Use (3 Steps)

### Step 1: Paste Your Code
Click in the code box on the left and paste any code (Python, JavaScript, etc.)

### Step 2: Click "Review Code"
Wait 2-3 seconds while Claude AI analyzes it

### Step 3: Read the Feedback
You'll see:
- What your code does (summary)
- Issues found (with fixes)
- Improved version of your code

**That's it!** Copy the improved code and use it.

---

## 💻 Try It Now

### Example 1: Python Bug
```python
def add_to_list(item, items=[]):
    items.append(item)
    return items
```

**DevMate will find:**
- 🔴 HIGH: Mutable default argument (shared across calls)
- 🟡 MEDIUM: Should use `items=None` instead

---

### Example 2: JavaScript Bug
```javascript
for (let i = 0; i <= arr.length; i++) {
    console.log(arr[i]);  // BUG: causes undefined
}
```

**DevMate will find:**
- 🔴 HIGH: Loop goes out of bounds (`i <= arr.length` should be `i < arr.length`)
- 🟢 LOW: Could use `for...of` loop instead

---

### Example 3: SQL Security Issue
```sql
SELECT * FROM users WHERE email = '" + userInput + "';
```

**DevMate will find:**
- 🔴 HIGH: SQL injection vulnerability (attacker can see all users)
- 🔴 HIGH: Use parameterized queries instead

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 16, React, Tailwind CSS
- **AI Engine:** Claude Sonnet 4 (Anthropic API)
- **Code Display:** react-syntax-highlighter
- **Hosting:** Vercel
- **Language:** TypeScript

---

## 💡 Why DevMate?

### For Students
- Learn what makes code good/bad
- Understand security vulnerabilities
- Get better at debugging

### For Junior Developers
- Catch bugs before code review
- Learn best practices
- Improve code quality

### For Freshers Building Portfolio
- Shows understanding of multiple languages
- Demonstrates AI/ML integration
- Proves full-stack development skills

---

## 📖 What I Learned Building This

### Technical Skills
✅ **Prompt Engineering** — Getting Claude to return consistent, structured JSON
✅ **Multi-Language Support** — Handling 11+ programming languages correctly
✅ **React State Management** — Building responsive UIs with hooks
✅ **API Integration** — Connecting Next.js to Claude API securely
✅ **Code Highlighting** — Using libraries to display code beautifully
✅ **Full-Stack Deployment** — From local development to production on Vercel
✅ **Data Persistence** — Saving reviews to browser storage (localStorage)

### Problem-Solving
✅ Debugging authentication errors
✅ Optimizing API responses for cost
✅ Handling edge cases (empty code, very long code, etc.)
✅ Creating intuitive user experiences

---

## 🎮 Try Common Examples

### Find Off-by-One Errors
```python
for i in range(len(list)):  # Should be range(len(list)-1)?
    print(list[i+1])
```

### Find Null Pointer Issues
```java
String text = getInput();
int length = text.length();  // What if text is null?
```

### Find Logic Bugs
```javascript
if (age > 18) {
    console.log("Not an adult");  // BUG: logic is backwards
}
```

---

## 📊 Stats

- **Build Time:** 8 hours (start to deployed)
- **Languages Supported:** 11+
- **Issue Types Detected:** 20+
- **Lines of Code:** 700+

---

## 🔮 Coming Soon

- 🧪 Testing suggestions (Claude generates test cases)
- ⚡ Performance analysis (time complexity breakdown)
- 🎨 Dark/Light mode
- 📊 Complexity badges (Easy/Medium/Complex)
- 🔄 Batch analysis (review multiple files)
- 🔐 User accounts & review history

---

## 🎓 How This Helps Your Resume

**Interview Question:** "Tell us about a project you built."

**Your Answer:**
> I built DevMate, an AI code reviewer that analyzes code across 11 programming languages and detects bugs, security vulnerabilities, and performance issues.
>
> The technical challenge was designing prompts that return consistent JSON, which let me build a reliable UI. I also optimized it to use Claude's API cost-efficiently while maintaining code quality.
>
> It's live on Vercel and demonstrates full-stack development: Next.js frontend, API integration, real-time UI updates, and production deployment.

**Skills it shows:**
✅ AI/LLM integration
✅ Frontend development (React, Tailwind)
✅ Backend development (Next.js API routes)
✅ Full-stack deployment (Vercel)
✅ Problem-solving (prompt engineering)
✅ Multiple programming languages

---

## 🤔 Questions?

- **How does it work?** Paste code → Claude AI analyzes it → Smart feedback
- **Is it free?** Yes! Currently free to use
- **Is my code private?** Code is sent to Claude API for analysis. Don't paste secrets (passwords, keys)
- **Which languages?** Python, JavaScript, TypeScript, Java, C++, C#, Go, Rust, PHP, Ruby, SQL

---

## 📄 License

MIT — Feel free to fork, modify, and use for learning

---

## 🚀 Built by Merajul Arsh

**Fresher learning AI & full-stack development**

- **GitHub:** [github.com/merajularsh/devmate](https://github.com/merajularsh/devmate)
- **Live:** [devmate.vercel.app](https://devmate.vercel.app)

---

## 🎯 Next Steps

1. **Try it:** Paste buggy code at devmate.vercel.app
2. **Share it:** Send to
