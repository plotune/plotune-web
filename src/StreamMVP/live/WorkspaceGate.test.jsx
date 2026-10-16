import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthContext } from "../../context/AuthContext";
import StreamWorkspace from "./StreamWorkspace";

test("disabled workspace stays available as an honest gate without calling the inactive backend", () => {
  const fetcher = jest.fn();
  const previousFetch = global.fetch;
  global.fetch = fetcher;
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const mount = root.render.bind(root);
  act(() =>
    mount(
      <MemoryRouter>
        <HelmetProvider>
          <AuthContext.Provider
            value={{ token: "existing-account", isLoading: false }}
          >
            <StreamWorkspace />
          </AuthContext.Provider>
        </HelmetProvider>
      </MemoryRouter>,
    ),
  );
  expect(container.textContent).toContain("awaiting backend activation");
  expect(container.querySelector('a[href="/stream/demo"]')).toBeTruthy();
  expect(fetcher).not.toHaveBeenCalled();
  act(() => root.unmount());
  container.remove();
  global.fetch = previousFetch;
});
