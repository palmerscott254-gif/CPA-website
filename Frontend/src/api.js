const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

export async function fetchJSON(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw { status: res.status, data };
  return data;
}

export function downloadFile(path, token) {
  const url = `${API_BASE}${path}`;
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  // open in new tab to trigger download (handled by backend)
  const a = document.createElement("a");
  a.href = url;
  Object.keys(headers).forEach(k => a.setAttribute(k, headers[k]));
  // can't set headers on simple <a>; instead open via fetch and blob
  return fetch(url, { headers })
    .then(r => {
      if (!r.ok) throw new Error("Download failed");
      return r.blob();
    })
    .then(blob => {
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      // try to derive filename
      const disposition = "";
      link.download = path.split("/").pop() || "download.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    });
}
