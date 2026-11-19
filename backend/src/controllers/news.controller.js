import { eq } from "drizzle-orm";
import { db } from "../db/db.js";
import { news } from "../db/schema.js";

export async function getAllNews(req, res, next) {
  try {
	const allNews = await db.select().from(news).orderBy(news.createdAt.desc());
	res.json({ news: allNews });
  } catch (err) {
	next(err);
  }
}

export async function getNewsById(req, res, next) {
  try {
	const { id } = req.params;
	const [newsItem] = await db.select().from(news).where(eq(news.id, parseInt(id))).limit(1);
	res.json({ news: newsItem });
  } catch (err) {
	next(err);
  }
}

export async function createNews(req, res, next) {
	const { title, content, image } = req.body;
	try {
		const newNews = await db.insert(news).values({
			title,
			content,
			image: image || null,
			authorId: req.user.id,
		}).returning();
		res.status(201).json({ news: newNews[0] });
	}catch (err) {
		next(err);
	}
}

export async function updateNews(req, res, next) {
	const { id } = req.params;
	const { title, content, image } = req.body;
	try {
		const [updatedNews] = await db.update(news)
			.set({ title, content, image })
			.where(eq(news.id, parseInt(id)))
			.returning();
		res.json({ news: updatedNews });
	}	catch (err) {
		next(err);
	}
} 

export async function deleteNews(req, res, next) {
	const { id } = req.params;
	try {
		await db.delete(news).where(eq(news.id, parseInt(id)));
		res.status(204).send();
	}	catch (err) {
		next(err);
	}
} 