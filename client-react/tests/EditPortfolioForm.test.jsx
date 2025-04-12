import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import EditPortfolioForm from "../src/components/EditPortfolio"
import { AuthContext } from "../src/context/AuthContext";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

beforeAll(() => {
    window.alert = jest.fn(); // Prevent crash on alert
  });
  
// Mock navigate
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

jest.mock("axios");

const mockUser = {
  id: "123",
  firstName: "Jane",
  lastName: "Doe",
  profile: {
    bios: "Food enthusiast",
    website: "https://janedoe.dev"
  }
};

const mockPosts = [
  {
    _id: "post1",
    title: "Spaghetti",
    description: "Tasty Italian pasta.",
    image: "image-url.jpg",
    ingredients: [{ name: "Pasta", quantity: "100", unit: "g" }],
    categories: ["Main Course"],
    steps: ["Boil water", "Cook pasta"]
  }
];

describe("EditPortfolioForm", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockPosts });
  });

  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <MemoryRouter>
          <EditPortfolioForm />
        </MemoryRouter>
      </AuthContext.Provider>
    );

  test("renders profile input fields", async () => {
    renderComponent();

    expect(await screen.findByPlaceholderText("First Name")).toHaveValue("Jane");
    expect(screen.getByPlaceholderText("Last Name")).toHaveValue("Doe");
    expect(screen.getByPlaceholderText("Bio")).toHaveValue("Food enthusiast");
    expect(screen.getByPlaceholderText("Website")).toHaveValue("https://janedoe.dev");
  });

  test("submits updated form", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText("First Name"), {
      target: { value: "Janey" },
    });

    fireEvent.click(screen.getByText("✅ Save Changes"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining("/users/123"), expect.any(Object));
    });

    fetch.mockRestore();
  });

  test("displays loading initially and posts after", async () => {
    renderComponent();

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    expect(await screen.findByText("Spaghetti")).toBeInTheDocument();
    expect(screen.getByText("Tasty Italian pasta.")).toBeInTheDocument();
    expect(screen.getByText((content, element) =>
        element.tagName.toLowerCase() === "span" &&
        content.includes("Step 1: Boil water")
      )).toBeInTheDocument();
      
      expect(screen.getByText((content, element) =>
        element.tagName.toLowerCase() === "span" &&
        content.includes("Step 2: Cook pasta")
      )).toBeInTheDocument();
        });

  test("displays message when no posts exist", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    renderComponent();

    expect(await screen.findByText("No posts found. Create your first recipe!")).toBeInTheDocument();
  });
});
