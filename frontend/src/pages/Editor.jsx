import { useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import "./Editor.css";

const CATEGORIES = [
  "სკოლის ცხოვრება",
  "აკადემიური მიღწევები",
  "ღონისძიებები",
  "სპორტი და კლუბები",
  "განცხადებები",
];

export default function Editor() {
  const user = useAuth((state) => state.user);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [featured, setFeatured] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const fileInputRef = useRef(null);

  const role = user?.role;
  const normalizedRole = String(role || "").toLowerCase();
  const canEdit = normalizedRole === "admin" || normalizedRole === "editor";

  if (!user || !canEdit) {
    return <Navigate to="/" replace />;
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    setFeedback(null);

    if (!file) {
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFeedback({
        type: "error",
        message: "გთხოვთ ატვირთოთ მხოლოდ სურათის ფაილი (JPG, PNG, WEBP).",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        type: "error",
        message: "სურათის ზომა არ უნდა აღემატებოდეს 5 MB-ს.",
      });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setTitle("");
    setCategory(CATEGORIES[0]);
    setSummary("");
    setContent("");
    setFeatured(false);
    clearImage();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!title.trim() || !content.trim()) {
      setFeedback({
        type: "error",
        message: "შეავსეთ სავალდებულო ველები: სათაური და სტატიის ტექსტი.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5210/api/news", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          image: null,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
          data.message ||
          `ახალი ამბის გამოქვეყნება ვერ მოხერხდა (${response.status}).`
        );
      }

      setFeedback({
        type: "success",
        message: "ახალი ამბავი წარმატებით გამოქვეყნდა სკოლის პორტალზე!",
      });
      resetForm();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err.message || "სერვერთან დაკავშირების შეცდომა.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="editor-page">
      <header className="editor-header">
        <div className="editor-header-inner">
          <div>
            <div className="editor-badge">
              <span className="editor-badge-dot" />
              სარედაქციო პანელი
            </div>
            <h1 className="editor-title">ახალი ამბის დამატება</h1>
            <p className="editor-subtitle">
              გამოაქვეყნეთ სკოლის სიახლეები, ღონისძიებები და აკადემიური განცხადებები
            </p>
          </div>

          <div className="editor-user-card">
            <div className="editor-avatar">
              {user.name?.[0]?.toUpperCase() || "E"}
            </div>
            <div>
              <div className="editor-user-name">
                {user.name || user.email}
              </div>
              <div className="editor-user-role">როლი: {role}</div>
            </div>
          </div>
        </div>
      </header>

      <main className="editor-main">
        <div className="editor-layout">
          <form onSubmit={handleSubmit} className="editor-card">
            <div className="editor-card-header">
              <h2>პუბლიკაციის დეტალები</h2>
              <span className="editor-required-hint">
                <span className="editor-req">*</span> სავალდებულო ველი
              </span>
            </div>

            <div className="editor-card-body">
              {feedback && (
                <div
                  className={`editor-alert ${
                    feedback.type === "success"
                      ? "editor-alert--success"
                      : "editor-alert--error"
                  }`}
                >
                  <span>{feedback.message}</span>
                  <button
                    type="button"
                    onClick={() => setFeedback(null)}
                    className="editor-alert-close"
                  >
                    დახურვა
                  </button>
                </div>
              )}

              <div>
                <label htmlFor="news-title" className="editor-label">
                  სათაური <span className="editor-req">*</span>
                </label>
                <input
                  id="news-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="მაგ: შემოდგომის მათემატიკური ოლიმპიადის გამარჯვებულები"
                  className="editor-input"
                />
              </div>

              <div className="editor-field-row">
                <div>
                  <label htmlFor="news-category" className="editor-label">
                    კატეგორია
                  </label>
                  <select
                    id="news-category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="editor-select"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <label className="editor-checkbox-box">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                  />
                  <span>
                    <span className="editor-checkbox-title">
                      მთავარ ბანერზე გამოტანა
                    </span>
                    <span className="editor-checkbox-sub">
                      გამოჩნდება მთავარი გვერდის ზედა ნაწილში
                    </span>
                  </span>
                </label>
              </div>

              <div>
                <div className="editor-label-row">
                  <label htmlFor="news-summary" className="editor-label">
                    მოკლე აღწერა (ანონსი)
                  </label>
                  <span className="editor-counter">{summary.length}/220</span>
                </div>
                <textarea
                  id="news-summary"
                  maxLength={220}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="მოკლე 1-2 წინადადებიანი შეჯამება სიახლის ბარათისთვის..."
                  className="editor-textarea editor-textarea--short"
                />
              </div>

              <div>
                <label htmlFor="news-content" className="editor-label">
                  სტატიის სრული ტექსტი <span className="editor-req">*</span>
                </label>
                <textarea
                  id="news-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="ჩაწერეთ სრული ინფორმაცია, თარიღები, მონაწილეები ან დეტალები..."
                  className="editor-textarea editor-textarea--long"
                />
              </div>

              <div>
                <span className="editor-label">მთავარი სურათი</span>

                {!imagePreview ? (
                  <label className="editor-upload-box">
                    <span className="editor-upload-icon">+</span>
                    <span className="editor-upload-main">
                      აირჩიეთ სურათი კომპიუტერიდან
                    </span>
                    <span className="editor-upload-sub">
                      PNG, JPG ან WEBP — მაქსიმუმ 5 MB
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="editor-hidden-input"
                    />
                  </label>
                ) : (
                  <div className="editor-preview-box">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="editor-preview-img"
                    />
                    <div className="editor-preview-bar">
                      <span className="editor-preview-name">
                        {imageFile?.name}
                      </span>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="editor-remove-btn"
                      >
                        წაშლა
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="editor-card-footer">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
                className="editor-btn-secondary"
              >
                გასუფთავება
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="editor-btn-primary"
              >
                {isSubmitting ? "ქვეყნდება..." : "ახალი ამბის გამოქვეყნება"}
              </button>
            </div>
          </form>

          <aside className="editor-aside">
            <div className="editor-aside-header">
              <span>ბარათის პრევიუ</span>
              <span className="editor-cat-pill">{category}</span>
            </div>

            <div className="editor-aside-thumb">
              {imagePreview ? (
                <img src={imagePreview} alt="Card preview" />
              ) : (
                <span className="editor-aside-placeholder">
                  სურათი არ არის არჩეული
                </span>
              )}
            </div>

            <div className="editor-aside-body">
              {featured && (
                <span className="editor-featured-tag">რჩეული სიახლე</span>
              )}
              <h3 className="editor-aside-title">
                {title.trim() || "აქ გამოჩნდება ახალი ამბის სათაური"}
              </h3>
              <p className="editor-aside-summary">
                {summary.trim() ||
                  "მოკლე აღწერა დაეხმარება მკითხველს სწრაფად გაიგოს, რას ეხება პუბლიკაცია."}
              </p>
              <div className="editor-aside-meta">
                <span>ავტორი: {user.name || "რედაქტორი"}</span>
                <span>ახლახანს</span>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}