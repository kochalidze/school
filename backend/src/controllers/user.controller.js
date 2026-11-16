import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { user } from "../db/schema.js";

// ვაბრუნებთ მხოლოდ უსაფრთხო ველებს (შენს სქემასთან სრულ შესაბამისობაში)
const publicColumns = {
  id: user.id,
  name: user.name,
  email: user.email,
  emailVerified: user.emailVerified,
  image: user.image,
  role: user.role, // default("guest") უკვე გაქვს სქემაში
  createdAt: user.createdAt,
};

// დამხმარე ფუნქცია URL-ის შესამოწმებლად
function isValidUrl(value) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// GET /users/me
export async function getMe(req, res, next) {
  try {
    const [me] = await db
      .select(publicColumns)
      .from(user)
      .where(eq(user.id, req.user.id))
      .limit(1);

    if (!me) {
      return res.status(404).json({ error: "მომხმარებელი ვერ მოიძებნა" });
    }

    res.json({ user: me });
  } catch (err) {
    next(err);
  }
}

// PATCH /users/me
export async function updateMe(req, res, next) {
  try {
    const { name, image, ...extraFields } = req.body || {};

    // 1. ვბლოკავთ ზედმეტ ველებს (მაგ. თუ ვინმე role: "admin"-ს გამოაგზავნის)
    if (Object.keys(extraFields).length > 0) {
      return res.status(400).json({
        error: "დაუშვებელი ველების შეცვლის მცდელობა",
      });
    }

    const updates = {};

    // 2. name-ის შემოწმება
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
        return res.status(400).json({
          error: "სახელი უნდა იყოს 2-დან 100 სიმბოლომდე ტექსტი",
        });
      }
      updates.name = name.trim();
    }

    // 3. image-ის შემოწმება (შეიძლება იყოს ვალიდური URL ან null ფოტოს წასაშლელად)
    if (image !== undefined) {
      if (image !== null) {
        if (typeof image !== "string" || image.length > 2048 || !isValidUrl(image)) {
          return res.status(400).json({
            error: "არასწორი სურათის URL მისამართი",
          });
        }
      }
      updates.image = image;
    }

    // 4. ვამოწმებთ, რომ მინიმუმ ერთი ველი მაინც გადმოეცა განსაახლებლად
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        error: "მოცემული არ არის განახლებადი ველი",
      });
    }

    // updatedAt-ის ხელით გაწერა აღარ გვჭირდება, რადგან სქემაში გაქვს:
    // .$onUpdate(() => new Date())
    const [updated] = await db
      .update(user)
      .set(updates)
      .where(eq(user.id, req.user.id))
      .returning(publicColumns);

    if (!updated) {
      return res.status(404).json({ error: "მომხმარებელი ვერ მოიძებნა" });
    }

    res.json({ user: updated });
  } catch (err) {
    next(err);
  }
}

// DELETE /users/me
export async function deleteMe(req, res, next) {
  try {
    const deleted = await db
      .delete(user)
      .where(eq(user.id, req.user.id))
      .returning({ id: user.id });

    if (deleted.length === 0) {
      return res.status(404).json({ error: "მომხმარებელი ვერ მოიძებნა" });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}