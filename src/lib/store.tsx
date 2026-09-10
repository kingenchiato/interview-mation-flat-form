"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEMO_PASSWORD, seedApplications, seedJobs, seedUsers } from "./seed";
import type {
  Application,
  ApplicationStatus,
  InterviewJob,
  JobStatus,
  Role,
  UserProfile,
} from "./types";

const STORAGE_KEY = "interview-connect-demo-v1";

interface StoreState {
  users: UserProfile[];
  jobs: InterviewJob[];
  applications: Application[];
  sessionUserId: string | null;
}

interface AppStoreValue {
  ready: boolean;
  user: UserProfile | null;
  users: UserProfile[];
  jobs: InterviewJob[];
  applications: Application[];
  login: (email: string, password: string) => { ok: boolean; message?: string };
  loginAsDemo: (role: Role) => void;
  logout: () => void;
  updateProfile: (patch: Partial<UserProfile>) => void;
  createJob: (
    input: Omit<
      InterviewJob,
      "id" | "companyId" | "companyName" | "createdAt" | "applicantCount" | "status"
    > & { status?: JobStatus },
  ) => InterviewJob;
  updateJobStatus: (jobId: string, status: JobStatus) => void;
  applyToJob: (
    jobId: string,
    answers: Record<string, string | string[]>,
    proposedSlots: string[],
  ) => { ok: boolean; message?: string };
  updateApplicationStatus: (
    applicationId: string,
    status: ApplicationStatus,
    extra?: Partial<Application>,
  ) => void;
  confirmSchedule: (applicationId: string, slot: string) => void;
  resetDemo: () => void;
}

const AppStoreContext = createContext<AppStoreValue | null>(null);

function initialState(): StoreState {
  return {
    users: seedUsers,
    jobs: seedJobs,
    applications: seedApplications,
    sessionUserId: null,
  };
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreState>(initialState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoreState;
        setState({ ...initialState(), ...parsed });
      }
    } catch {
      // ignore
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, ready]);

  const user = useMemo(
    () => state.users.find((u) => u.id === state.sessionUserId) ?? null,
    [state.users, state.sessionUserId],
  );

  const login = useCallback((email: string, password: string) => {
    if (password !== DEMO_PASSWORD) {
      return { ok: false, message: "パスワードが正しくありません（デモ用: demo1234）" };
    }
    const found = seedUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      return { ok: false, message: "登録されていないメールアドレスです" };
    }
    setState((s) => ({ ...s, sessionUserId: found.id }));
    return { ok: true };
  }, []);

  const loginAsDemo = useCallback((role: Role) => {
    const found = seedUsers.find((u) => u.role === role);
    if (found) setState((s) => ({ ...s, sessionUserId: found.id }));
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, sessionUserId: null }));
  }, []);

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setState((s) => ({
      ...s,
      users: s.users.map((u) =>
        u.id === s.sessionUserId ? { ...u, ...patch, id: u.id, role: u.role, email: u.email } : u,
      ),
    }));
  }, []);

  const createJob = useCallback(
    (
      input: Omit<
        InterviewJob,
        "id" | "companyId" | "companyName" | "createdAt" | "applicantCount" | "status"
      > & { status?: JobStatus },
    ) => {
      const company = state.users.find((u) => u.id === state.sessionUserId);
      const job: InterviewJob = {
        ...input,
        id: uid("job"),
        companyId: company?.id ?? "company-1",
        companyName: company?.companyName ?? "デモ企業",
        status: input.status ?? "pending_review",
        createdAt: new Date().toISOString(),
        applicantCount: 0,
      };
      setState((s) => ({ ...s, jobs: [job, ...s.jobs] }));
      return job;
    },
    [state.sessionUserId, state.users],
  );

  const updateJobStatus = useCallback((jobId: string, status: JobStatus) => {
    setState((s) => ({
      ...s,
      jobs: s.jobs.map((j) => (j.id === jobId ? { ...j, status } : j)),
    }));
  }, []);

  const applyToJob = useCallback(
    (
      jobId: string,
      answers: Record<string, string | string[]>,
      proposedSlots: string[],
    ) => {
      if (!state.sessionUserId) return { ok: false, message: "ログインが必要です" };
      const current = state.users.find((u) => u.id === state.sessionUserId);
      if (!current || current.role !== "user") {
        return { ok: false, message: "ユーザーアカウントでログインしてください" };
      }
      const exists = state.applications.some(
        (a) => a.jobId === jobId && a.userId === current.id,
      );
      if (exists) return { ok: false, message: "すでに応募済みの案件です" };

      const app: Application = {
        id: uid("app"),
        jobId,
        userId: current.id,
        userName: current.name,
        userAge: current.age,
        userPrefecture: current.prefecture,
        userOccupation: current.occupation,
        status: "applied",
        answers,
        proposedSlots,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setState((s) => ({
        ...s,
        applications: [app, ...s.applications],
        jobs: s.jobs.map((j) =>
          j.id === jobId ? { ...j, applicantCount: j.applicantCount + 1 } : j,
        ),
      }));
      return { ok: true };
    },
    [state.applications, state.sessionUserId, state.users],
  );

  const updateApplicationStatus = useCallback(
    (applicationId: string, status: ApplicationStatus, extra?: Partial<Application>) => {
      setState((s) => ({
        ...s,
        applications: s.applications.map((a) =>
          a.id === applicationId
            ? { ...a, ...extra, status, updatedAt: new Date().toISOString() }
            : a,
        ),
      }));
    },
    [],
  );

  const confirmSchedule = useCallback((applicationId: string, slot: string) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.id === applicationId
          ? {
              ...a,
              status: "confirmed",
              confirmedSlot: slot,
              meetingUrl: a.meetingUrl || "https://meet.google.com/demo-interview-room",
              updatedAt: new Date().toISOString(),
            }
          : a,
      ),
    }));
  }, []);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialState());
  }, []);

  const value: AppStoreValue = {
    ready,
    user,
    users: state.users,
    jobs: state.jobs,
    applications: state.applications,
    login,
    loginAsDemo,
    logout,
    updateProfile,
    createJob,
    updateJobStatus,
    applyToJob,
    updateApplicationStatus,
    confirmSchedule,
    resetDemo,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider");
  return ctx;
}
