import 'styled-components';
import type { AppTheme } from '@/styles/theme';

declare module 'styled-components' {
  // Augment styled-components' DefaultTheme so `props.theme` is fully typed.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends AppTheme {}
}
