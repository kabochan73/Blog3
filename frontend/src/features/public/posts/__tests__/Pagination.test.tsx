import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Pagination } from "../components/Pagination";

describe("Pagination", () => {
  it("renders nothing when there is only one page", () => {
    const { container } = render(<Pagination currentPage={1} lastPage={1} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("shows only the next link on the first page", () => {
    render(<Pagination currentPage={1} lastPage={3} />);

    expect(screen.queryByText("← 前のページ")).not.toBeInTheDocument();
    expect(screen.getByText("次のページ →")).toHaveAttribute("href", "/page/2");
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
  });

  it("shows both links in the middle", () => {
    render(<Pagination currentPage={2} lastPage={3} />);

    expect(screen.getByText("← 前のページ")).toHaveAttribute("href", "/");
    expect(screen.getByText("次のページ →")).toHaveAttribute("href", "/page/3");
  });

  it("shows only the previous link on the last page", () => {
    render(<Pagination currentPage={3} lastPage={3} />);

    expect(screen.getByText("← 前のページ")).toHaveAttribute("href", "/page/2");
    expect(screen.queryByText("次のページ →")).not.toBeInTheDocument();
  });

  it("links to the tag-scoped pagination path when a tag is given", () => {
    render(<Pagination currentPage={2} lastPage={3} tag="laravel" />);

    expect(screen.getByText("← 前のページ")).toHaveAttribute("href", "/tags/laravel");
    expect(screen.getByText("次のページ →")).toHaveAttribute("href", "/tags/laravel/page/3");
  });
});
