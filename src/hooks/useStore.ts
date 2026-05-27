'use client';

import { useEffect, useState } from 'react';
import {
  getForm,
  getForms,
  getResponses,
  subscribe,
  type SavedForm,
  type Submission,
} from '@/lib/store';

/** Live list of saved forms — refreshes on any store change (this tab or another). */
export function useForms(): SavedForm[] {
  const [forms, setForms] = useState<SavedForm[]>([]);
  useEffect(() => {
    const refresh = () => setForms(getForms());
    refresh();
    return subscribe(refresh);
  }, []);
  return forms;
}

/** Live single form + its responses. `form` is undefined until read on mount. */
export function useFormWithResponses(id: string): {
  form: SavedForm | null;
  responses: Submission[];
  loaded: boolean;
} {
  const [state, setState] = useState<{
    form: SavedForm | null;
    responses: Submission[];
    loaded: boolean;
  }>({ form: null, responses: [], loaded: false });

  useEffect(() => {
    const refresh = () =>
      setState({ form: getForm(id), responses: getResponses(id), loaded: true });
    refresh();
    return subscribe(refresh);
  }, [id]);

  return state;
}
