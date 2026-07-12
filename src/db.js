// Database client-side adapter communicating with Express + SQLite3 backend

export async function loginUser(email, password) {
  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (e) {
    return { success: false, message: 'Server connection failed.' };
  }
}

export async function signupUser({ email, password }) {
  try {
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return await res.json();
  } catch (e) {
    return { success: false, message: 'Server connection failed.' };
  }
}

export async function updateUserProfile(email, updatedData) {
  try {
    const res = await fetch('/api/auth/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, ...updatedData })
    });
    return await res.json();
  } catch (e) {
    return { success: false, message: 'Server connection failed.' };
  }
}

export async function saveWorkspace(email, workspace) {
  try {
    const res = await fetch('/api/workspace/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, workspace })
    });
    return await res.json();
  } catch (e) {
    return { success: false, message: 'Server connection failed.' };
  }
}
