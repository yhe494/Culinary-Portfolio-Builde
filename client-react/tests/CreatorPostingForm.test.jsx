import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreatorPostingForm from "../src/components/CreatorPostingForm";

describe("CreatorPostingForm", () => {
  const mockSubmit = jest.fn();

  beforeEach(() => {
    mockSubmit.mockClear();
  });

  test("renders form fields", () => {
    render(<CreatorPostingForm onSubmit={mockSubmit} />);

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Description")).toBeInTheDocument();
    expect(screen.getByText("+ Add Ingredient")).toBeInTheDocument();
    expect(screen.getByText("+ Add Step")).toBeInTheDocument();
    expect(screen.getByText("✅ Save Posting")).toBeInTheDocument();
  });

  test("fills in title and description", () => {
    render(<CreatorPostingForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("Title"), {
      target: { value: "My Recipe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Delicious dish" },
    });

    fireEvent.click(screen.getByText("✅ Save Posting"));

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "My Recipe",
        description: "Delicious dish",
      })
    );
  });

  test("adds and removes ingredients", () => {
    render(<CreatorPostingForm onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByText("+ Add Ingredient"));

    const nameInput = screen.getByPlaceholderText("Name");
    fireEvent.change(nameInput, { target: { value: "Salt" } });

    fireEvent.click(screen.getByText("✅ Save Posting"));

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        ingredients: [{ name: "Salt", quantity: "", unit: "" }],
      })
    );
  });

  test("adds and removes steps", () => {
    render(<CreatorPostingForm onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByText("+ Add Step"));

    const stepInput = screen.getAllByRole("textbox").find(
        (el) => el.previousSibling?.textContent?.includes("Step 1")
      );
    fireEvent.change(stepInput, { target: { value: "Mix well" } });

    fireEvent.click(screen.getByText("✅ Save Posting"));

    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        steps: ["Mix well"],
      })
    );
  });

  test("handles public checkbox toggle", () => {
    render(<CreatorPostingForm onSubmit={mockSubmit} />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);

    fireEvent.click(screen.getByText("✅ Save Posting"));
    expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({ isPublic: false }));
  });
});
