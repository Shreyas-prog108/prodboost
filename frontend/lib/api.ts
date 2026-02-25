const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export interface APIResponse<T> {
  success: boolean
  data: T
  error: string | null
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<APIResponse<T>> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    // credentials: "include" ensures the HttpOnly auth cookie is sent with
    // every cross-origin request to the backend.
    credentials: "include",
  })

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`
    try {
      const errorBody = await response.json()
      errorMessage = errorBody?.detail || errorBody?.error || errorMessage
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMessage)
  }

  return response.json() as Promise<APIResponse<T>>
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),

  post: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  patch: <T>(path: string, body: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
}

export interface TokenData {
  access_token: string
  token_type: string
}

export interface UserData {
  id: string
  email: string
  role: string
  created_at: string
}

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<TokenData>("/auth/login", payload),

  register: (payload: RegisterPayload) =>
    api.post<UserData>("/auth/register", payload),

  logout: () => api.post<null>("/auth/logout", {}),
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE"
export type TaskSource = "MANUAL" | "MEETING" | "MAIL" | "AI"

export interface Task {
  id: string
  user_id: string
  title: string
  description: string | null
  due_date: string | null
  status: TaskStatus
  source: TaskSource
  created_at: string
}

export interface TaskCreate {
  title: string
  description?: string
  due_date?: string
  source?: TaskSource
}

export interface TaskUpdate {
  title?: string
  description?: string
  due_date?: string
  status?: TaskStatus
}

export const tasksApi = {
  list: () => api.get<Task[]>("/tasks/"),
  create: (payload: TaskCreate) => api.post<Task>("/tasks/", payload),
  update: (id: string, payload: TaskUpdate) =>
    api.patch<Task>(`/tasks/${id}`, payload),
}

// ─── Meetings ─────────────────────────────────────────────────────────────────

export type MeetingStatus = "PENDING" | "PROCESSING" | "DONE" | "FAILED"
export type PrivacyLevel = "PRIVATE" | "TEAM" | "PUBLIC"

export interface Meeting {
  id: string
  user_id: string
  title: string
  transcript: string
  summary: string | null
  action_items: Record<string, unknown> | null
  status: MeetingStatus
  privacy_level: PrivacyLevel
  created_at: string
}

export interface MeetingUpload {
  title: string
  transcript: string
  privacy_level?: PrivacyLevel
}

export const meetingsApi = {
  upload: (payload: MeetingUpload) =>
    api.post<Meeting>("/meetings/upload", payload),
  summarize: (id: string) => api.post<{ message: string; meeting_id: string; job_id: string }>(`/meetings/${id}/summarize`, {}),
  get: (id: string) => api.get<Meeting>(`/meetings/${id}`),
}

// ─── Research ─────────────────────────────────────────────────────────────────

export interface ResearchProject {
  id: string
  user_id: string
  title: string
  description: string | null
  created_at: string
}

export interface ResearchSource {
  id: string
  project_id: string
  url: string
  title: string | null
  metadata_json: Record<string, unknown> | null
  extracted_text: string | null
  citation_data: Record<string, unknown> | null
}

export interface ResearchNote {
  id: string
  project_id: string
  content: string
  tags: unknown
  linked_source_id: string | null
}

export const researchApi = {
  listProjects: () => api.get<ResearchProject[]>("/research/projects"),
  createProject: (payload: { title: string; description?: string }) =>
    api.post<ResearchProject>("/research/projects", payload),
  addSource: (
    projectId: string,
    payload: { url: string; title?: string; extracted_text?: string }
  ) => api.post<ResearchSource>(`/research/${projectId}/sources`, payload),
  addNote: (projectId: string, payload: { content: string; tags?: unknown }) =>
    api.post<ResearchNote>(`/research/${projectId}/notes`, payload),
  generateDraft: (projectId: string) =>
    api.post<{ message: string; project_id: string; job_id: string }>(
      `/research/${projectId}/generate-draft`,
      {}
    ),
}
