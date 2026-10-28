import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { LinkRow } from "./link-row.js";

/* SATIRIN TAMAMI BİR BAĞLANTI: satıra basmak satırın bağlantısına basmak; içindeki düğme ve
   bağlantılar kendi işini yapar, yeni sekme isteği yeni sekme açar. */
const row = (onLink = vi.fn(), onButton = vi.fn()) => {
  render(
    <table>
      <tbody>
        <LinkRow data-test-row>
          <td>
            <a
              href="/kayit/1"
              onClick={(e) => {
                e.preventDefault();
                onLink();
              }}
            >
              Kayıt
            </a>
          </td>
          <td>Hücre metni</td>
          <td>
            <button type="button" onClick={onButton}>
              Eylem
            </button>
          </td>
        </LinkRow>
      </tbody>
    </table>,
  );
  return { onLink, onButton };
};

afterEach(() => vi.restoreAllMocks());

describe("LinkRow", () => {
  it("satırın boş bir yerine basmak bağlantıyı açar", () => {
    const { onLink } = row();
    fireEvent.click(screen.getByText("Hücre metni"));
    expect(onLink).toHaveBeenCalledTimes(1);
  });
  it("satırdaki düğme kendi işini yapar, bağlantıyı açmaz", () => {
    const { onLink, onButton } = row();
    fireEvent.click(screen.getByText("Eylem"));
    expect(onButton).toHaveBeenCalledTimes(1);
    expect(onLink).not.toHaveBeenCalled();
  });
  it("bağlantının kendisine basmak bir kez açar, iki kez değil", () => {
    const { onLink } = row();
    fireEvent.click(screen.getByText("Kayıt"));
    expect(onLink).toHaveBeenCalledTimes(1);
  });
  it("Cmd ile ve orta tuşla yeni sekmede açar", () => {
    const open = vi.spyOn(window, "open").mockReturnValue(null);
    const { onLink } = row();
    fireEvent.click(screen.getByText("Hücre metni"), { metaKey: true });
    fireEvent(screen.getByText("Hücre metni"), new MouseEvent("auxclick", { bubbles: true, button: 1 }));
    expect(open).toHaveBeenCalledTimes(2);
    expect(open.mock.calls[0]![0]).toMatch(/\/kayit\/1$/);
    expect(onLink).not.toHaveBeenCalled();
  });
  it("satır imleci el, kancalar geçer", () => {
    row();
    expect(document.querySelector("tr[data-row-link][data-test-row]")).not.toBeNull();
    const css = readFileSync(["src/kit.css", "packages/ui/src/kit.css"].find(existsSync)!, "utf8");
    expect(css).toMatch(/\.tamga-table tbody tr\[data-row-link\]\s*\{\s*cursor: pointer;/);
  });
});
