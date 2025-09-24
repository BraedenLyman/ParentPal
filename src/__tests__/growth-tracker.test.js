import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GrowthTracker from "../GrowthTracker";
import axios from "axios";

jest.mock("axios");

describe("GrowthTracker", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders no growth records message when empty", async () => {
    axios.get.mockResolvedValueOnce({ data: { baby_id: 1 } }); 
    axios.get.mockResolvedValueOnce({ data: [] });
    render(<GrowthTracker />);
    await waitFor(() => {
      expect(screen.getByText("No growth records yet")).toBeInTheDocument();
    });
  });

  test("renders existing growth records", async () => {
    axios.get
      .mockResolvedValueOnce({ data: { baby_id: 1 } }) 
      .mockResolvedValueOnce({
        data: [{ growth_id: 1, height: 50, weight: 3.2, date: "2025-01-01" }],
      }); // records

    render(<GrowthTracker />);
    await waitFor(() => {
      expect(screen.getByText(/Height: 50/)).toBeInTheDocument();
      expect(screen.getByText(/Weight: 3.2/)).toBeInTheDocument();
    });
  });

  test("fails when trying to add growth with empty fields", async () => {
    render(<GrowthTracker />);
    fireEvent.click(screen.getByText("Add"));
    fireEvent.click(screen.getByText("Add"));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Please fill out all fields.");
    });
  });
});
