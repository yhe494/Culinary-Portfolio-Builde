import { useState } from "react";

const CATEGORIES = ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Other'];

export default function AdminTemplateForm({ onSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [isReusable, setIsReusable] = useState(true);

  // 재료 추가
  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  // 단계 추가
  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const template = {
      title,
      description,
      categories,
      image,
      ingredients,
      steps,
      isPublic,
      isReusable,
    };
    onSubmit(template); // 부모 컴포넌트에서 API 호출
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">

      <h4>📝 템플릿 정보</h4>
      <input className="form-control my-2" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="form-control my-2" placeholder="설명" value={description} onChange={(e) => setDescription(e.target.value)} />

      <label>카테고리 선택 (복수 선택 가능)</label>
      <select
        className="form-select my-2"
        multiple
        value={categories}
        onChange={(e) =>
          setCategories(Array.from(e.target.selectedOptions, (o) => o.value))
        }
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input className="form-control my-2" placeholder="대표 이미지 URL" value={image} onChange={(e) => setImage(e.target.value)} />

      <div className="form-check my-2">
        <input className="form-check-input" type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
        <label className="form-check-label">공개 여부 (Public)</label>
      </div>
      <div className="form-check mb-3">
        <input className="form-check-input" type="checkbox" checked={isReusable} onChange={() => setIsReusable(!isReusable)} />
        <label className="form-check-label">재사용 가능 (Reusable)</label>
      </div>

      <h5>🥬 재료</h5>
      {ingredients.map((ing, idx) => (
        <div className="row mb-2" key={idx}>
          <div className="col">
            <input className="form-control" placeholder="재료명" value={ing.name} onChange={(e) => {
              const updated = [...ingredients];
              updated[idx].name = e.target.value;
              setIngredients(updated);
            }} />
          </div>
          <div className="col">
            <input className="form-control" placeholder="양" value={ing.quantity} onChange={(e) => {
              const updated = [...ingredients];
              updated[idx].quantity = e.target.value;
              setIngredients(updated);
            }} />
          </div>
          <div className="col">
            <input className="form-control" placeholder="단위" value={ing.unit} onChange={(e) => {
              const updated = [...ingredients];
              updated[idx].unit = e.target.value;
              setIngredients(updated);
            }} />
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-danger" onClick={() => {
              const updated = ingredients.filter((_, i) => i !== idx);
              setIngredients(updated);
            }}>삭제</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline-primary mb-3" onClick={addIngredient}>+ 재료 추가</button>

      <h5>🧑‍🍳 조리 단계</h5>
      {steps.map((step, idx) => (
        <div className="input-group mb-2" key={idx}>
          <span className="input-group-text">{idx + 1}단계</span>
          <input className="form-control" value={step} onChange={(e) => {
            const updated = [...steps];
            updated[idx] = e.target.value;
            setSteps(updated);
          }} />
          <button type="button" className="btn btn-danger" onClick={() => {
            const updated = steps.filter((_, i) => i !== idx);
            setSteps(updated);
          }}>삭제</button>
        </div>
      ))}
      <button type="button" className="btn btn-outline-secondary mb-4" onClick={addStep}>+ 단계 추가</button>

      <button type="submit" className="btn btn-success">✅ 템플릿 저장</button>
    </form>
  );
}
