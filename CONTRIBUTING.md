# Contributing to RHHS Green Classroom Champion

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/RHHS-Green-Classroom-Champion.git
   cd RHHS-Green-Classroom-Champion
   ```
3. **Set up Firebase** following the README instructions
4. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Project Structure
- `index.html` - Public leaderboard (keep this accessible to everyone)
- `css/` - All stylesheets
- `js/` - JavaScript files
- `pages/` - Internal pages (login, dashboards)

### Coding Standards

#### HTML
- Use semantic HTML5 elements
- Maintain proper indentation (2 spaces)
- Include ARIA labels for accessibility

#### CSS
- Use CSS variables for colors (defined in `:root`)
- Follow mobile-first responsive design
- Use BEM naming convention when applicable

#### JavaScript
- Use `const` and `let`, avoid `var`
- Use async/await for Firebase operations
- Add error handling for all Firebase calls
- Comment complex logic

### Firebase Rules

When modifying Firebase security rules:
1. Test locally first using Firebase Emulator
2. Document any rule changes
3. Ensure rules follow principle of least privilege

## Making Changes

### Before Committing
1. Test your changes locally
2. Ensure all features work:
   - Public leaderboard loads
   - Login works for both roles
   - Admin can manage users and classes
   - Supervisors can add points
3. Check console for errors
4. Test on mobile view

### Commit Messages
Use clear, descriptive commit messages:
```
feat: Add class deletion confirmation dialog
fix: Resolve leaderboard sorting issue
docs: Update Firebase setup instructions
style: Improve mobile responsiveness
refactor: Optimize points calculation
```

### Pull Request Process

1. **Update documentation** if needed
2. **Add screenshots** for UI changes
3. **Describe your changes** clearly:
   ```markdown
   ## Description
   Brief description of changes
   
   ## Changes Made
   - Feature 1
   - Feature 2
   
   ## Testing
   How you tested these changes
   
   ## Screenshots
   (if applicable)
   ```
4. **Link related issues** if any
5. Wait for review and address feedback

## Security Guidelines

### Never Commit
- ❌ `js/firebase-config.js` (real credentials)
- ❌ `.env` files
- ❌ API keys or secrets
- ❌ User data or passwords

### Always
- ✅ Use `firebase-config.example.js` as template
- ✅ Store secrets in Firebase environment
- ✅ Test security rules thoroughly
- ✅ Follow Firebase security best practices

## Testing

### Manual Testing Checklist
- [ ] Public leaderboard displays correctly
- [ ] Login redirects to correct dashboard based on role
- [ ] Admin can:
  - [ ] Add supervisors
  - [ ] Delete supervisors
  - [ ] Add classes
  - [ ] Edit classes
  - [ ] Delete classes
  - [ ] View all activity
- [ ] Supervisor can:
  - [ ] Add points to classes
  - [ ] Deduct points from classes
  - [ ] View their activity history
- [ ] Real-time updates work
- [ ] Logout works correctly
- [ ] Mobile view is responsive

### Browser Testing
Test on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Database Schema

When proposing changes to Firestore collections:

### `users` Collection
```javascript
{
  uid: string,           // Firebase Auth UID
  name: string,          // Full name
  email: string,         // Email address
  role: 'admin' | 'supervisor',
  createdAt: timestamp
}
```

### `classes` Collection
```javascript
{
  id: string,            // Auto-generated
  name: string,          // Class name (e.g., "Grade 9A")
  teacher: string,       // Teacher name
  points: number,        // Total points
  createdAt: timestamp
}
```

### `pointsHistory` Collection
```javascript
{
  id: string,            // Auto-generated
  classId: string,       // Reference to class
  className: string,     // Denormalized for display
  points: number,        // Points added (can be negative)
  reason: string,        // Why points were awarded
  supervisorId: string,  // Who added the points
  supervisorName: string,// Denormalized for display
  timestamp: timestamp
}
```

## Feature Requests

Have an idea? Great! Please:
1. Check existing issues first
2. Open a new issue with:
   - Clear title
   - Detailed description
   - Use case/benefit
   - Mockups if applicable

## Bug Reports

Found a bug? Help us fix it:
1. Check if it's already reported
2. Create an issue with:
   - Clear title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/device info

## Questions?

- Open a GitHub Discussion
- Check the README first
- Review existing issues/PRs

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help maintain a positive community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
