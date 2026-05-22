import type { components } from '@/api';

export type MockUser = components['schemas']['models.User'];
export type MockTask = components['schemas']['models.Task'];
export type MockTag = components['schemas']['models.Tag'];
export type MockComment = components['schemas']['models.Comment'];

export type MockGroup = {
  id: number;
  name: string;
  is_default: boolean;
  member_count: number;
  created_by: number;
};

export type MockGroupInvitation = {
  id: number;
  group_id: number;
  invited_user_id: number;
  invited_by_user_id: number;
  status: string;
  group?: { id: number; name: string };
};

export type MockStore = {
  users: MockUser[];
  tasks: MockTask[];
  tags: MockTag[];
  comments: MockComment[];
  groups: MockGroup[];
  groupInvitations: MockGroupInvitation[];
  nextTaskId: number;
  nextTagId: number;
  nextCommentId: number;
  nextInvitationId: number;
};

const now = new Date().toISOString();
const today = new Date().toISOString().split('T')[0];

const e2eUser: MockUser = {
  id: 1,
  username: 'e2euser',
  email: 'e2e@test.com',
  notifications_enabled: false,
  telegram_chat_id: '',
  created_at: now,
  updated_at: now,
};

const otherUser: MockUser = {
  id: 2,
  username: 'outrouser',
  email: 'outro@test.com',
  notifications_enabled: false,
  telegram_chat_id: '',
  created_at: now,
  updated_at: now,
};

function buildTask(partial: Partial<MockTask> & Pick<MockTask, 'id' | 'title'>): MockTask {
  return {
    id: partial.id,
    title: partial.title,
    description: partial.description ?? 'Descrição da tarefa',
    type: partial.type ?? 'casa',
    priority: partial.priority ?? 'media',
    completed: partial.completed ?? false,
    due_date: partial.due_date ?? `${today}T18:00:00.000Z`,
    user_id: partial.user_id ?? e2eUser.id,
    assigned_by: partial.assigned_by ?? 0,
    assigned_by_user: partial.assigned_by_user ?? e2eUser,
    user: partial.user ?? e2eUser,
    tags: partial.tags ?? [],
    comments: partial.comments ?? [],
    shared_with: partial.shared_with ?? [],
    created_at: partial.created_at ?? now,
    updated_at: partial.updated_at ?? now,
  };
}

const initialTasks: MockTask[] = [
  buildTask({
    id: 1,
    title: 'Tarefa de teste E2E',
    description: 'Primeira tarefa seed para listagem',
    completed: false,
  }),
  buildTask({
    id: 2,
    title: 'Reunião de equipe',
    description: 'Tarefa em andamento',
    type: 'trabalho',
    completed: false,
    priority: 'alta',
  }),
  buildTask({
    id: 3,
    title: 'Tarefa concluída',
    description: 'Já finalizada',
    completed: true,
  }),
  buildTask({
    id: 4,
    title: 'Tarefa delegada',
    description: 'Atribuída a outro usuário',
    user_id: otherUser.id,
    user: otherUser,
    assigned_by: e2eUser.id,
    assigned_by_user: e2eUser,
  }),
];

const defaultGroup: MockGroup = {
  id: 1,
  name: 'Os de casa',
  is_default: true,
  member_count: 2,
  created_by: e2eUser.id,
};

let store: MockStore = {
  users: [e2eUser, otherUser],
  tasks: [...initialTasks],
  tags: [],
  comments: [],
  groups: [defaultGroup],
  groupInvitations: [],
  nextTaskId: 5,
  nextTagId: 1,
  nextCommentId: 1,
  nextInvitationId: 1,
};

export const getStore = (): MockStore => store;

export const resetStore = (): void => {
  store = {
    users: [e2eUser, otherUser],
    tasks: initialTasks.map((t) => ({ ...t })),
    tags: [],
    comments: [],
    groups: [{ ...defaultGroup }],
    groupInvitations: [],
    nextTaskId: 5,
    nextTagId: 1,
    nextCommentId: 1,
    nextInvitationId: 1,
  };
};

export const getE2eUser = (): MockUser => e2eUser;
