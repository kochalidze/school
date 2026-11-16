import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../lib/auth.js"; // შენი betterAuth(...) ინსტანსი

// ამოწმებს, დალოგინებულია თუ არა მომხმარებელი
export async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({ error: "ავტორიზაცია აუცილებელია" });
    }

    req.user = session.user;
    req.session = session.session;
    next();
  } catch (err) {
    next(err);
  }
}

// ამოწმებს, არის თუ არა ადმინი (სიახლეების დამატება/წაშლისთვის გამოგადგება)
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "წვდომა აკრძალულია: საჭიროა ადმინის უფლება" });
  }
  next();
}