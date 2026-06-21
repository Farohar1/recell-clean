const request = async (method, path, body) => {
  const res = await fetch(`/api${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const contentType = res.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await res.json()
    : { error: await res.text() };

  if (!res.ok) {
    const isHtml = typeof data.error === 'string' && data.error.trim().startsWith('<');
    const message = isHtml
      ? 'Server returned an HTML error page. Make sure the backend is running, then try again.'
      : data.error || 'Request failed';
    const err = new Error(message);
    err.fields = data.fields || {};
    if (res.status === 413 && path.startsWith('/listings')) {
      err.fields.image = 'Image is too large. Choose a smaller photo.';
    }
    throw err;
  }

  if (!contentType.includes('application/json')) {
    throw new Error('Server returned an unexpected response. Try again.');
  }

  return data;
};

export const api = {
  me:            ()     => request('GET',    '/auth/me'),
  login:         (b)    => request('POST',   '/auth/login', b),
  register:      (b)    => request('POST',   '/auth/register', b),
  logout:        ()     => request('POST',   '/auth/logout'),
  getListings:   (p={}) => request('GET',    `/listings${Object.keys(p).length ? '?' + new URLSearchParams(p) : ''}`),
  getListing:    (id)   => request('GET',    `/listings/${id}`),
  getMyListings: ()     => request('GET',    '/listings/mine'),
  createListing: (b)    => request('POST',   '/listings', b),
  updateListing: (id,b)  => request('PUT',    `/listings/${id}`, b),
  deleteListing: (id)   => request('DELETE', `/listings/${id}`),
  getMessages:   ()     => request('GET',    '/messages'),
  sendMessage:   (b)    => request('POST',   '/messages', b),
};
