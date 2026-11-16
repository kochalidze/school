# განთიადი — Frontend
`npm install && npm run dev` · `npm run build`

## Backend (JWT httpOnly cookie, `credentials: 'include'`)
- GET /api/news, GET /api/events -> [{id,title,body,date,(location)}]
- POST /api/auth/register {firstName,lastName,email,password} -> user {id,firstName,role}
- POST /api/auth/login {email,password} -> user · POST /api/auth/logout · GET /api/auth/me -> user | 401
- POST /api/{news|events}, PUT/DELETE /api/{news|events}/:id  (მხოლოდ role === 'admin')
`/admin` დაცულია role='admin'-ით; ბაზის URL: VITE_API_BASE_URL.
