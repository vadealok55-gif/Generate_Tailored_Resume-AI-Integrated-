import { create } from 'zustand';
import { temporal } from 'zundo';
import { Resume } from '../lib/schema/resume';

interface EditorState {
  resume: Resume | null;
  isDirty: boolean;
  activeSectionId: string | null;
  activeAIPanel: string | null; // sectionId or 'global'
  aiPanelTab: 'quick' | 'structured';
  isGenerating: boolean;
  pendingAIPreview: Resume | null; // before/after state
  setResume: (resume: Resume) => void;
  updateSection: (sectionId: string, content: any) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  openAIPanel: (sectionId: string | null, tab: 'quick' | 'structured') => void;
  setPendingPreview: (content: Resume | null) => void;
  acceptAIPreview: () => void;
  discardAIPreview: () => void;
  markSaved: () => void;
}

export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      resume: null,
      isDirty: false,
      activeSectionId: null,
      activeAIPanel: null,
      aiPanelTab: 'quick',
      isGenerating: false,
      pendingAIPreview: null,

      setResume: (resume) => set({ resume, isDirty: false }),

      updateSection: (sectionId, content) =>
        set((state) => {
          if (!state.resume) return {};
          const sections = state.resume.sections.map((sec) =>
            sec.id === sectionId ? { ...sec, content } : sec
          );
          return {
            resume: { ...state.resume, sections, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        }),

      reorderSections: (fromIndex, toIndex) =>
        set((state) => {
          if (!state.resume) return {};
          const sections = [...state.resume.sections];
          const [removed] = sections.splice(fromIndex, 1);
          sections.splice(toIndex, 0, removed);
          const reordered = sections.map((sec, i) => ({ ...sec, order: i }));
          return {
            resume: { ...state.resume, sections: reordered, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        }),

      toggleSectionVisibility: (sectionId) =>
        set((state) => {
          if (!state.resume) return {};
          const sections = state.resume.sections.map((sec) =>
            sec.id === sectionId ? { ...sec, visible: !sec.visible } : sec
          );
          return {
            resume: { ...state.resume, sections, updatedAt: new Date().toISOString() },
            isDirty: true,
          };
        }),

      openAIPanel: (sectionId, tab) =>
        set({
          activeAIPanel: sectionId,
          aiPanelTab: tab,
        }),

      setPendingPreview: (preview) =>
        set({
          pendingAIPreview: preview,
        }),

      acceptAIPreview: () =>
        set((state) => {
          if (!state.pendingAIPreview) return {};
          return {
            resume: state.pendingAIPreview,
            pendingAIPreview: null,
            activeAIPanel: null,
            isDirty: true,
          };
        }),

      discardAIPreview: () =>
        set({
          pendingAIPreview: null,
          activeAIPanel: null,
        }),

      markSaved: () => set({ isDirty: false }),
    }),
    { limit: 50 }
  )
);
